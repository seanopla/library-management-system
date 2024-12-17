import { collection, getCountFromServer, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../config/firestore'

// Fetch total books
export const fetchTotalBooks = async () => {
  const booksRef = collection(db, 'books')
  const snapshot = await getCountFromServer(booksRef)
  return snapshot.data().count
}

// Fetch total users
export const fetchTotalUsers = async () => {
  const usersRef = collection(db, 'users')
  const snapshot = await getCountFromServer(usersRef)
  return snapshot.data().count
}

// Fetch total transactions
export const fetchTotalTransactions = async () => {
  const transactionsRef = collection(db, 'transactions')
  const snapshot = await getCountFromServer(transactionsRef)
  return snapshot.data().count
}

// Fetch pending transactions
export const fetchPendingBooks = async () => {
  const transactionsRef = query(collection(db, 'transactions'), where('status', '==', 'pending'))
  const snapshot = await getCountFromServer(transactionsRef)
  return snapshot.data().count
}

export const fetchTransactionStatusCounts = async () => {
  const statuses = ['approved', 'pending', 'rejected']
  const counts = {}

  for (const status of statuses) {
    const q = query(collection(db, 'transactions'), where('status', '==', status))
    const snapshot = await getDocs(q)
    counts[status] = snapshot.size
  }

  return counts
}

// Fetch transactions by month
export const fetchTransactionsByMonth = async () => {
  const q = query(collection(db, 'transactions'))
  const snapshot = await getDocs(q)

  const monthlyCounts = Array(12).fill(0) // Array untuk 12 bulan

  snapshot.docs.forEach((doc) => {
    const transaction = doc.data()
    const date = transaction.createdAt?.toDate()
    if (date) {
      const month = date.getMonth()
      monthlyCounts[month]++
    }
  })

  return monthlyCounts
}

// Fetch book counts by category
export const fetchBookCategoryCounts = async () => {
  const q = query(collection(db, 'books'))
  const snapshot = await getDocs(q)

  const categoryCounts = {}

  snapshot.docs.forEach((doc) => {
    const book = doc.data()
    const category = book.category || 'Uncategorized'

    if (!categoryCounts[category]) {
      categoryCounts[category] = 0
    }
    categoryCounts[category]++
  })

  return categoryCounts
}
