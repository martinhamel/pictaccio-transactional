import { BaseEntity } from 'typeorm';
interface BaseEntityConstraint<T extends BaseEntity> {
    new (): T;
}
declare class Upload<T extends BaseEntity> {
    allowedMimes: RegExp[];
    allowMultiple: boolean;
    maxSizeInBytes: number;
    path: string;
}
export declare class ModelMetadata<T extends BaseEntity> {
    allowedOnWire: (keyof T)[];
    allowedUploads: {
        [Property in keyof T]: Upload<T>;
    };
}
export declare function getMetadata<T extends BaseEntity>(model: BaseEntityConstraint<T>): ModelMetadata<T>;
export {};
