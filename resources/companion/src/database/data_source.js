"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.dataSourcePromise = exports.AppDataSource = void 0;
const typedi_1 = require("typedi");
const typeorm_1 = require("typeorm");
const config = typedi_1.Container.get('config');
let dataSourcePromiseResolve = null;
exports.AppDataSource = new typeorm_1.DataSource({
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
exports.dataSourcePromise = new Promise(resolve => dataSourcePromiseResolve = resolve);
exports.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
    dataSourcePromiseResolve();
})
    .catch((err) => {
    console.error("Error during Data Source initialization", err);
});
//# sourceMappingURL=data_source.js.map