import {
  collection,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  where,
  addDoc,
  getDoc,
} from 'firebase/firestore'
import { db } from '../../config/firestore'

export const fetchNotifications = async () => {
  try {
    const q = query(collection(db, 'admin_notifications'), orderBy('createdAt', 'desc'))
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return []
  }
}

export const markAsRead = async (notificationId) => {
  try {
    const notificationRef = doc(db, 'admin_notifications', notificationId)
    await updateDoc(notificationRef, { isRead: true })
  } catch (error) {
    console.error('Error marking notification as read:', error)
  }
}

export const deleteNotification = async (notificationId, transactionId) => {
  try {
    // Hapus notifikasi dari Firestore
    await deleteDoc(doc(db, 'admin_notifications', notificationId))

    // Reset isNotified ke false di transaksi
    const transactionRef = doc(db, 'transactions', transactionId)
    await updateDoc(transactionRef, { isNotified: false })

    console.log('Notification deleted and transaction reset:', transactionId)
  } catch (error) {
    console.error('Error deleting notification:', error)
  }
}

export const fetchOverdueTransactions = async () => {
  try {
    const today = new Date()
    const q = query(
      collection(db, 'transactions'),
      where('status', '==', 'approved'),
      where('dueDate', '<', today),
    )
    const querySnapshot = await getDocs(q)
    const overdueTransactions = []

    querySnapshot.forEach((doc) => {
      overdueTransactions.push({ id: doc.id, ...doc.data() })
    })

    return overdueTransactions
  } catch (error) {
    console.error('Error fetching overdue transactions:', error)
    return []
  }
}

// Fetch transactions nearing due date
export const fetchUpcomingReturns = async () => {
  try {
    const today = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(today.getDate() + 3)

    const q = query(
      collection(db, 'transactions'),
      where('status', '==', 'approved'),
      where('dueDate', '>', today),
      where('dueDate', '<=', threeDaysFromNow),
    )
    const querySnapshot = await getDocs(q)
    const upcomingReturns = []

    querySnapshot.forEach((doc) => {
      upcomingReturns.push({ id: doc.id, ...doc.data() })
    })

    return upcomingReturns
  } catch (error) {
    console.error('Error fetching upcoming returns:', error)
    return []
  }
}

// Check if a notification already exists
const notificationExists = async (message) => {
  const q = query(collection(db, 'admin_notifications'), where('message', '==', message))
  const querySnapshot = await getDocs(q)
  return !querySnapshot.empty // Returns true if the notification already exists
}

// Add notification to Firestore
export const addNotification = async (message) => {
  try {
    const exists = await notificationExists(message) // Check for duplicates
    if (exists) {
      return
    }

    // Add the notification if it does not exist
    await addDoc(collection(db, 'admin_notifications'), {
      message,
      isRead: false,
      createdAt: serverTimestamp(),
    })
    console.log('Notification added:', message)
  } catch (error) {
    console.error('Error adding notification:', error)
  }
}

// Process overdue notifications
export const handleOverdueNotifications = async () => {
  const overdueTransactions = await fetchOverdueTransactions()

  for (const transaction of overdueTransactions) {
    // Validasi keberadaan document references
    if (!transaction.book || !transaction.user) {
      console.warn('Skipping transaction due to missing book or user reference:', transaction)
      continue
    }

    try {
      // Ambil data buku
      const bookRef = transaction.book
      const bookSnap = await getDoc(bookRef)
      const bookTitle = bookSnap.exists() ? bookSnap.data().title : 'Unknown Book'

      // Ambil data user
      const userRef = transaction.user
      const userSnap = await getDoc(userRef)
      const userName = userSnap.exists() ? userSnap.data().name : 'Unknown User'

      // Buat notifikasi
      const message = `The book "${bookTitle}" borrowed by "${userName}" is overdue! Please take action.`

      // Tambahkan notifikasi
      await addNotification(message)

      // Tandai transaksi sebagai sudah dinotifikasi
      const transactionRef = doc(db, 'transactions', transaction.id)
      await updateDoc(transactionRef, { isNotified: true })
    } catch (error) {
      console.error('Error processing transaction:', error, transaction)
    }
  }
}

// Process upcoming return reminders
export const handleUpcomingReminders = async () => {
  const upcomingTransactions = await fetchUpcomingReturns()

  for (const transaction of upcomingTransactions) {
    // Fetch book and user details
    const bookRef = transaction.book
    const userRef = transaction.user

    let bookTitle = 'Unknown Book'
    let userName = 'Unknown User'

    if (bookRef) {
      const bookDoc = await getDoc(bookRef)
      if (bookDoc.exists()) {
        bookTitle = bookDoc.data().title
      }
    }

    if (userRef) {
      const userDoc = await getDoc(userRef)
      if (userDoc.exists()) {
        userName = userDoc.data().name
      }
    }

    await addNotification(
      `Reminder: The book "${bookTitle}" borrowed by "${userName}" is due in the next 3 days.`,
    )
  }
}
