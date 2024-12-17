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

export const fetchUserNotifications = async (userRef) => {
  try {
    const notificationsRef = collection(db, 'user_notifications')
    const q = query(notificationsRef, where('userId', '==', userRef), orderBy('createdAt', 'desc'))

    const querySnapshot = await getDocs(q)
    const notifications = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    return notifications
  } catch (error) {
    console.error('Error fetching user notifications:', error)
    return []
  }
}

const fetchUserTransactions = async () => {
  try {
    const q = query(
      collection(db, 'transactions'),
      where('status', 'in', ['approved', 'rejected', 'pending']),
    )
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error fetching transactions:', error)
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
    await deleteDoc(doc(db, 'admin_notifications', notificationId))

    if (transactionId) {
      const transactionRef = doc(db, 'transactions', transactionId)
      await updateDoc(transactionRef, { isNotified: false })
    } else {
      console.warn('Transaction ID is undefined. Skipping transaction update.')
    }
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
export const addNotification = async (message, type) => {
  try {
    const exists = await notificationExists(message) // Check for duplicates
    if (exists) {
      return
    }

    // Add the notification with the type field
    await addDoc(collection(db, 'admin_notifications'), {
      message,
      type, // Add the type field
      isRead: false,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error adding notification:', error)
  }
}

export const addUserNotification = async (userId, message, type) => {
  try {
    await addDoc(collection(db, 'user_notifications'), {
      userId: doc(db, 'users', userId), // Reference to the user document
      message,
      type, // "reminder" or "status"
      isRead: false,
      createdAt: serverTimestamp(),
    })
  } catch (error) {
    console.error('Error adding user notification:', error)
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

      // Tambahkan notifikasi dengan type "admin_overdue"
      await addNotification(message, 'admin_overdue')

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

    // Add notification with type "admin_reminder"
    await addNotification(
      `Reminder: The book "${bookTitle}" borrowed by "${userName}" is due in the next 3 days.`,
      'admin_reminder',
    )
  }
}

export const handleUserReminders = async () => {
  try {
    const today = new Date()
    const threeDaysFromNow = new Date()
    threeDaysFromNow.setDate(today.getDate() + 3)

    const q = query(
      collection(db, 'transactions'),
      where('status', '==', 'approved'),
      where('dueDate', '>=', today),
      where('dueDate', '<=', threeDaysFromNow),
    )

    const querySnapshot = await getDocs(q)
    for (const transactionDoc of querySnapshot.docs) {
      const transaction = transactionDoc.data()

      if (!transaction.book || !transaction.user) {
        console.warn('Skipping transaction due to missing book or user:', transaction)
        continue
      }

      // Fetch user and book data
      const userRef = transaction.user
      const bookRef = transaction.book

      const userSnap = await getDoc(userRef)
      const bookSnap = await getDoc(bookRef)

      const userId = userSnap.id
      const userName = userSnap.exists() ? userSnap.data().name : 'Unknown User'
      const bookTitle = bookSnap.exists() ? bookSnap.data().title : 'Unknown Book'

      const message = `Reminder: Your borrowed book '${bookTitle}' is due in 3 days.`
      await addUserNotification(userId, message, 'reminder')
    }
  } catch (error) {
    console.error('Error processing user reminders:', error)
  }
}

export const handleUserStatusNotifications = async () => {
  try {
    const transactions = await fetchUserTransactions()

    for (const transaction of transactions) {
      const { status, user, book, isNotified } = transaction

      if (!user || !book || isNotified) continue

      const userSnap = await getDoc(user)
      const bookSnap = await getDoc(book)

      const userId = userSnap.id
      const bookTitle = bookSnap.exists() ? bookSnap.data().title : 'Unknown Book'

      let message = ''
      if (status === 'approved') {
        message = `Your request to borrow the book '${bookTitle}' has been approved.`
      } else if (status === 'rejected') {
        message = `Your request to borrow the book '${bookTitle}' has been rejected.`
      }

      if (message) {
        await addUserNotification(userId, message, 'status')

        // Mark transaction as notified
        const transactionRef = doc(db, 'transactions', transaction.id)
        await updateDoc(transactionRef, { isNotified: true })
      }
    }
  } catch (error) {
    console.error('Error processing user status notifications:', error)
  }
}
