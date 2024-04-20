import type { ModuleOptions as CsrfOptions } from 'nuxt-csurf'
import type { Options as RemoveOptions } from 'unplugin-remove/types'
import type { SecurityHeaders } from './headers'
import type { AllowedHTTPMethods, BasicAuth, RateLimiter, RequestSizeLimiter, XssValidator, CorsOptions } from './middlewares'
import type { CheerioAPI } from 'cheerio'

export type Ssg = {
  meta?: boolean;
  hashScripts?: boolean;
  hashStyles?: boolean;
};

export interface ModuleOptions {
  headers: SecurityHeaders | false;
  requestSizeLimiter: RequestSizeLimiter | false;
  rateLimiter: RateLimiter;
  xssValidator: XssValidator | false;
  corsHandler: CorsOptions | false;
  allowedMethodsRestricter: AllowedHTTPMethods | false;
  hidePoweredBy: boolean;
  enabled: boolean;
  nonce: boolean;
  ssg: Ssg | false;
  sri: boolean
  basicAuth: BasicAuth | false;
  csrf: CsrfOptions | boolean;
  removeLoggers: RemoveOptions | false;
}

export type NuxtSecurityRouteRules = Partial<Omit<ModuleOptions, 'csrf' | 'basicAuth' | 'rateLimiter'> & { rateLimiter: Omit<RateLimiter, 'driver'> | false }>


declare module 'nitropack' {
  interface NitroRuntimeHooks {
    'nuxt-security:headers': (config: {
      /**
       * The route for which the headers are being configured
       */
      route: string,
      /**
       * The headers configuration for the route
       */
      headers: SecurityHeaders
    }) => void
    'nuxt-security:ready': () => void
    'nuxt-security:routeRules': (routeRules: Record<string, NuxtSecurityRouteRules>) => void
  }
}

type Section = 'body' | 'bodyAppend' | 'bodyPrepend' | 'head'
declare module 'h3' {
  interface H3EventContext {
    security: {
      routeRules?: Record<string, NuxtSecurityRouteRules>;
      nonce?: string;
      cheerios?: Record<Section, CheerioAPI[]>;
    }
  }
}