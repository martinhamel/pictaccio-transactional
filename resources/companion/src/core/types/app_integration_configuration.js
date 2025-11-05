"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAppIntegrationConfigurationCanadaPost = isAppIntegrationConfigurationCanadaPost;
exports.isAppIntegrationConfigurationElavon = isAppIntegrationConfigurationElavon;
exports.isAppIntegrationConfigurationPaypal = isAppIntegrationConfigurationPaypal;
exports.isAppIntegrationConfigurationStripe = isAppIntegrationConfigurationStripe;
function isAppIntegrationConfigurationCanadaPost(config, appName) {
    return config !== undefined && appName === 'canada-post';
}
function isAppIntegrationConfigurationElavon(config, appName) {
    return config !== undefined && appName === 'elavon';
}
function isAppIntegrationConfigurationPaypal(config, appName) {
    return config !== undefined && appName === 'paypal';
}
function isAppIntegrationConfigurationStripe(config, appName) {
    return config !== undefined && appName === 'stripe';
}
//# sourceMappingURL=app_integration_configuration.js.map