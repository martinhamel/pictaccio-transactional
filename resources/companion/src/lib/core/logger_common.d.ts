import { Request } from 'lib/core/request';
export interface HttpCommonFieldsInterface {
    access_granted: boolean;
    correlation_id: string;
    http_method: string;
    resource_name: string;
    session_id: string;
    src_ip: string;
    src_user_email: string;
    src_user_id: string;
    src_user_roles: string[];
}
export declare function httpCommonFields(request: Request): HttpCommonFieldsInterface;
