import { useCallback, useState } from "react"
import { useCustomFetch } from "src/hooks/useCustomFetch"
import { SetTransactionApprovalParams, Transaction as TransactionType } from "src/utils/types"
import { TransactionPane } from "./TransactionPane"
import { SetTransactionApprovalFunction, TransactionsComponent } from "./types"

export const Transactions: TransactionsComponent = ({ transactions }) => {
    const { fetchWithoutCache, loading } = useCustomFetch()
    const [transactionStates, setTransactionStates] = useState<{ [key: string]: boolean }>({})

    const setTransactionApproval = useCallback<SetTransactionApprovalFunction>(
        async ({ transactionId, newValue }) => {
            await fetchWithoutCache<void, SetTransactionApprovalParams>("setTransactionApproval", {
                transactionId,
                value: newValue,
            })
            setTransactionStates(prevStates => ({
                ...prevStates,
                [transactionId]: newValue
            }))
        },
        [fetchWithoutCache]
    )

    if (transactions === null) {
        return <div className="RampLoading--container">Loading...</div>
    }

    return (
        <div data-testid="transaction-container">
            {transactions.map((transaction) => (
                <TransactionPane
                    key={transaction.id}
                    transaction={transaction}
                    loading={loading}
                    approved={transactionStates[transaction.id] ?? transaction.approved}
                    setTransactionApproval={setTransactionApproval}
                />
            ))}
        </div>
    )
}
