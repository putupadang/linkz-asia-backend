import { BaseEntity, User } from './entities';
import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { MongoDriver } from '@mikro-orm/mongodb';

const mikroOrmConfig: MikroOrmModuleOptions = {
  dbName: 'linkz-asia',
  clientUrl: 'mongodb://localhost:27018',
  entities: [BaseEntity, User],
  debug: true,
  driver: MongoDriver,
};

export default mikroOrmConfig;
