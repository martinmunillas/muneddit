import { MikroORM } from '@mikro-orm/core';

import ormConfig from './mikro-orm.config';
import { Post } from './entities/Post';

const main = async () => {
  const orm = await MikroORM.init(ormConfig);
  await orm.getMigrator().up();
//   const post = orm.em.create(Post, { title: 'First Post ever' });
//   await orm.em.persistAndFlush(post);

//   const posts = await orm.em.find(Post, {})
//   console.log(posts)
};

main();
