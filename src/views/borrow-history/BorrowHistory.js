import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CFormSelect,
} from '@coreui/react'
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore'
import { db } from '../../config/firestore'
import { useSelector } from 'react-redux'
import DataTable from 'react-data-table-component'

const BorrowHistory = () => {
  const [history, setHistory] = useState([])
  const [filteredHistory, setFilteredHistory] = useState([])
  const [statusFilter, setStatusFilter] = useState('all')
  const userId = useSelector((state) => state.user?.uid)

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      try {
        const q = query(
          collection(db, 'transactions'),
          where('user', '==', doc(db, 'users', userId)),
        )
        const querySnapshot = await getDocs(q)

        const historyData = []

        for (const transactionDoc of querySnapshot.docs) {
          const transaction = transactionDoc.data()

          // Fetch user and book data
          const userRef = transaction.user
          const bookRef = transaction.book

          const userSnap = userRef ? await getDoc(userRef) : null
          const bookSnap = bookRef ? await getDoc(bookRef) : null

          historyData.push({
            id: transactionDoc.id,
            bookTitle: bookSnap?.data()?.title || 'Unknown Book',
            borrowDate: transaction.borrowDate,
            dueDate: transaction.dueDate,
            returnDate: transaction.returnDate,
            status: transaction.status,
          })
        }

        setHistory(historyData)
        setFilteredHistory(historyData)
      } catch (error) {
        console.error('Error fetching borrow history:', error)
      }
    }

    if (userId) fetchBorrowHistory()
  }, [userId])

  // Filter berdasarkan status
  const handleFilterChange = (e) => {
    const value = e.target.value
    setStatusFilter(value)
    if (value === 'all') {
      setFilteredHistory(history)
    } else {
      const filtered = history.filter((item) => item.status === value)
      setFilteredHistory(filtered)
    }
  }

  const columns = [
    { name: 'Book Title', selector: (row) => row.bookTitle || 'N/A', sortable: true },
    {
      name: 'Borrow Date',
      selector: (row) =>
        row.borrowDate ? new Date(row.borrowDate.seconds * 1000).toLocaleDateString() : '-',
      sortable: true,
    },
    {
      name: 'Due Date',
      selector: (row) =>
        row.dueDate ? new Date(row.dueDate.seconds * 1000).toLocaleDateString() : '-',
      sortable: true,
    },
    {
      name: 'Return Date',
      selector: (row) =>
        row.returnDate ? new Date(row.returnDate.seconds * 1000).toLocaleDateString() : '-',
      sortable: true,
    },
    { name: 'Status', selector: (row) => row.status, sortable: true },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <h5>Borrow and Return History</h5>
            <CCol className="mt-3" md={6}>
              <CFormSelect
                className="mb-3"
                value={statusFilter}
                onChange={handleFilterChange}
                aria-label="Filter by status"
              >
                <option value="all">All</option>
                <option value="approved">Borrowed</option>
                <option value="returned">Returned</option>
              </CFormSelect>
            </CCol>
            <hr />

            <DataTable
              columns={columns}
              data={filteredHistory}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="500px"
              noDataComponent="No history available."
            />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default BorrowHistory
