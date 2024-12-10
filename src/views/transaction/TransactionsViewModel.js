import { collection, getDocs, doc, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../config/firestore'
import Swal from 'sweetalert2'
import { updateBorrowCount } from '../report/ReportViewModel'

// Fetch data
export const fetchTransactions = async () => {
  try {
    const transactionsSnapshot = await getDocs(collection(db, 'transactions'))
    const transactions = []

    for (const transactionDoc of transactionsSnapshot.docs) {
      const transactionData = transactionDoc.data()

      // Ambil referensi user dan book
      const userRef = transactionData.user
      const bookRef = transactionData.book

      // Ambil data user dan book
      const userDoc = await getDoc(userRef)
      const bookDoc = await getDoc(bookRef)

      // Gabungkan data
      transactions.push({
        id: transactionDoc.id,
        userName: userDoc.exists() ? userDoc.data().name : 'Unknown User',
        bookTitle: bookDoc.exists() ? bookDoc.data().title : 'Unknown Book',
        ...transactionData,
      })
    }

    return transactions
  } catch (error) {
    console.error('Error fetching transactions with references:', error)
    return []
  }
}

// Approve function
export const approveTransaction = async (transactionId, refreshTransactions) => {
  try {
    const transactionRef = doc(db, 'transactions', transactionId)
    const transactionSnap = await getDoc(transactionRef)

    if (!transactionSnap.exists()) {
      throw new Error('Transaction does not exist.')
    }

    const transactionData = transactionSnap.data()

    const today = new Date()
    const dueDate = new Date()
    dueDate.setDate(today.getDate() + 30)

    await updateDoc(transactionRef, {
      status: 'approved',
      borrowDate: serverTimestamp(),
      dueDate: dueDate,
    })

    // Perbarui borrowCount di books dan users
    if (transactionData.book && transactionData.user) {
      const bookId = transactionData.book.id
      const userId = transactionData.user.id

      await updateBorrowCount(bookId, userId)
    } else {
      throw new Error('Invalid book or user reference in the transaction.')
    }

    Swal.fire({
      icon: 'success',
      title: 'Approved!',
      text: 'The transaction has been approved successfully.',
    })

    refreshTransactions()
  } catch (error) {
    console.error('Error approving transaction:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to approve transaction. Please try again.',
    })
  }
}

// Reject function
export const rejectTransaction = async (transactionId, refreshTransactions) => {
  try {
    await updateDoc(doc(db, 'transactions', transactionId), {
      status: 'rejected',
    })

    Swal.fire({
      icon: 'warning',
      title: 'Rejected',
      text: 'The transaction has been rejected.',
    })

    refreshTransactions()
  } catch (error) {
    console.error('Error rejecting transaction:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to reject transaction. Please try again.',
    })
  }
}

// Return function
export const confirmReturn = async (transactionId, refreshTransactions) => {
  try {
    await updateDoc(doc(db, 'transactions', transactionId), {
      status: 'returned',
      returnDate: serverTimestamp(),
    })

    Swal.fire({
      icon: 'info',
      title: 'Book Returned!',
      text: 'The return has been confirmed successfully.',
    })

    refreshTransactions()
  } catch (error) {
    console.error('Error confirming return:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to confirm return. Please try again.',
    })
  }
}
