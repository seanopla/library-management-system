import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore'
import Swal from 'sweetalert2'
import { db } from './../../config/firestore'

// Fungsi untuk mendapatkan semua buku
export const fetchBooks = async (setBooks, setLoading) => {
  setLoading(true)
  try {
    const querySnapshot = await getDocs(collection(db, 'books'))
    const books = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    setBooks(books)
    return books
  } catch (error) {
    console.error('Error fetching books:', error)
    return []
  } finally {
    setLoading(false)
  }
}

// Fungsi untuk menambahkan buku baru
export const addBook = async (newBook, setVisible, refreshBooks) => {
  try {
    const bookData = {
      ...newBook,
      year: parseInt(newBook.year, 10),
      stock: parseInt(newBook.stock, 10),
      createdAt: serverTimestamp(),
      borrowCount: 0,
    }

    await addDoc(collection(db, 'books'), bookData)

    Swal.fire({
      icon: 'success',
      title: 'Book added successfully!',
      showConfirmButton: false,
      timer: 1500,
    })
    setVisible(false)
    refreshBooks()
  } catch (error) {
    console.error('Error adding book:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to add book!',
      text: error.message,
    })
  }
}

// Fungsi untuk memperbarui buku
export const updateBook = async (bookId, updatedBook, setVisible, refreshBooks) => {
  try {
    const bookData = {
      ...updatedBook,
      year: parseInt(updatedBook.year, 10),
      stock: parseInt(updatedBook.stock, 10),
    }

    await updateDoc(doc(db, 'books', bookId), bookData)
    Swal.fire({
      icon: 'success',
      title: 'Book updated successfully!',
      showConfirmButton: false,
      timer: 1500,
    })
    setVisible(false)
    refreshBooks()
  } catch (error) {
    console.error('Error updating book:', error)
    Swal.fire({
      icon: 'error',
      title: 'Failed to update book!',
      text: error.message,
    })
  }
}

// Fungsi untuk menghapus buku
export const deleteBook = async (id, refreshBooks) => {
  Swal.fire({
    title: 'Are you sure?',
    text: 'You will not be able to recover this book!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        const bookRef = doc(db, 'books', id)
        await deleteDoc(bookRef)
        Swal.fire('Deleted!', 'The book has been deleted.', 'success')
        refreshBooks()
      } catch (error) {
        console.error('Error deleting book:', error)
        Swal.fire({
          icon: 'error',
          title: 'Failed to delete book!',
          text: error.message,
        })
      }
    }
  })
}
