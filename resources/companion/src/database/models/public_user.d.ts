import { BaseEntity } from 'typeorm';
export declare enum UserStatus {
    Ghost = "ghost",
    Invited = "invited",
    Created = "created",
    Enabled = "enabled",
    Disabled = "disabled"
}
export type UserInfo = {
    avatar?: string;
    name?: string;
};
export declare class PublicUser extends BaseEntity {
    id: string;
    status: UserStatus;
    email: string;
    rev: number;
    hash: string;
    salt: string;
    seed: string;
    roles_json: string;
    info_json: string;
    created: Date;
    last_login: Date;
    static createUser(email: string, status: UserStatus, roles: string[], rev: number): Promise<string>;
    static deleteUser(id: string): Promise<boolean>;
    static emailExists(email: string): Promise<boolean>;
    static enableUser(id: string, enabled: boolean): Promise<boolean>;
    static findByEmail(email: string): Promise<PublicUser>;
    static setLastLogin(id: string): Promise<void>;
    static setStatus(id: string, status: UserStatus): Promise<void>;
    static setUserHashAndSalt(id: string, hash: string, salt: string): Promise<void>;
    static setUserInfo(id: string, userInfo: UserInfo): Promise<void>;
    static setUserRoles(id: string, roles: string[]): Promise<void>;
    static setUserSeed(id: string, seed: string): Promise<void>;
    static getUserInfo(id: string): Promise<any>;
}
