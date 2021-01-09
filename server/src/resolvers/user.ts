import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
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

@InputType()
class UserInput {
  @Field()
  email: string;
  @Field()
  password: string;
}

@ObjectType()
class Error {
  @Field()
  field: string;

  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [Error], { nullable: true })
  errors?: Error[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Mutation(() => UserResponse)
  async register(
    @Arg('options') options: UserInput,
    @Ctx() { em }: MyContext
  ): Promise<UserResponse> {
    if (!options.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
      return {
        errors: [{ field: 'email', message: 'Please insert a valid email' }],
      };
    } else if (options.password.length < 6) {
      return {
        errors: [
          {
            field: 'password',
            message: 'Passwords must be at least 6 characters long',
          },
        ],
      };
    } else if (await em.findOne(User, { email: options.email })) {
      return {
        errors: [
          {
            field: 'email',
            message: 'That email already exists',
          },
        ],
      };
    }
    const hashedPassword = await argon2.hash(options.password);
    let hash, username;
    while (true) {
      hash =
        '_' +
        parseInt((Math.random() * 9).toString()) +
        parseInt((Math.random() * 9).toString()) +
        parseInt((Math.random() * 9).toString()) +
        parseInt((Math.random() * 9).toString());
      username = options.email.substr(0, options.email.indexOf('@')) + hash;
      if (!(await em.findOne(User, { username }))) {
        break;
      }
    }
    const user = em.create(User, {
      username,
      password: hashedPassword,
      name: '',
      email: options.email,
    });
    await em.persistAndFlush(user);
    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg('options') options: UserInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { email: options.email });
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

  @Mutation(() => Boolean)
  async forgotPassword(
    @Arg('email') email: string,
    @Ctx() { em, redis }: MyContext
  ) {
    const user = await em.findOne(User, { email });

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
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId) {
      return null;
    }

    return await em.findOne(User, { id: req.session.userId });
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext) {
    return new Promise((resolve) =>
      req.session.destroy((err) => {
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
