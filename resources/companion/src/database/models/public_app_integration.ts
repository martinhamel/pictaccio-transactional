import {
    AppIntegrationConfigurations,
    AppIntegrationConfigurationUnion
} from 'core/types/app_integration_configuration';
import { AppIntegrationType, AppIntegrationTypes } from 'core/types/app_integration_type';
import { BaseEntity, Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({name: 'app_integrations', schema: 'public'})
export class PublicAppIntegration extends BaseEntity {
    @PrimaryColumn({type: 'text', enum: AppIntegrationTypes, primaryKeyConstraintName: 'app_integrations_app_pkey'})
    public app: AppIntegrationType;

    @Index('app_integrations_active_idx', { unique: false })
    @Column({
        type: 'boolean',
        asExpression: '(configuration->>\'active\')::boolean',
        generatedType: 'STORED'
    })
    public active: boolean;

    @Column({type: 'jsonb'})
    public configuration: AppIntegrationConfigurationUnion;

    /* PUBLIC */
    public static async get(app?: AppIntegrationType): Promise<AppIntegrationConfigurations> {
        if (!app) {
            const apps = await this.find();
            const appIntegrations = {};

            apps.map((app) => {
                appIntegrations[app.app] = app.configuration;
            });
            return appIntegrations;
        }
        return { [app]: (await this.findOne({where: {app}}))?.configuration };
    }

    public static async set(app: AppIntegrationType,
                            values: AppIntegrationConfigurationUnion): Promise<PublicAppIntegration> {
        const appIntegration = new PublicAppIntegration();

        appIntegration.app = app;
        appIntegration.configuration = values;

        await PublicAppIntegration.upsert(appIntegration, ['app']);
        appIntegration.configuration.active = appIntegration.active;

        return appIntegration;
    }
}
