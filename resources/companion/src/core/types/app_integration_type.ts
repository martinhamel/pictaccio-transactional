export const AppIntegrationTypes = [
// Shipping
    'canada-post',

// Payment Processors
    'elavon',
    'paypal',
    'stripe',
    'chase'
] as const;

export type AppIntegrationType = typeof AppIntegrationTypes[number];
