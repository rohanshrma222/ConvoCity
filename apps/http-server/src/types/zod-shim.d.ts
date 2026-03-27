declare module "zod/v4/index.js" {
  export const z: any;

  export class ZodError extends Error {
    issues: Array<{
      message?: string;
    }>;
  }
}
