export interface SectionConfig {
  term: string
  country?: string
}

export const SECTIONS = {
  SELECTED_FOR_YOU: { term: "pop hits 2024" },
  TOP_HITS_GLOBAL: { term: "global top hits 2024" },
  TOP_HITS_INDIA: { term: "bollywood top songs", country: "in" },
} as const satisfies Record<string, SectionConfig>
