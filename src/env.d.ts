/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

type Runtime = import('@astrojs/cloudflare').DirectoryRuntime<ENV>;
type ENV = {
  CLERK_PUBLISHABLE_KEY: string;
  CLERK_SECRET_KEY: string;
};

declare namespace App {
  interface Locals extends Runtime {}
}
