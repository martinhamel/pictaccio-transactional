import { AppIntegrationType } from 'core/types/app_integration_type';

export type AppIntegrationConfiguration = {
    app: AppIntegrationType;
    configuration: AppIntegrationConfigurationUnion;
}

export type AppIntegrationConfigurationUnion =
    AppIntegrationConfigurationCanadaPost |
    AppIntegrationConfigurationElavon |
    AppIntegrationConfigurationPaypal |
    AppIntegrationConfigurationStripe;

export type AppIntegrationConfigurations = {
    [app in AppIntegrationType]?: AppIntegrationConfigurationUnion;
}

export type AppIntegrationSharedConfiguration = {
    active: boolean;
}

export type AppIntegrationConfigurationCanadaPost = AppIntegrationSharedConfiguration & {
    customerId: string;
    username: string;
    password: string;
}

export function isAppIntegrationConfigurationCanadaPost(config: AppIntegrationConfigurationUnion,
                                                        appName: AppIntegrationType)
        : config is AppIntegrationConfigurationCanadaPost {
    return config !== undefined && appName === 'canada-post';
}

export type AppIntegrationConfigurationElavon = AppIntegrationSharedConfiguration & {
    merchantId: string;
    userId: string;
    pin: string;
}

export type AppIntegrationConfigurationPaypal = AppIntegrationSharedConfiguration & {
    username: string;
    password: string;
    signature: string;
    endpoint: string;
}

export type AppIntegrationConfigurationStripe = AppIntegrationSharedConfiguration & {
    publishableKey: string;
    secretKey: string;
    endpoint: string;
}

export function isAppIntegrationConfigurationElavon(config: AppIntegrationConfigurationUnion,
                                                    appName: AppIntegrationType)
    : config is AppIntegrationConfigurationElavon {
    return config !== undefined && appName === 'elavon';
}

export function isAppIntegrationConfigurationPaypal(config: AppIntegrationConfigurationUnion,
                                                    appName: AppIntegrationType)
        : config is AppIntegrationConfigurationPaypal {
    return config !== undefined && appName === 'paypal';
}

export function isAppIntegrationConfigurationStripe(config: AppIntegrationConfigurationUnion,
                                                    appName: AppIntegrationType)
        : config is AppIntegrationConfigurationStripe {
    return config !== undefined && appName === 'stripe';
}
