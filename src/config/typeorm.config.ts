import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: '1.236.152.96',
    port: 5433,
    username: 'test',
    password: '1234qwer!',
    database: 'test',
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    poolSize: 10,
    logging: false
}