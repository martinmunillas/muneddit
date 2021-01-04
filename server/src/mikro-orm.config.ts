import path from 'path';

import { MikroORM } from '@mikro-orm/core';

import { __prod__ } from './constants';
import { Post } from './entities/Post';
import { User } from './entities/User';

const config = {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
  entities: [Post, User],
  host: process.env.POSTGRES_HOST,
  password: process.env.POSTGRES_PASSWORD,
  dbName: process.env.POSTGRES_NAME || 'muneddit',
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

export default config;
