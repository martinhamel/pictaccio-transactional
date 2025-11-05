import { EntitySubscriberInterface } from 'typeorm';
export declare class JsonSubscriber implements EntitySubscriberInterface<any> {
    afterLoad(entity: any): void;
}
