"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const tslib_1 = require("tslib");
const path = tslib_1.__importStar(require("path"));
const utils_1 = require("lib/core/utils");
exports.config = {
    env: {
        version: '',
        environment: process.env.NODE_ENV,
        production: process.env.NODE_ENV === 'production',
        debug: process.env.NODE_ENV === 'debug',
        dirs: {
            docsPages: path.join(__dirname, 'http/views/doc_pages/'),
            locales: path.join(__dirname, 'locales/{{lng}}/{{ns}}.yaml'),
            jobs: path.join(__dirname, 'jobs'),
            public: path.join(__dirname, 'public'),
            root: __dirname,
            services: [
                path.join(__dirname, 'lib/services'),
                path.join(__dirname, 'services')
            ],
            transacConfig: path.join(__dirname, '../app/Config/')
        },
        files: {
            appConfig: 'app.php',
            coreConfig: 'core.php',
            databaseConfig: 'database.php',
            databaseVarsConfig: 'db_vars.php'
        }
    },
    app: {
        locale: 'en',
        contactUs: {
            to: 'hello@mail.com',
            from: 'no-reply@mail.com'
        },
        db: {
            codeExpiryTimeInHour: 24
        },
        dirs: {
            data: process.env.APP_DATA_DIR
        },
        logging: {
            httpHost: process.env.APP_LOGGING_HTTP_HOST,
            httpPort: Number(process.env.APP_LOGGING_HTTP_PORT),
            httpToken: process.env.APP_LOGGING_HTTP_TOKEN
        },
        password: {
            policy: {
                symbols: 1,
                lowercase: 1,
                uppercase: 1,
                numbers: 1,
                minLength: 12,
                maxLength: 150
            }
        },
        url: {
            localhost: process.env.APP_URL_LOCALHOST,
        }
    },
    locales: {
        supported: [
            'en-ca',
            'en-gb',
            'en-us',
            'en',
            'fr-ca',
            'fr'
        ],
        fallbacks: {
            lang: 'en'
        },
    },
    server: {
        interface: '0.0.0.0',
        listen: 3000,
        prefix: undefined,
        dirs: {
            controllers: [
                path.join(__dirname, 'http/controllers') + '/*_controller*',
            ],
            middlewares: [
                path.join(__dirname, 'http/middlewares') + '/*_middleware*',
                path.join(__dirname, 'lib/http/middlewares') + '/*_middleware*'
            ],
            interceptors: [
                path.join(__dirname, 'http/interceptors') + '/*_interceptor*',
                path.join(__dirname, 'lib/http/interceptors') + '/*_interceptor*'
            ],
            validators: [
                path.join(__dirname, 'http/validators/'),
                path.join(__dirname, 'lib/http/validators/')
            ],
            decorators: [
                path.join(__dirname, 'http/decorators/'),
                path.join(__dirname, 'lib/http/decorators/')
            ],
            templates: [
                path.join(__dirname, 'http/views/templates/')
            ],
            helpers: [
                path.join(__dirname, 'http/views/helpers/'),
                path.join(__dirname, 'lib/http/view/helpers/')
            ],
            partials: [
                path.join(__dirname, 'http/views/partials/')
            ],
            services: [
                path.join(__dirname, 'lib/services/'),
                path.join(__dirname, 'services/')
            ],
            public: {
                onDisk: path.join(__dirname, 'public'),
                img: '/img',
                script: '/js',
                css: '/css'
            }
        },
        sessionSecret: 'CHANGE ME',
        sessionTTL: 3600
    },
    saml: {
        serviceProviderEntityId: process.env.SAML_ENTITY_ID,
        serviceProviderPrivateKey: (0, utils_1.formatPEMString)(process.env.SAML_PRIVATE_KEY),
        serviceProviderCertificate: (0, utils_1.formatPEMString)(process.env.SAML_CERTIFICATE),
        serviceProviderAssertEndpoint: process.env.SAML_ASSERT_ENDPOINT,
        identityProviderLoginURL: process.env.SAML_IDP_LOGIN_URL,
        identityProviderLogoutURL: process.env.SAML_IDP_LOGOUT_URL,
        identityProviderCertificates: [(0, utils_1.formatPEMString)(process.env.SAML_IDP_CERT1),
            (0, utils_1.formatPEMString)(process.env.SAML_IDP_CERT2)]
    },
    sendgrid: {
        apikey: process.env.SENDGRID_APIKEY
    },
    db: [{
            type: process.env.DB_TYPE,
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE_NAME,
            schema: 'public',
            synchronize: false,
            logging: true,
            entitiesDir: [path.join(__dirname, 'database/models') + '/*'],
            migrationsDir: [path.join(__dirname, 'database/migrations') + '/*_migration'],
            subscribersDir: [
                path.join(__dirname, 'database/subscribers') + '/*_subscriber*',
                path.join(__dirname, 'lib/database/subscribers') + '/*_subscriber*'
            ]
        }],
    redis: {
        host: process.env.REDIS_HOST,
        port: Number(process.env.REDIS_PORT),
        tls: false
    },
    auth: {
        secret: 'test secret MUST CHANGE'
    },
    scheduler: {
        concurrency: 2,
        jobs: []
    },
    roles: {
        get list() { return Object.keys(exports.config.roles.capabilities); },
        capabilities: {
            admin: {
                account: { 'create:any': ['*'], 'read:any': ['*'], 'update:any': ['*'], 'delete:any': ['*'] },
                test: { 'create:any': ['*'], 'read:any': ['*'], 'update:any': ['*'], 'delete:any': ['*'] }
            }
        }
    }
};
//# sourceMappingURL=config.js.map