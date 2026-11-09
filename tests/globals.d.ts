export {}

declare global {
  interface Window {
    __cls: number
    TranslationEngine?: { initialized?: boolean }
  }
}
