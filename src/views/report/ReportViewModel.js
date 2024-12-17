import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
  where,
  doc,
  getDoc,
  updateDoc,
  increment,
} from 'firebase/firestore'
import { db } from '../../config/firestore'

export const updateBorrowCount = async (bookId, userId) => {
  try {
    const bookRef = doc(db, 'books', bookId)
    await updateDoc(bookRef, {
      borrowCount: increment(1),
    })

    const userRef = doc(db, 'users', userId)
    await updateDoc(userRef, {
      borrowCount: increment(1),
    })
  } catch (error) {
    console.error('Error updating borrow count:', error)
  }
}

// Fetch top borrowed books
export const fetchTopBorrowedBooks = async () => {
  try {
    const booksSnapshot = await getDocs(
      query(collection(db, 'books'), orderBy('borrowCount', 'desc'), limit(5)),
    )
    return booksSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching top borrowed books:', error)
    return []
  }
}

// Fetch top active users
export const fetchTopActiveUsers = async () => {
  try {
    const transactionsSnapshot = await getDocs(
      query(collection(db, 'transactions'), where('status', '==', 'returned')),
    )

    const userBorrowCount = {}
    transactionsSnapshot.docs.forEach((doc) => {
      const { user } = doc.data()
      const userId = user.id
      if (!userBorrowCount[userId]) {
        userBorrowCount[userId] = 0
      }
      userBorrowCount[userId]++
    })

    const sortedUsers = Object.entries(userBorrowCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)

    const users = []
    for (const [userId, count] of sortedUsers) {
      const userDoc = await getDoc(doc(db, 'users', userId))
      if (userDoc.exists()) {
        users.push({ id: userId, ...userDoc.data(), borrowCount: count })
      }
    }
    return users
  } catch (error) {
    console.error('Error fetching top active users:', error)
    return []
  }
}

// Fetch transaction history
export const fetchTransactionHistory = async () => {
  try {
    const transactionsSnapshot = await getDocs(
      query(collection(db, 'transactions'), orderBy('borrowDate', 'desc'), limit(10)),
    )

    const transactions = []
    for (const doc of transactionsSnapshot.docs) {
      const data = doc.data()
      const userDoc = await getDoc(data.user)
      const bookDoc = await getDoc(data.book)

      transactions.push({
        id: doc.id,
        userName: userDoc.exists() ? userDoc.data().name : 'Unknown User',
        bookTitle: bookDoc.exists() ? bookDoc.data().title : 'Unknown Book',
        borrowDate: data.borrowDate,
        returnDate: data.returnDate || null,
        status: data.status,
      })
    }
    return transactions
  } catch (error) {
    console.error('Error fetching transaction history:', error)
    return []
  }
}
