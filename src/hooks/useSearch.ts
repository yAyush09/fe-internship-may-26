import { useState, useEffect, useRef } from 'react'
import type { Item } from '../types'
import { searchItems } from '../services/mockApi'

export interface UseSearchReturn {
  query: string
  setQuery: (q: string) => void
  results: Item[]
  isLoading: boolean
  error: string | null
}

export function useSearch(): UseSearchReturn {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const requestIdRef = useRef(0)

  useEffect(() => {
    const currentRequestId = ++requestIdRef.current

    const timer = setTimeout(async () => {
      try {
        setIsLoading(true)
        setError(null)

        const data = await searchItems(query)

        if (currentRequestId === requestIdRef.current) {
          setResults(data)
        }
      } catch (err) {
        if (currentRequestId === requestIdRef.current) {
          setError(
            err instanceof Error
              ? err.message
              : 'Something went wrong'
          )
        }
      } finally {
        if (currentRequestId === requestIdRef.current) {
          setIsLoading(false)
        }
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [query])

  return { query, setQuery, results, isLoading, error }
}