import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import { buildSchema } from 'type-graphql';
import Redis from 'ioredis';
import session from 'express-session';
import redisConnect from 'connect-redis';
import cors from 'cors';
import { createConnection } from 'typeorm';

import { HelloResolver } from './resolvers/hello';
import { PostResolver } from './resolvers/post';
import { UserResolver } from './resolvers/user';
import { MyContext } from './types';
import { cookieSession, __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';
import { Updoot } from './entities/Updoot';

const main = async () => {
  const con = await createConnection({
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_NAME || 'muneddit',
    type: 'postgres',
    logging: !__prod__,
    synchronize: !__prod__,
    entities: [Post, User, Updoot],
  });

  const app = express();

  const RedisStore = redisConnect(session);
  const redis = new Redis({
    host: process.env.REDIS_HOST,
  });

  app.use(
    cors({
      origin: 'http://localhost:8080',
      credentials: true,
    })
  );

  app.use(
    session({
      name: cookieSession,
      store: new RedisStore({
        client: redis,
        disableTTL: true,
        disableTouch: true,
      }),
      cookie: {
        maxAge: 1000 * 60 * 60 * 24 * 365 * 10,
        httpOnly: true,
        sameSite: 'lax',
        secure: __prod__,
      },
      saveUninitialized: false,
      secret: 'nsdjkfgjsdhpupdfv',
      resave: false,
    })
  );

  const apolloServer = new ApolloServer({
    schema: await buildSchema({
      resolvers: [HelloResolver, PostResolver, UserResolver],
      validate: false,
    }),
    context: ({ req, res }): MyContext => ({ req, res, redis }),
  });

  apolloServer.applyMiddleware({
    app,
    cors: {
      origin: false,
    },
  });

  app.listen(3000, () => {
    console.log(3000);
  });
};

main();
