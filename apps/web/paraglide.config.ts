import type { CompilerOptions } from '@inlang/paraglide-js'

/**
 * Shared by the Vite plugin (dev and build) and `pnpm web:messages` (checks and CI), so both
 * generate the same runtime. Paths are relative to apps/web.
 */
export const paraglideOptions = {
  project: './project.inlang',
  outdir: './src/paraglide',
  outputStructure: 'message-modules',
  emitTsDeclarations: true,
  // The language comes only from the URL: English at the root, /fil and /ceb prefixes.
  strategy: ['url', 'baseLocale'],
  urlPatterns: [
    {
      pattern: '/:path(.*)?',
      // English last: its unprefixed pattern would otherwise match every URL.
      localized: [
        ['fil', '/fil/:path(.*)?'],
        ['ceb', '/ceb/:path(.*)?'],
        ['en', '/:path(.*)?'],
      ],
    },
  ],
} satisfies CompilerOptions
