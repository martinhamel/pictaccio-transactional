import { Container } from 'typedi';
import { createConnections, ConnectionOptions, SelectQueryBuilder } from 'typeorm';
import { LoaderInterface } from 'lib/bootstrap';
import { logger } from 'lib/core/logger';
import { ConfigSchema } from 'core/config_schema';

declare module 'typeorm' {
    interface SelectQueryBuilder<Entity> {
        whereExists<T>(query: SelectQueryBuilder<T>): this;
        andWhereExists<T>(query: SelectQueryBuilder<T>): this;
        orWhereExists<T>(query: SelectQueryBuilder<T>): this;
    }
}

function installTypeormShims() {
    SelectQueryBuilder.prototype.whereExists = function (query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
        return this.where(`EXISTS (${query.getQuery()})`, query.getParameters());
    };
    SelectQueryBuilder.prototype.andWhereExists = function (query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
        return this.andWhere(`EXISTS (${query.getQuery()})`, query.getParameters());
    };
    SelectQueryBuilder.prototype.orWhereExists = function (query: SelectQueryBuilder<any>): SelectQueryBuilder<any> {
        return this.orWhere(`EXISTS (${query.getQuery()})`, query.getParameters());
    };
}

export const typeormLoader: LoaderInterface = async (): Promise<any> => {
    const config = Container.get<ConfigSchema>('config');

    installTypeormShims();
    const {dataSourcePromise} = await import('../../database/data_source');
    await dataSourcePromise;
}
