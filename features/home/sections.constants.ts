export interface SectionConfig {
  term: string
  country?: string
}

export const SECTIONS = {
  SELECTED_FOR_YOU: { term: "top songs" },
  TOP_HITS_GLOBAL: { term: "top hits" },
  TOP_HITS_INDIA: { term: "bollywood top songs", country: "in" },
} as const satisfies Record<string, SectionConfig>
