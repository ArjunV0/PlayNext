"use client"

import { useSearchParams } from "next/navigation"

import { Suspense, useEffect } from "react"

import { SearchPage } from "features/search/SearchPage"
import { useSearch } from "features/search/useSearch"

function SearchPageContent() {
  const searchParams = useSearchParams()
  const { query, setQuery } = useSearch()
  const urlQuery = searchParams.get("q") ?? ""

  useEffect(() => {
    if (urlQuery !== query) {
      setQuery(urlQuery)
    }
  }, [urlQuery, setQuery, query])

  return <SearchPage />
}

export default function SearchPageRoute() {
  return (
    <Suspense>
      <SearchPageContent />
    </Suspense>
  )
}
