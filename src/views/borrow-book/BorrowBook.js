import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSearch, cilReload, cilX } from '@coreui/icons'
import DataTable from 'react-data-table-component'
import {
  fetchBooks,
  fetchUserTransactions,
  requestBorrow,
  cancelBorrowRequest,
} from './BorrowViewModel'
import Swal from 'sweetalert2'

const defaultSearch = {
  title: '',
  author: '',
}

const BorrowBook = () => {
  const [books, setBooks] = useState([])
  const [filteredBooks, setFilteredBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchFilters, setSearchFilters] = useState(defaultSearch)
  const [userTransactions, setUserTransactions] = useState([])

  const userId = useSelector((state) => state.user?.uid)

  const columns = [
    { name: 'Title', selector: (row) => row.title, sortable: true },
    { name: 'Author', selector: (row) => row.author, sortable: true },
    { name: 'ISBN', selector: (row) => row.isbn, sortable: true },
    { name: 'Category', selector: (row) => row.category, sortable: true },
    { name: 'Stock', selector: (row) => row.stock, sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <CButton
          color="primary"
          size="sm"
          onClick={() => handleBorrowRequest(row)}
          disabled={row.stock === 0 || isAlreadyRequested(row.id)}
        >
          {isAlreadyRequested(row.id) ? 'Requested' : 'Borrow'}
        </CButton>
      ),
    },
  ]

  const isAlreadyRequested = (bookId) => {
    return userTransactions.some(
      (transaction) => transaction.bookId === bookId && transaction.status === 'pending',
    )
  }

  const refreshBooks = async () => {
    setLoading(true)
    const data = await fetchBooks()
    setBooks(data)
    setFilteredBooks(data)
    setLoading(false)
  }

  const refreshUserTransactions = async () => {
    if (userId) {
      const transactions = await fetchUserTransactions(userId)
      setUserTransactions(transactions)
    }
  }

  useEffect(() => {
    refreshBooks()
    refreshUserTransactions()
  }, [])

  const handleSearch = () => {
    const filtered = books.filter((book) => {
      return (
        (searchFilters.title === '' ||
          book.title.toLowerCase().includes(searchFilters.title.toLowerCase())) &&
        (searchFilters.author === '' ||
          book.author.toLowerCase().includes(searchFilters.author.toLowerCase()))
      )
    })
    setFilteredBooks(filtered)
  }

  const handleClear = () => {
    setSearchFilters(defaultSearch)
    setFilteredBooks(books)
  }

  const handleBorrowRequest = async (book) => {
    try {
      await requestBorrow(userId, book.id)
      Swal.fire('Success', 'Borrow request submitted successfully!', 'success')
      refreshUserTransactions()
    } catch (error) {
      Swal.fire('Error', 'Failed to submit borrow request. Try again.', 'error')
    }
  }

  const handleCancelRequest = async (transactionId) => {
    try {
      await cancelBorrowRequest(transactionId)
      Swal.fire('Success', 'Borrow request canceled successfully!', 'success')
      refreshUserTransactions()
    } catch (error) {
      Swal.fire('Error', 'Failed to cancel borrow request. Try again.', 'error')
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <h5>Your Borrow Requests</h5>
            <ul>
              {userTransactions.map((transaction) => (
                <li key={transaction.id}>
                  {transaction.bookTitle} - {transaction.status}
                  {transaction.status === 'pending' && (
                    <CButton
                      color="danger"
                      size="sm"
                      className="ms-2 text-white"
                      style={{ width: '90px' }}
                      onClick={() => handleCancelRequest(transaction.id)}
                    >
                      Cancel
                    </CButton>
                  )}
                </li>
              ))}
            </ul>
            <hr />

            <CForm className="row g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="inputTitle">Book Title</CFormLabel>
                <CFormInput
                  type="text"
                  value={searchFilters.title}
                  onChange={(e) => setSearchFilters({ ...searchFilters, title: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="inputAuthor">Author</CFormLabel>
                <CFormInput
                  type="text"
                  value={searchFilters.author}
                  onChange={(e) => setSearchFilters({ ...searchFilters, author: e.target.value })}
                />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" size="sm" style={{ width: '90px' }} onClick={handleSearch}>
                  <CIcon icon={cilSearch} className="me-2" />
                  Search
                </CButton>
                <CButton
                  className="mx-2"
                  color="primary"
                  size="sm"
                  style={{ width: '90px' }}
                  onClick={refreshBooks}
                >
                  <CIcon icon={cilReload} className="me-2" />
                  Refresh
                </CButton>
                <CButton
                  color="danger text-white"
                  size="sm"
                  style={{ width: '90px' }}
                  onClick={handleClear}
                >
                  <CIcon icon={cilX} className="me-2" />
                  Clear
                </CButton>
              </CCol>
            </CForm>

            <hr />
            <DataTable
              columns={columns}
              data={filteredBooks}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="500px"
              responsive
              progressPending={loading}
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BorrowBook
