import { collection, addDoc, updateDoc, deleteDoc, getDocs, doc } from 'firebase/firestore'
import { auth, db } from '../../config/firestore'
import { sendPasswordResetEmail, deleteUser as deleteAuthUser } from 'firebase/auth'
import Swal from 'sweetalert2'

// Ambil semua data users
export const fetchUsers = async (setUsers, setLoading) => {
  setLoading(true)
  try {
    const querySnapshot = await getDocs(collection(db, 'users'))
    const users = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setUsers(users)
    return users
  } catch (error) {
    console.error('Error fetching users:', error)
    return []
  } finally {
    setLoading(false)
  }
}

// Reset kata sandi pengguna
export const resetPassword = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email)
    Swal.fire({
      icon: 'success',
      title: 'Password Reset Email Sent',
      text: `A password reset email has been sent to ${email}. Please check your inbox.`,
    })
  } catch (error) {
    console.error('Error resetting password:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'An error occurred while sending the password reset email.',
    })
  }
}
