export declare class UploadOptions {
    multiple?: boolean;
    mimes?: string | string[];
    maxSizeInBytes?: number;
    path: string;
}
export declare function AllowUploads(options: UploadOptions): (target: any, propertyKey: string) => void;
