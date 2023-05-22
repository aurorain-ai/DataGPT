// @ts-check
/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env/server.mjs"));

import nextI18NextConfig from './next-i18next.config.js'
import withTM from 'next-transpile-modules';

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: true,
  /* If trying out the experimental appDir, comment the i18n config out
   * @see https://github.com/vercel/next.js/issues/41980 */
  i18n:nextI18NextConfig.i18n,
  webpack: function (config, options) {
    config.experiments = { asyncWebAssembly: true, layers: true };
    return config;
  }
};

// add for Snowflake-SDK
const transpileModules = [
  'snowflake-sdk',
  'vm2',
  'pac-resolver',
  'pac-proxy-agent',
  'proxy-agent',
  'urllib',
];

const extendedConfig = withTM(transpileModules)(config);
export default extendedConfig;
