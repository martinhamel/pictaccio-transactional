import { AppIntegrationType } from 'core/types/app_integration_type';
export type AppIntegrationConfiguration = {
    app: AppIntegrationType;
    configuration: AppIntegrationConfigurationUnion;
};
export type AppIntegrationConfigurationUnion = AppIntegrationConfigurationCanadaPost | AppIntegrationConfigurationElavon | AppIntegrationConfigurationPaypal | AppIntegrationConfigurationStripe;
export type AppIntegrationConfigurations = {
    [app in AppIntegrationType]?: AppIntegrationConfigurationUnion;
};
export type AppIntegrationSharedConfiguration = {
    active: boolean;
};
export type AppIntegrationConfigurationCanadaPost = AppIntegrationSharedConfiguration & {
    customerId: string;
    username: string;
    password: string;
};
export declare function isAppIntegrationConfigurationCanadaPost(config: AppIntegrationConfigurationUnion, appName: AppIntegrationType): config is AppIntegrationConfigurationCanadaPost;
export type AppIntegrationConfigurationElavon = AppIntegrationSharedConfiguration & {
    merchantId: string;
    userId: string;
    pin: string;
};
export type AppIntegrationConfigurationPaypal = AppIntegrationSharedConfiguration & {
    username: string;
    password: string;
    signature: string;
    endpoint: string;
};
export type AppIntegrationConfigurationStripe = AppIntegrationSharedConfiguration & {
    publishableKey: string;
    secretKey: string;
    endpoint: string;
};
export declare function isAppIntegrationConfigurationElavon(config: AppIntegrationConfigurationUnion, appName: AppIntegrationType): config is AppIntegrationConfigurationElavon;
export declare function isAppIntegrationConfigurationPaypal(config: AppIntegrationConfigurationUnion, appName: AppIntegrationType): config is AppIntegrationConfigurationPaypal;
export declare function isAppIntegrationConfigurationStripe(config: AppIntegrationConfigurationUnion, appName: AppIntegrationType): config is AppIntegrationConfigurationStripe;
