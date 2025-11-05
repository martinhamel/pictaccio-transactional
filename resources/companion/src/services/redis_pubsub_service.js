"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisPubsubService = void 0;
const tslib_1 = require("tslib");
const config_schema_1 = require("core/config_schema");
const fast_store_interface_1 = require("core/fast_store_interface");
const app_integration_configuration_1 = require("core/types/app_integration_configuration");
const public_app_integration_1 = require("database/models/public_app_integration");
const logger_1 = require("lib/core/logger");
const mutex_1 = require("lib/core/mutex");
const node_http_1 = require("node:http");
const node_path_1 = require("node:path");
const typedi_1 = require("typedi");
const escape_config_string_1 = require("utils/escape_config_string");
const file_1 = require("utils/file");
const Languages = [
    'en',
    'fr'
];
let RedisPubsubService = class RedisPubsubService {
    constructor(fastStore, config) {
        this.fastStore = fastStore;
        this.config = config;
        this._configDonePromise = null;
        this._configDoneResolve = null;
        this._configMutex = new mutex_1.Mutex();
    }
    init() {
        logger_1.logger.info('Initializing RedisPubsubService');
        this._listenAppIntegrationsUpdates();
        this._listenBackgroundUpdates();
        this._listenConfigDone();
        this._listenConfiguredLanguagesUpdates();
        this._listenStoreConfigurationUpdates();
        this._listenStoreCustomizationUpdates();
        this._listenStoreNotifyEmailsUpdates();
        this._listenStoreShutdownUpdates();
    }
    initConfigPrepare() {
        logger_1.logger.info('Preparing init config promises');
        this._configDonePromise = new Promise(resolve => this._configDoneResolve = resolve);
    }
    initConfigDone() {
        return this._configDonePromise;
    }
    _listenAppIntegrationsUpdates() {
        this.fastStore.subscribe('app-integrations:changed', async (appName) => {
            logger_1.logger.info('Received app-integrations:changed');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Processing app-integrations:changed');
                const app = await public_app_integration_1.PublicAppIntegration.get(appName);
                let config = (await (0, file_1.readFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'))).toString();
                if ((0, app_integration_configuration_1.isAppIntegrationConfigurationCanadaPost)(app['canada-post'], appName)) {
                    const username = (0, escape_config_string_1.escapeConfigString)(app['canada-post'].username);
                    const password = (0, escape_config_string_1.escapeConfigString)(app['canada-post'].password);
                    const customerId = (0, escape_config_string_1.escapeConfigString)(app['canada-post'].customerId);
                    config = config.replace(/Configure::write\('CanadaPost\.enabled', .*\);/, `Configure::write('CanadaPost.enabled', ${app['canada-post'].active ? 'true' : 'false'});`);
                    config = config.replace(/Configure::write\('CanadaPost\.username', '.*'\);/, `Configure::write('CanadaPost.username', '${username}');`);
                    config = config.replace(/Configure::write\('CanadaPost\.password', '.*'\);/, `Configure::write('CanadaPost.password', '${password}');`);
                    config = config.replace(/Configure::write\('CanadaPost\.customerNumber', '.*'\);/, `Configure::write('CanadaPost.customerNumber', '${customerId}');`);
                }
                if ((0, app_integration_configuration_1.isAppIntegrationConfigurationElavon)(app.elavon, appName)) {
                    const merchantId = (0, escape_config_string_1.escapeConfigString)(app.elavon.merchantId);
                    const userId = (0, escape_config_string_1.escapeConfigString)(app.elavon.userId);
                    const pin = (0, escape_config_string_1.escapeConfigString)(app.elavon.pin);
                    config = config.replace(/Configure::write\('ConvergeAPI\.enabled', .*\);/, `Configure::write('ConvergeAPI.enabled', ${app.elavon.active ? 'true' : 'false'});`);
                    config = config.replace(/Configure::write\('ConvergeAPI\.merchantId', '.*'\);/, `Configure::write('ConvergeAPI.merchantId', '${merchantId}');`);
                    config = config.replace(/Configure::write\('ConvergeAPI\.userId', '.*'\);/, `Configure::write('ConvergeAPI.userId', '${userId}');`);
                    config = config.replace(/Configure::write\('ConvergeAPI\.pin', '.*'\);/, `Configure::write('ConvergeAPI.pin', '${pin}');`);
                }
                if ((0, app_integration_configuration_1.isAppIntegrationConfigurationPaypal)(app.paypal, appName)) {
                    const username = (0, escape_config_string_1.escapeConfigString)(app.paypal.username);
                    const password = (0, escape_config_string_1.escapeConfigString)(app.paypal.password);
                    const signature = (0, escape_config_string_1.escapeConfigString)(app.paypal.signature);
                    const endpoint = (0, escape_config_string_1.escapeConfigString)(app.paypal.endpoint);
                    config = config.replace(/Configure::write\('Paypal\.enabled', .*\);/, `Configure::write('Paypal.enabled', ${app.paypal.active ? 'true' : 'false'});`);
                    config = config.replace(/Configure::write\('Paypal\.username', '.*'\);/, `Configure::write('Paypal.username', '${username}');`);
                    config = config.replace(/Configure::write\('Paypal\.password', '.*'\);/, `Configure::write('Paypal.password', '${password}');`);
                    config = config.replace(/Configure::write\('Paypal\.signature', '.*'\);/, `Configure::write('Paypal.signature', '${signature}');`);
                    config = config.replace(/Configure::write\('Paypal\.endpoint', '.*'\);/, `Configure::write('Paypal.endpoint', '${endpoint}');`);
                }
                if ((0, app_integration_configuration_1.isAppIntegrationConfigurationStripe)(app.stripe, appName)) {
                    const publishableKey = (0, escape_config_string_1.escapeConfigString)(app.stripe.publishableKey);
                    const secretKey = (0, escape_config_string_1.escapeConfigString)(app.stripe.secretKey);
                    config = config.replace(/Configure::write\('Stripe\.enabled', .*\);/, `Configure::write('Stripe.enabled', ${app.stripe.active ? 'true' : 'false'});`);
                    config = config.replace(/Configure::write\('Stripe\.publishableKey', '.*'\);/, `Configure::write('Stripe.publishableKey', '${publishableKey}');`);
                    config = config.replace(/Configure::write\('Stripe\.secretKey', '.*'\);/, `Configure::write('Stripe.secretKey', '${secretKey}');`);
                }
                await (0, file_1.writeFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'), config);
                logger_1.logger.info('Done processing app-integrations:changed');
            });
        });
    }
    _listenBackgroundUpdates() {
        this.fastStore.subscribe('backgrounds:changed', async (value) => {
            logger_1.logger.info('Received backgrounds:changed');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Prosessing backgrounds:changed');
                const req = (0, node_http_1.request)(`${this.config.app.url.localhost}chronics/emit/Backgrounds.update`, {
                    method: 'GET'
                }, (res) => {
                });
                req.end();
                logger_1.logger.info('Done processing backgrounds:changed');
            });
        });
    }
    _listenConfigDone() {
        this.fastStore.subscribe('config:done', async () => {
            logger_1.logger.info('Received config:done');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Processing config:done');
                if (this._configDoneResolve) {
                    this._configDoneResolve();
                    this._configDoneResolve = null;
                }
                logger_1.logger.info('Done processing config:done');
            });
        });
    }
    _listenConfiguredLanguagesUpdates() {
        this.fastStore.subscribe('configured-languages:changed', async (value) => {
            logger_1.logger.info('Received configured-languages:changed');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Processing configured-languages:changed');
                try {
                    const configuredLanguages = JSON.parse(value);
                    const primary = configuredLanguages.find(language => language.primary)?.locale ?? 'en';
                    const languages = configuredLanguages.map(language => language.locale);
                    let config = (await (0, file_1.readFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'))).toString();
                    config = config.replace(/Configure::write\('Language.available', \[.*]\);/, `Configure::write('Language.available', ` +
                        `[${languages.map(l => `'${(0, escape_config_string_1.escapeConfigString)(l)}'`).join(',')}]);`);
                    config = config.replace(/Configure::write\('Config\.default', '.*'\);/, `Configure::write('Config.default', '${(0, escape_config_string_1.escapeConfigString)(primary)}');`);
                    config = config.replace(/Configure::write\('Language\.fallback', '.*'\);/, `Configure::write('Language.fallback', '${(0, escape_config_string_1.escapeConfigString)(primary)}');`);
                    await (0, file_1.writeFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'), config);
                }
                catch (error) {
                    logger_1.logger.error('Error processing configured-languages:changed', error);
                }
                logger_1.logger.info('Done processing configured-languages:changed');
            });
        });
    }
    _listenStoreConfigurationUpdates() {
        this.fastStore.subscribe('store-config:changed', async (value) => {
            logger_1.logger.info('Received store-config:changed');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Processing store-config:changed');
                try {
                    const storeConfiguration = JSON.parse(value);
                    const config = (await (0, file_1.readFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'))).toString();
                    const email = storeConfiguration?.contact?.email
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.email)
                        : '';
                    const phone = storeConfiguration?.contact?.phone
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.phone)
                        : '';
                    const notifyEmail = storeConfiguration?.contact?.notifyEmail
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.notifyEmail)
                        : '';
                    const addressLine1 = storeConfiguration?.contact?.addressLine1
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.addressLine1)
                        : '';
                    const addressLine2 = storeConfiguration?.contact?.addressLine2
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.addressLine2)
                        : '';
                    const city = storeConfiguration?.contact?.city
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.city)
                        : '';
                    const region = storeConfiguration?.contact?.region
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.region)
                        : '';
                    const postalCode = storeConfiguration?.contact?.postalCode
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.postalCode)
                        : '';
                    const country = storeConfiguration?.contact?.country
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.contact.country)
                        : '';
                    const locality = storeConfiguration?.taxes?.locality ?? '';
                    const gst = storeConfiguration?.taxes?.canadian?.gst ?? '0';
                    const hst = storeConfiguration?.taxes?.canadian?.hst ?? '0';
                    const pst = storeConfiguration?.taxes?.canadian?.pst ?? '0';
                    const qst = storeConfiguration?.taxes?.canadian?.qst ?? '0';
                    const gstId = storeConfiguration?.taxes?.canadian?.gstId
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.taxes.canadian.gstId)
                        : '';
                    const hstId = storeConfiguration?.taxes?.canadian?.hstId
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.taxes.canadian.hstId)
                        : '';
                    const pstId = storeConfiguration?.taxes?.canadian?.pstId
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.taxes.canadian.pstId)
                        : '';
                    const qstId = storeConfiguration?.taxes?.canadian?.qstId
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.taxes.canadian.qstId)
                        : '';
                    const root = storeConfiguration?.urls?.root
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.urls.root)
                        : '';
                    const termsAndConditions = storeConfiguration?.urls?.termsAndConditions
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.urls.termsAndConditions)
                        : '';
                    const contactUs = storeConfiguration?.urls?.contact
                        ? (0, escape_config_string_1.escapeConfigString)(storeConfiguration.urls.contact)
                        : '';
                    await (0, file_1.writeFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'), config
                        .replace(/Configure::write\('Contacts\.email', '.*'\);/, `Configure::write('Contacts.email', '${email}');`)
                        .replace(/Configure::write\('Contacts\.phoneNumber', '.*'\);/, `Configure::write('Contacts.phoneNumber', '${phone}');`)
                        .replace(/Configure::write\('Contacts\.addressLine1', '.*'\);/, `Configure::write('Contacts.addressLine1', '${addressLine1}');`)
                        .replace(/Configure::write\('Contacts\.addressLine2','.*'\);/, `Configure::write('Contacts.addressLine2','${addressLine2}');`)
                        .replace(/Configure::write\('Contacts\.city', '.*'\);/, `Configure::write('Contacts.city', '${city}');`)
                        .replace(/Configure::write\('Contacts\.region', '.*'\);/, `Configure::write('Contacts.region', '${region}');`)
                        .replace(/Configure::write\('Contacts\.postalCode', '.*'\);/, `Configure::write('Contacts.postalCode', '${postalCode}');`)
                        .replace(/Configure::write\('Contacts\.country', '.*'\);/, `Configure::write('Contacts.country', '${country}');`)
                        .replace(/Configure::write\('Taxes\.locality', '.*'\);/, `Configure::write('Taxes.locality', '${locality}');`)
                        .replace(/Configure::write\('Taxes\.gst', .*\);/, `Configure::write('Taxes.gst', ${gst});`)
                        .replace(/Configure::write\('Taxes\.hst', .*\);/, `Configure::write('Taxes.hst', ${hst});`)
                        .replace(/Configure::write\('Taxes\.pst', .*\);/, `Configure::write('Taxes.pst', ${pst});`)
                        .replace(/Configure::write\('Taxes\.qst', .*\);/, `Configure::write('Taxes.qst', ${qst});`)
                        .replace(/Configure::write\('Taxes\.gstId', '.*'\);/, `Configure::write('Taxes.gstId', '${gstId}');`)
                        .replace(/Configure::write\('Taxes\.hstId', '.*'\);/, `Configure::write('Taxes.hstId', '${hstId}');`)
                        .replace(/Configure::write\('Taxes\.pstId', '.*'\);/, `Configure::write('Taxes.pstId', '${pstId}');`)
                        .replace(/Configure::write\('Taxes\.qstId', '.*'\);/, `Configure::write('Taxes.qstId', '${qstId}');`)
                        .replace(/Configure::write\('URL\.root', '.*'\);/, `Configure::write('URL.root', '${root}');`)
                        .replace(/Configure::write\('URL\.termsAndConditions', '.*'\);/, `Configure::write('URL.termsAndConditions', '${termsAndConditions}');`)
                        .replace(/Configure::write\('URL\.contactUs', '.*'\);/, `Configure::write('URL.contactUs', '${contactUs}');`)
                        .replace(/Configure::write\('Admin\.emails', \['.*']\);/, `Configure::write('Admin.emails', ['${notifyEmail}']);`)
                        .replace(/Configure::write\('Notify\.addresses', \['.*']\);/, `Configure::write('Notify.addresses', ['${notifyEmail}']);`));
                }
                catch (error) {
                    logger_1.logger.error('Error processing store-config:changed', error);
                }
                logger_1.logger.info('Done processing store-config:changed');
            });
        });
    }
    _listenStoreCustomizationUpdates() {
        this.fastStore.subscribe('store-customization:changed', async (value) => {
            logger_1.logger.info('Received store-customization:changed');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Processing store-customization:changed');
                try {
                    const customization = JSON.parse(value);
                    const config = (await (0, file_1.readFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'))).toString();
                    const storeName = customization.storeName
                        ? (0, escape_config_string_1.escapeConfigString)(customization.storeName)
                        : '';
                    const colorAccent = customization.colors?.accent
                        ? (0, escape_config_string_1.escapeConfigString)(customization.colors.accent)
                        : '#000000';
                    await (0, file_1.writeFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'), config
                        .replace(/Configure::write\('Customizations.storeName', '.*'\);/, `Configure::write('Customizations.storeName', ` +
                        `'${storeName}');`)
                        .replace(/Configure::write\('Customizations\.colors\.accent', '.*'\);/, `Configure::write('Customizations.colors.accent', '${colorAccent}');`));
                }
                catch (error) {
                    logger_1.logger.error('Error processing store-customization:changed', error);
                }
                logger_1.logger.info('Done processing store-customization:changed');
            });
        });
    }
    _listenStoreNotifyEmailsUpdates() {
        this.fastStore.subscribe('store-notify-emails:changed', async (value) => {
            logger_1.logger.info('Received store-notify-emails:changed');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Processing store-notify-emails:changed');
                try {
                    const notifyEmails = JSON.parse(value);
                    const config = (await (0, file_1.readFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'))).toString();
                    await (0, file_1.writeFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'), config.replace(/Configure::write\('Notify\.addresses', \[.*]\);/, `Configure::write('Notify.addresses', ` +
                        `[${notifyEmails.map(e => `'${(0, escape_config_string_1.escapeConfigString)(e)}'`).join(',')}]);`));
                }
                catch (error) {
                    logger_1.logger.error('Error processing store-notify-emails:changed', error);
                }
                logger_1.logger.info('Done processing store-notify-emails:changed');
            });
        });
    }
    _listenStoreShutdownUpdates() {
        this.fastStore.subscribe('store-shutdown:changed', async (value) => {
            logger_1.logger.info('Received store-shutdown:changed');
            await this._configMutex.runExclusive(async () => {
                logger_1.logger.info('Processing store-shutdown:changed');
                try {
                    const payload = JSON.parse(value);
                    const config = (await (0, file_1.readFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'))).toString();
                    const message = (0, escape_config_string_1.escapeConfigString)(payload.message);
                    console.log(message);
                    await (0, file_1.writeFileCache)((0, node_path_1.join)(this.config.env.dirs.transacConfig, 'app.php'), config
                        .replace(/Configure::write\('Config\.shutdown', .*\);/, `Configure::write('Config.shutdown', ${payload.shutdown ? 'true' : 'false'});`)
                        .replace(/Configure::write\('Config\.shutdownMessage', '.*'\);/, `Configure::write('Config.shutdownMessage', '${message}');`));
                }
                catch (error) {
                    logger_1.logger.error('Error processing store-shutdown:changed', error);
                }
                logger_1.logger.info('Done processing store-shutdown:changed');
            });
        });
    }
};
exports.RedisPubsubService = RedisPubsubService;
exports.RedisPubsubService = RedisPubsubService = tslib_1.__decorate([
    (0, typedi_1.Service)('redis-pubsub'),
    tslib_1.__param(0, (0, typedi_1.Inject)('fast-store')),
    tslib_1.__param(1, (0, typedi_1.Inject)('config')),
    tslib_1.__metadata("design:paramtypes", [typeof (_a = typeof fast_store_interface_1.FastStoreInterface !== "undefined" && fast_store_interface_1.FastStoreInterface) === "function" ? _a : Object, typeof (_b = typeof config_schema_1.ConfigSchema !== "undefined" && config_schema_1.ConfigSchema) === "function" ? _b : Object])
], RedisPubsubService);
//# sourceMappingURL=redis_pubsub_service.js.map