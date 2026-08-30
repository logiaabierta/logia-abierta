import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config.js';

export const { POST, GET } = makeRouteHandler({
  config,
  clientId: process.env.KEYSTATIC_GITHUB_CLIENT_ID || (process.env.NODE_ENV === 'production' && !process.env.VERCEL ? 'build_dummy_client_id' : undefined),
  clientSecret: process.env.KEYSTATIC_GITHUB_CLIENT_SECRET || (process.env.NODE_ENV === 'production' && !process.env.VERCEL ? 'build_dummy_client_secret' : undefined),
  secret: process.env.KEYSTATIC_SECRET || (process.env.NODE_ENV === 'production' && !process.env.VERCEL ? 'build_dummy_secret_at_least_32_chars_long' : undefined),
});
