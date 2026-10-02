/// <reference types="vite/client" />

/**
 * Package version injected by Vite at build time.
 */
declare const APP_VERSION: string;

/**
 * Whether this configuration targets a production build.
 */
declare const APP_IS_PROD: boolean;

/**
 * Whether this configuration targets the development server.
 */
declare const APP_IS_DEV: boolean;

/**
 * Public app base URI used by HTML templates and client code.
 */
declare const APP_URI: string;

/**
 * Environment-specific base URL for leaderboard API requests.
 */
declare const APP_API_URL: string;
