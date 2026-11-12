import { defineConfig } from 'vite-plus'

export default defineConfig({
  defaultPackage: './apps/web',
  fmt: {
    ignorePatterns: [
      'apps/web/dist/**',
      'apps/web/src/routeTree.gen.ts',
      'apps/web/src/paraglide/**',
      'dist/**',
      'node_modules/**',
    ],
    singleQuote: true,
    semi: false,
    sortPackageJson: false,
  },
  lint: {
    ignorePatterns: [
      'apps/web/dist/**',
      'apps/web/src/routeTree.gen.ts',
      'apps/web/src/paraglide/**',
      'dist/**',
      'node_modules/**',
    ],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
})
