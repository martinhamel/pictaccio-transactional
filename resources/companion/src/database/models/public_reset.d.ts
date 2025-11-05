import { BaseEntity } from 'typeorm';
export declare class PublicReset extends BaseEntity {
    id: string;
    user_id: string;
    email: string;
    code: string;
    created: Date;
    static checkResetEntry(email: string, code: string, resetToken?: string): Promise<{
        valid: boolean;
        resetToken: string;
    }>;
    static createResetEntry(userId: string, email: string, code: string): void;
    static deleteExpired(): Promise<void>;
    static deleteFromResetToken(resetToken: string): Promise<void>;
}
