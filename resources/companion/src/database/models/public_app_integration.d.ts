import { AppIntegrationConfigurations, AppIntegrationConfigurationUnion } from 'core/types/app_integration_configuration';
import { AppIntegrationType } from 'core/types/app_integration_type';
import { BaseEntity } from 'typeorm';
export declare class PublicAppIntegration extends BaseEntity {
    app: AppIntegrationType;
    active: boolean;
    configuration: AppIntegrationConfigurationUnion;
    static get(app?: AppIntegrationType): Promise<AppIntegrationConfigurations>;
    static set(app: AppIntegrationType, values: AppIntegrationConfigurationUnion): Promise<PublicAppIntegration>;
}
