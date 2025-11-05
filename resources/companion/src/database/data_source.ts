import { Container } from 'typedi'
import { DataSource } from 'typeorm'
import { ConfigSchema } from 'core/config_schema';

const config: ConfigSchema = Container.get<ConfigSchema>('config');
let dataSourcePromiseResolve: () => void = null;

export const AppDataSource = new DataSource({
    // @ts-ignore
    type: config.db[0].type,
    host: config.db[0].host,
    port: config.db[0].port,
    username: config.db[0].username,
    password: config.db[0].password,
    database: config.db[0].database,
    schema: config.db[0].schema,
    entities: config.db[0].entitiesDir,
    migrations: config.db[0].migrationsDir,
    subscribers: config.db[0].subscribersDir
});

export const dataSourcePromise = new Promise<void>(resolve => dataSourcePromiseResolve = resolve);
AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
        dataSourcePromiseResolve();
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });
