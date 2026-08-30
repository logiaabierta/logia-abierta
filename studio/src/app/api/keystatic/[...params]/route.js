import { makeRouteHandler } from '@keystatic/next/route-handler';
import config from '../../../../../keystatic.config.js';

export const { POST, GET } = makeRouteHandler({ config });
