export {}

declare global {
  interface Window {
    __cls: number
    TranslationEngine?: {
      initialized?: boolean
      hasTranslation(key: string | null, lang: string): boolean
      switchLanguage(lang: string): void
    }
  }
}
