#!/usr/bin/env -S pnpm exec tsx
// Generates apps/web/src/paraglide (messages, runtime, types) without a Vite build, so type
// checks and tests can run on a fresh checkout.
import { compile } from '@inlang/paraglide-js'
import { paraglideOptions } from '../apps/web/paraglide.config.js'

process.chdir(new URL('../apps/web/', import.meta.url).pathname)
await compile(paraglideOptions)
