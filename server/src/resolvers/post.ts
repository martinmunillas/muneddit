import { isAuth } from '../middleware/auth';
import { MyContext } from '../types';
import {
  Arg,
  Ctx,
  Field,
  FieldResolver,
  InputType,
  Int,
  Mutation,
  ObjectType,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from 'type-graphql';

import { Post } from '../entities/Post';
import { getConnection } from 'typeorm';
import { Updoot } from '../entities/Updoot';

@InputType()
class PostInput {
  @Field()
  title!: string;
  @Field()
  text!: string;
}

@ObjectType()
class PaginatedPosts {
  @Field(() => [Post])
  posts: Post[];
  @Field()
  hasMore: boolean;
}

@Resolver(Post)
export class PostResolver {
  @UseMiddleware(isAuth)
  @Mutation(() => Boolean)
  async vote(
    @Arg('postId', () => Int) postId: number,
    @Arg('value') value: number,
    @Ctx() { req }: MyContext
  ) {
    const { userId } = req.session;
    if (!userId || !postId) {
      return false;
    }

    const alreadyVote = await Updoot.findOne({ where: { userId, postId } });
    let actualValue: 1 | -1 | 0;

    if (value == 0) {
      actualValue = value;
    } else if (value > 0) {
      actualValue = 1;
    } else {
      actualValue = -1;
    }

    const postParams = [];

    if (alreadyVote) {
      Updoot.query(
        `
      update updoot     
      set value = $1
      where "userId" = $2 and "postId" = $3;
      `,
        [actualValue, userId, postId]
      );
      console.log(alreadyVote.value);
      postParams.push(actualValue - alreadyVote.value);
    } else {
      await Updoot.insert({
        postId,
        userId,
        value: actualValue,
      });
      postParams.push(actualValue);
    }
    postParams.push(postId);

    await Post.query(
      `
    update post     
    set points = points + $1
    where id = $2;
    `,
      postParams
    );
    return true;
  }

  @FieldResolver(() => String)
  textSnippet(@Root() post: Post) {
    return post.text.slice(0, 70);
  }

  @Query(() => PaginatedPosts)
  async posts(
    @Arg('limit', () => Int) limit: number,
    @Arg('cursor', () => String, { nullable: true }) cursor: string | null
  ): Promise<PaginatedPosts> {
    const realLimit = Math.min(limit, 50);

    const params: any[] = [limit + 1];
    if (cursor) {
      params.push(new Date(parseInt(cursor)));
    }

    const posts: Post[] = await getConnection().query(
      `
    select p.*, json_build_object(
      'id', u.id,
      'username', u.username,
      'email', u.email
    ) creator from post p
    inner join public.user u on u.id = p."creatorId"
    ${cursor ? `where p."createdAt" < $2` : ''}
    order by p."createdAt" DESC
    limit $1
    `,
      params
    );

    //   .getRepository(Post)
    //   .createQueryBuilder('p')
    //   .innerJoinAndSelect('p.creator', 'u', 'u.id = p."creatorId"')
    //   .orderBy('p."createdAt"', 'DESC')
    //   .take(realLimit + 1);

    // if (cursor) {
    //   qb.where('p."createdAt" < :cursor', { cursor: new Date(parseInt(cursor)) });
    // }

    // const posts = await qb.getMany();

    return {
      posts: posts.slice(0, realLimit),
      hasMore: posts.length === realLimit + 1,
    };
  }

  @Query(() => Post, { nullable: true })
  post(@Arg('id') id: number): Promise<Post | undefined> {
    return Post.findOne(id);
  }

  @UseMiddleware(isAuth)
  @Mutation(() => Post)
  async createPost(
    @Arg('options') options: PostInput,
    @Ctx() { req }: MyContext
  ): Promise<Post> {
    return Post.create({ ...options, creatorId: req.session.userId }).save();
  }

  @Mutation(() => Post, { nullable: true })
  async updatePost(
    @Arg('title', () => String, { nullable: true }) title: string,
    @Arg('id') id: number
  ): Promise<Post | null> {
    const post = await Post.findOne(id);
    if (!post) {
      return null;
    }
    if (typeof title !== 'undefined') {
      await Post.update({ id }, { title });
    }
    return post;
  }

  @Mutation(() => Boolean)
  async deletePost(@Arg('id') id: number): Promise<boolean> {
    await Post.delete(id);
    return true;
  }
}
