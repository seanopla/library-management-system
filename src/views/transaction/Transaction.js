import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CForm,
  CFormLabel,
  CFormSelect,
  CFormInput,
} from '@coreui/react'
import DataTable from 'react-data-table-component'
import {
  fetchTransactions,
  approveTransaction,
  rejectTransaction,
  confirmReturn,
} from './TransactionsViewModel'
import CIcon from '@coreui/icons-react'
import { cilReload, cilSearch, cilX } from '@coreui/icons'

const searchInput = {
  userName: '',
  bookTitle: '',
}

const Transaction = () => {
  const [transactions, setTransactions] = useState([])
  const [filteredTransactions, setFilteredTransactions] = useState([])
  const [loading, setLoading] = useState(true)
  const [filterStatus, setFilterStatus] = useState('all')
  const [searchFilters, setSearchFilters] = useState(searchInput)

  // Fetch data
  const refreshTransactions = async () => {
    setLoading(true)
    const data = await fetchTransactions()
    setTransactions(data)
    setFilteredTransactions(data)
    setLoading(false)
  }

  useEffect(() => {
    refreshTransactions()
  }, [])

  const handleSearch = () => {
    const filtered = transactions.filter((transaction) => {
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
      const matchesUserName =
        searchFilters.userName === '' ||
        transaction.userName.toLowerCase().includes(searchFilters.userName.toLowerCase())
      const matchesBookTitle =
        searchFilters.bookTitle === '' ||
        transaction.bookTitle.toLowerCase().includes(searchFilters.bookTitle.toLowerCase())

      return matchesStatus && matchesUserName && matchesBookTitle
    })
    setFilteredTransactions(filtered)
  }

  const handleClear = () => {
    setSearchFilters(searchInput)
    setFilterStatus('all')
  }

  const columns = [
    {
      name: 'User Name',
      selector: (row) => row.userName,
      sortable: true,
      width: '200px',
      wrap: true,
    },
    {
      name: 'Book Title',
      selector: (row) => row.bookTitle,
      sortable: true,
      width: '200px',
      wrap: true,
    },
    {
      name: 'Borrow Date',
      selector: (row) =>
        row.borrowDate ? new Date(row.borrowDate.seconds * 1000).toLocaleDateString('es-US') : '-',
      sortable: true,
    },
    {
      name: 'Return Date',
      selector: (row) =>
        row.returnDate ? new Date(row.returnDate.seconds * 1000).toLocaleDateString('es-US') : '-',
      sortable: true,
    },
    {
      name: 'Due Date',
      selector: (row) =>
        row.dueDate ? new Date(row.dueDate.seconds * 1000).toLocaleDateString('es-US') : '-',
      sortable: true,
    },

    { name: 'Status', selector: (row) => row.status, sortable: true },
    {
      name: 'Actions',
      width: '200px',
      cell: (row) => (
        <>
          {row.status === 'pending' && (
            <>
              <CButton
                color="success"
                size="sm"
                className="me-2 text-white"
                style={{ width: '80px' }}
                onClick={() => approveTransaction(row.id, refreshTransactions)}
              >
                Approve
              </CButton>
              <CButton
                color="danger"
                size="sm"
                className="text-white"
                style={{ width: '80px' }}
                onClick={() => rejectTransaction(row.id, refreshTransactions)}
              >
                Reject
              </CButton>
            </>
          )}
          {row.status === 'approved' && (
            <CButton
              color="info"
              size="sm"
              className="text-white"
              style={{ width: '80px' }}
              onClick={() => confirmReturn(row.id, refreshTransactions)}
            >
              Return
            </CButton>
          )}
        </>
      ),
    },
  ]

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3">
              <CCol md={6}>
                <CFormLabel htmlFor="inputEmail4">User Name</CFormLabel>
                <CFormInput
                  type="text"
                  value={searchFilters.userName}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({ ...prev, userName: e.target.value }))
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="inputPassword4">Book Title</CFormLabel>
                <CFormInput
                  type="text"
                  value={searchFilters.bookTitle}
                  onChange={(e) =>
                    setSearchFilters((prev) => ({ ...prev, bookTitle: e.target.value }))
                  }
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Status</CFormLabel>
                <CFormSelect value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                  <option value="all">All</option>
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                  <option value="returned">Returned</option>
                </CFormSelect>
              </CCol>
              <CCol xs={12}>
                <CButton
                  color="primary"
                  size="sm"
                  style={{ width: '90px' }}
                  onClick={() => handleSearch()}
                  className="me-2"
                >
                  <CIcon icon={cilSearch} className="me-2" />
                  Search
                </CButton>
                <CButton
                  color="primary"
                  size="sm"
                  onClick={refreshTransactions}
                  style={{ width: '90px' }}
                  className="me-2"
                >
                  <CIcon icon={cilReload} className="me-2" />
                  Refresh
                </CButton>
                <CButton
                  color="danger text-white"
                  size="sm"
                  style={{ width: '90px' }}
                  onClick={() => handleClear()}
                >
                  <CIcon icon={cilX} className="me-2" />
                  Clear
                </CButton>
              </CCol>
            </CForm>
            <hr />
            <DataTable
              columns={columns}
              data={filteredTransactions}
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

export default Transaction
