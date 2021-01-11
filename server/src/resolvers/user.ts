import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
} from 'type-graphql';
import argon2 from 'argon2';

import { MyContext } from '../types';
import { User } from '../entities/User';
import {
  cookieSession,
  FORGOT_PASSWORD_PREFIX,
  FRONTEND_URL,
} from '../constants';
import { sendEmail } from '../utils/sendEmail';
import { v4 } from 'uuid';
import { generateUsername } from '../utils/generateUsername';
import {
  emailIsValid,
  passwordIsValid,
  usernameIsValid,
} from '../utils/fieldValidators';
import { Post } from 'src/entities/Post';

@InputType()
class UserInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    return user.id === req.session.userId ? user.email : '';
  }

  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const errors: FieldError[] = [];
    if (!options.email) {
      errors.push({ field: 'email', message: 'Please insert an email' });
    } else if (!emailIsValid(options.email)) {
      errors.push({ field: 'email', message: 'Please insert a valid email' });
    } else if (await User.findOne({ where: { email: options.email } })) {
      errors.push({
        field: 'email',
        message: 'That email already exists',
      });
    }

    if (!options.password) {
      errors.push({ field: 'password', message: 'Please insert a password' });
    } else if (!passwordIsValid(options.email)) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Passwords must be at least 6 characters long',
          },
        ],
      };
    }

    if (errors.length) return { errors };

    const hashedPassword = await argon2.hash(options.password);
    const username = await generateUsername(options.email);
    const user = await User.create({
      username,
      password: hashedPassword,
      name: '',
      email: options.email,
    }).save();
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserInput,
    @Ctx() { req }: MyContext
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { email: options.email } });
    if (!user) {
      return {
        errors: [{ field: 'email', message: "That email doesn't exist" }],
      };
    }
    const valid = await argon2.verify(user.password, options.password);
    if (!valid) {
      return {
        errors: [{ field: 'password', message: 'Incorrect password' }],
      };
    }
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => UserResponse)
  async changePassword(
    @Arg('token') token: string,
    @Arg('newPassword') newPassword: string,
    @Ctx() { redis, req }: MyContext
  ): Promise<UserResponse> {
    const userId = await redis.get(FORGOT_PASSWORD_PREFIX + token);
    if (!userId) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Invalid token',
          },
        ],
      };
    }

    if (!passwordIsValid(newPassword)) {
      return {
        errors: [
          {
            field: 'newPassword',
            message: 'Passwords must be at least 6 characters long',
          },
        ],
      };
    }

    const user = await User.findOne(userId);

    if (!user) {
      return {
        errors: [
          {
            field: 'token',
            message: 'Invalid token',
          },
        ],
      };
    }

    const hashedPassword = await argon2.hash(newPassword);
    User.update({ id: user.id }, { password: hashedPassword });
    req.session.userId = user.id;
    return { user };
  }

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { redis }: MyContext
  ) {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return true;
    }

    const token = v4();

    await redis.set(
      FORGOT_PASSWORD_PREFIX + token,
      user.id,
      'ex',
      1000 * 60 * 60 * 24 * 3
    );

    sendEmail(
      email,
      'Forgot your password?',
      `<a href="${FRONTEND_URL}/forgot-password?q=${token}">
      Reset password
      </a>`
    );
    return true;
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: MyContext): Promise<User | undefined> {
    if (!req.session.userId) {
      return undefined;
    }

    return await User.findOne(req.session.userId);
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err: any) => {
        res.clearCookie(cookieSession);
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      })
    );
  }
}
