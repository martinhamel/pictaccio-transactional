"use strict";
var PublicAppIntegration_1;
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PublicAppIntegration = void 0;
const tslib_1 = require("tslib");
const app_integration_configuration_1 = require("core/types/app_integration_configuration");
const app_integration_type_1 = require("core/types/app_integration_type");
const typeorm_1 = require("typeorm");
let PublicAppIntegration = PublicAppIntegration_1 = class PublicAppIntegration extends typeorm_1.BaseEntity {
    static async get(app) {
        if (!app) {
            const apps = await this.find();
            const appIntegrations = {};
            apps.map((app) => {
                appIntegrations[app.app] = app.configuration;
            });
            return appIntegrations;
        }
        return { [app]: (await this.findOne({ where: { app } }))?.configuration };
    }
    static async set(app, values) {
        const appIntegration = new PublicAppIntegration_1();
        appIntegration.app = app;
        appIntegration.configuration = values;
        await PublicAppIntegration_1.upsert(appIntegration, ['app']);
        appIntegration.configuration.active = appIntegration.active;
        return appIntegration;
    }
};
exports.PublicAppIntegration = PublicAppIntegration;
tslib_1.__decorate([
    (0, typeorm_1.PrimaryColumn)({ type: 'text', enum: app_integration_type_1.AppIntegrationTypes, primaryKeyConstraintName: 'app_integrations_app_pkey' }),
    tslib_1.__metadata("design:type", typeof (_a = typeof app_integration_type_1.AppIntegrationType !== "undefined" && app_integration_type_1.AppIntegrationType) === "function" ? _a : Object)
], PublicAppIntegration.prototype, "app", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Index)('app_integrations_active_idx', { unique: false }),
    (0, typeorm_1.Column)({
        type: 'boolean',
        asExpression: '(configuration->>\'active\')::boolean',
        generatedType: 'STORED'
    }),
    tslib_1.__metadata("design:type", Boolean)
], PublicAppIntegration.prototype, "active", void 0);
tslib_1.__decorate([
    (0, typeorm_1.Column)({ type: 'jsonb' }),
    tslib_1.__metadata("design:type", typeof (_b = typeof app_integration_configuration_1.AppIntegrationConfigurationUnion !== "undefined" && app_integration_configuration_1.AppIntegrationConfigurationUnion) === "function" ? _b : Object)
], PublicAppIntegration.prototype, "configuration", void 0);
exports.PublicAppIntegration = PublicAppIntegration = PublicAppIntegration_1 = tslib_1.__decorate([
    (0, typeorm_1.Entity)({ name: 'app_integrations', schema: 'public' })
], PublicAppIntegration);
//# sourceMappingURL=public_app_integration.js.map