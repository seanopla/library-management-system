import {
  collection,
  getDocs,
  query,
  where,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../config/firestore'

// Fetch all books
export const fetchBooks = async () => {
  try {
    const booksSnapshot = await getDocs(collection(db, 'books'))
    const books = booksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    return books
  } catch (error) {
    console.error('Error fetching books:', error)
    throw error
  }
}

// Fetch user's transactions
export const fetchUserTransactions = async (userId) => {
  try {
    const q = query(collection(db, 'transactions'), where('user', '==', doc(db, 'users', userId)))
    const querySnapshot = await getDocs(q)
    const transactions = []

    for (const docSnap of querySnapshot.docs) {
      const transactionData = docSnap.data()

      const bookSnap = await getDoc(transactionData.book)
      const bookData = bookSnap.exists() ? bookSnap.data() : {}

      transactions.push({
        id: docSnap.id,
        bookTitle: bookData.title || 'Unknown',
        status: transactionData.status,
      })
    }

    return transactions
  } catch (error) {
    console.error('Error fetching user transactions:', error)
    throw error
  }
}

// Request to borrow a book
export const requestBorrow = async (userId, bookId) => {
  try {
    const userRef = doc(db, 'users', userId)
    const bookRef = doc(db, 'books', bookId)

    await addDoc(collection(db, 'transactions'), {
      user: userRef,
      book: bookRef,
      status: 'pending',
      borrowDate: null,
      dueDate: null,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error requesting borrow:', error)
    throw error
  }
}

// Cancel a borrow request
export const cancelBorrowRequest = async (transactionId) => {
  try {
    await deleteDoc(doc(db, 'transactions', transactionId))
  } catch (error) {
    console.error('Error canceling borrow request:', error)
    throw error
  }
}
