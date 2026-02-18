export interface SectionConfig {
  term: string
  country?: string
}

const currentYear = new Date().getFullYear()

export const SECTIONS = {
  SELECTED_FOR_YOU: { term: `top hits ${currentYear}` },
  TOP_HITS_GLOBAL: { term: "top hits" },
  TOP_HITS_INDIA: { term: "bollywood top songs", country: "in" },
} satisfies Record<string, SectionConfig>
