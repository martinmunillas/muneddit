import path from 'path';

import { MikroORM } from '@mikro-orm/core';

import { __prod__ } from './constants';
import { Post } from './entities/Post';

const config = {
  migrations: {
    path: path.join(__dirname, './migrations'),
    pattern: /^[\w-]+\d+\.[jt]s$/,
  },
  entities: [Post],
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME || 'muneddit',
  type: 'postgresql',
  debug: !__prod__,
} as Parameters<typeof MikroORM.init>[0];

export default config;
