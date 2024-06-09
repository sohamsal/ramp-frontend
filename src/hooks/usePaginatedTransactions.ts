import { useCallback, useState } from "react"
import { PaginatedRequestParams, PaginatedResponse, Transaction } from "../utils/types"
import { PaginatedTransactionsResult } from "./types"
import { useCustomFetch } from "./useCustomFetch"

export function usePaginatedTransactions(): PaginatedTransactionsResult {
  const { fetchWithCache, loading } = useCustomFetch()
  const [paginatedTransactions, setPaginatedTransactions] = useState<PaginatedResponse<Transaction[]> | null>(null)
  const [allTransactionsFetched, setAllTransactionsFetched] = useState(false)

  const fetchAll = useCallback(async () => {
    if (allTransactionsFetched) return

    const response = await fetchWithCache<PaginatedResponse<Transaction[]>, PaginatedRequestParams>(
      "paginatedTransactions",
      {
        page: paginatedTransactions === null ? 0 : paginatedTransactions.nextPage,
      }
    )

    setPaginatedTransactions((previousResponse) => {
      if (response === null || previousResponse === null) {
        return response
      }

      if (response.nextPage === null) {
        setAllTransactionsFetched(true)
      }

      return {
        data: previousResponse.data.concat(response.data),
        nextPage: response.nextPage
      };
    })
  }, [allTransactionsFetched, fetchWithCache, paginatedTransactions])

  const invalidateData = useCallback(() => {
    setPaginatedTransactions(null)
    setAllTransactionsFetched(false)
  }, [])

  return { data: paginatedTransactions, loading, fetchAll, invalidateData }
}
