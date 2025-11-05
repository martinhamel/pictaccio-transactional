import { LoaderInterface } from 'lib/bootstrap';
declare module 'typeorm' {
    interface SelectQueryBuilder<Entity> {
        whereExists<T>(query: SelectQueryBuilder<T>): this;
        andWhereExists<T>(query: SelectQueryBuilder<T>): this;
        orWhereExists<T>(query: SelectQueryBuilder<T>): this;
    }
}
export declare const typeormLoader: LoaderInterface;
