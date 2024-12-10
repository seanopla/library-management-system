import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import {
  fetchTopBorrowedBooks,
  fetchTopActiveUsers,
  fetchTransactionHistory,
} from './ReportViewModel'

const Report = () => {
  const [topBooks, setTopBooks] = useState([])
  const [activeUsers, setActiveUsers] = useState([])
  const [transactionHistory, setTransactionHistory] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      const books = await fetchTopBorrowedBooks()
      const users = await fetchTopActiveUsers()
      const transactions = await fetchTransactionHistory()

      setTopBooks(books)
      setActiveUsers(users)
      setTransactionHistory(transactions)
    }

    fetchData()
  }, [])

  return (
    <CRow>
      {/* Statistik Buku Paling Sering Dipinjam */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Top Borrowed Books</CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Title</CTableHeaderCell>
                  <CTableHeaderCell>Borrow Count</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {topBooks.map((book, index) => (
                  <CTableRow key={book.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{book.title}</CTableDataCell>
                    <CTableDataCell>{book.borrowCount}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Daftar Pengguna Aktif */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Top Active Users</CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Email</CTableHeaderCell>
                  <CTableHeaderCell>Borrow Count</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {activeUsers.map((user, index) => (
                  <CTableRow key={user.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{user.name}</CTableDataCell>
                    <CTableDataCell>{user.email}</CTableDataCell>
                    <CTableDataCell>{user.borrowCount}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>

      {/* Riwayat Peminjaman */}
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>Transaction History</CCardHeader>
          <CCardBody>
            <CTable>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>User Name</CTableHeaderCell>
                  <CTableHeaderCell>Book Title</CTableHeaderCell>
                  <CTableHeaderCell>Borrow Date</CTableHeaderCell>
                  <CTableHeaderCell>Return Date</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {transactionHistory.map((transaction, index) => (
                  <CTableRow key={transaction.id}>
                    <CTableDataCell>{index + 1}</CTableDataCell>
                    <CTableDataCell>{transaction.userName}</CTableDataCell>
                    <CTableDataCell>{transaction.bookTitle}</CTableDataCell>
                    <CTableDataCell>
                      {new Date(transaction.borrowDate.seconds * 1000).toLocaleDateString('es-US')}
                    </CTableDataCell>
                    <CTableDataCell>
                      {transaction.returnDate
                        ? new Date(transaction.returnDate.seconds * 1000).toLocaleDateString(
                            'es-US',
                          )
                        : '-'}
                    </CTableDataCell>
                    <CTableDataCell>{transaction.status}</CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Report
