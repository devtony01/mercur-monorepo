import { defineConfig, loadEnv, Modules, ContainerRegistrationKeys } from '@medusajs/framework/utils'
import path from 'path'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

module.exports = defineConfig({
  admin: {
    disable: process.env.DISABLE_MEDUSA_ADMIN === "true",
    backendUrl: process.env.MEDUSA_BACKEND_URL,
    vite: () => ({
      resolve: {
        alias: {
          "@": path.resolve(__dirname, "./src/admin"),
        },
      },
    })
  },
  featureFlags: {
    // Enable available feature flags in Medusa 2.0
    "index_engine": true, // Enabled with Algolia configuration
    "view_configurations": true,
  },
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    databaseDriverOptions: {
      pool: {
        min: 1,
        max: 5,
        acquireTimeoutMillis: 30000,
      },
    },
    redisUrl: process.env.REDIS_URL,
    workerMode: process.env.MEDUSA_WORKER_MODE as "shared" | "worker" | "server",
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      // @ts-expect-error: vendorCors is not a valid config
      vendorCors: process.env.VENDOR_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || 'supersecret',
      cookieSecret: process.env.COOKIE_SECRET || 'supersecret'
    }
  },
  modules: [
    {
      resolve: "@medusajs/medusa/cache-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/event-bus-redis",
      options: {
        redisUrl: process.env.REDIS_URL,
      },
    },
    {
      resolve: "@medusajs/medusa/workflow-engine-redis",
      options: {
        redis: {
          url: process.env.REDIS_URL,
        },
      },
    },
    {
      resolve: "@medusajs/medusa/locking",
      options: {
        providers: [
          {
            resolve: "@medusajs/medusa/locking-redis",
            id: "locking-redis",
            is_default: true,
            options: {
              redisUrl: process.env.LOCKING_REDIS_URL,
            },
          },
        ],
      },
    },
    // Google Auth Module
    {
      resolve: '@medusajs/medusa/auth',
      dependencies: [Modules.CACHE, ContainerRegistrationKeys.LOGGER],
      options: {
        providers: [
          {
            resolve: '@medusajs/medusa/auth-emailpass',
            id: 'emailpass',
          },
          {
            resolve: '@medusajs/medusa/auth-google',
            id: 'google',
            options: {
              clientId: process.env.GOOGLE_CLIENT_ID,
              clientSecret: process.env.GOOGLE_CLIENT_SECRET,
              callbackUrl: process.env.GOOGLE_CALLBACK_URL,
              scope: 'openid email profile',
            },
          },
        ],
      },
    },
    // Tax Module
    {
      resolve: '@medusajs/medusa/tax',
      options: {
        providers: [
          {
            resolve: '@mercurjs/stripe-tax-provider',
            id: 'stripe-tax',
            options: {
              apiKey: process.env.STRIPE_SECRET_API_KEY
            }
          },
        ],
      },
    },
    // Mercur Modules
    { resolve: '@mercurjs/seller' },
    { resolve: '@mercurjs/reviews' },
    { resolve: '@mercurjs/marketplace' },
    { resolve: '@mercurjs/configuration' },
    { resolve: '@mercurjs/order-return-request' },
    { resolve: '@mercurjs/requests' },
    { resolve: '@mercurjs/brand' },
    { resolve: '@mercurjs/wishlist' },
    { resolve: '@mercurjs/split-order-payment' },
    { resolve: '@mercurjs/attribute' },
    {
      resolve: '@mercurjs/taxcode',
      options: {
        apiKey: process.env.STRIPE_SECRET_API_KEY
      }
    },
    { resolve: '@mercurjs/commission' },
    {
      resolve: '@mercurjs/payout',
      options: {
        apiKey: process.env.STRIPE_SECRET_API_KEY,
        webhookSecret: process.env.STRIPE_CONNECTED_ACCOUNTS_WEBHOOK_SECRET
      }
    },
    // Index Module for high-performance queries
    {
      resolve: '@medusajs/index',
    },
    // Algolia module enabled with proper API keys
    {
      resolve: '@mercurjs/algolia',
      options: {
        apiKey: process.env.ALGOLIA_API_KEY,
        appId: process.env.ALGOLIA_APP_ID
      }
    },
    {
      resolve: '@medusajs/medusa/payment',
      options: {
        providers: [
          {
            resolve: '@mercurjs/payment-stripe-connect',
            id: 'stripe-connect',
            options: {
              apiKey: process.env.STRIPE_SECRET_API_KEY
            }
          }
        ]
      }
    },
    {
      resolve: '@medusajs/medusa/notification',
      options: {
        providers: [
          {
            resolve: '@mercurjs/resend',
            id: 'resend',
            options: {
              channels: ['email'],
              api_key: process.env.RESEND_API_KEY,
              from: process.env.RESEND_FROM_EMAIL
            }
          },
          {
            resolve: '@medusajs/medusa/notification-local',
            id: 'local',
            options: {
              channels: ['feed', 'seller_feed']
            }
          }
        ]
      }
    }
  ],
  // Plugins
  plugins: [
    {
      resolve: 'medusa-plugin-hapio-booking',
      options: {
        apiUrl: process.env.HAPIO_API_URL,
        apiToken: process.env.HAPIO_API_TOKEN,
      },
    },
  ],
})
