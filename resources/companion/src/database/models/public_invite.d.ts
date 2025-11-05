import { BaseEntity } from 'typeorm';
export declare class PublicInvite extends BaseEntity {
    id: string;
    user_id: string;
    email: string;
    created: Date;
    static createInvite(id: string, email: string): Promise<string>;
    static deleteExpired(): Promise<void>;
    static findByToken(token: string): Promise<PublicInvite>;
}
