import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilReload, cilSearch, cilX } from '@coreui/icons'
import DataTable from 'react-data-table-component'
import { fetchUsers, resetPassword } from './UsersViewModel'
import ExportToCSV from '../../utils/csvExport'
import { formatUsersData } from '../../utils/csvFormatUtils'

const defaultSearch = {
  name: '',
  email: '',
}

const headers = [
  { label: 'ID', key: 'Id' },
  { label: 'Name', key: 'Name' },
  { label: 'Email', key: 'Email' },
  { label: 'Role', key: 'Role' },
  { label: 'Phone', key: 'Phone' },
  { label: 'Address', key: 'Address' },
  { label: 'Borrow Count', key: 'BorrowCount' },
  { label: 'Created At', key: 'CreatedAt' },
]

const Users = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchFilters, setSearchFilters] = useState(defaultSearch)

  // Ambil data pengguna
  const refreshUsers = async () => {
    const allUsers = await fetchUsers(setUsers, setLoading)
    setFilteredUsers(allUsers)
  }

  useEffect(() => {
    refreshUsers()
  }, [])

  const handleSearch = () => {
    const filtered = users.filter((user) => {
      return (
        (searchFilters.name === '' ||
          user.name.toLowerCase().includes(searchFilters.name.toLowerCase())) &&
        (searchFilters.email === '' ||
          user.email.toLowerCase().includes(searchFilters.email.toLowerCase()))
      )
    })
    setFilteredUsers(filtered)
  }

  const handleRefresh = () => {
    refreshUsers()
  }

  const handleClear = () => {
    setSearchFilters(defaultSearch)
  }

  const columns = [
    { name: 'Id', selector: (row) => row.id, sortable: true, wrap: true, width: '200px' },
    { name: 'Name', selector: (row) => row.name, sortable: true, wrap: true, width: '200px' },
    { name: 'Email', selector: (row) => row.email, sortable: true, wrap: true, width: '200px' },
    { name: 'Role', selector: (row) => row.role, sortable: true },
    { name: 'Phone', selector: (row) => row.phone, sortable: true, wrap: true, width: '200px' },
    { name: 'Address', selector: (row) => row.address, sortable: true, wrap: true, width: '200px' },
    {
      name: 'Created At',
      selector: (row) =>
        row.createdAt && row.createdAt.seconds
          ? new Date(row.createdAt.seconds * 1000).toLocaleString('es-US')
          : 'N/A',
      sortable: true,
      width: '200px',
    },
    {
      name: 'Actions',
      width: '200px',
      cell: (row) => (
        <>
          <CButton
            size="sm"
            color="danger"
            className="text-white"
            onClick={() => resetPassword(row.email)}
          >
            Reset Password
          </CButton>
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
              <CCol xs={12}>
                <ExportToCSV
                  data={formatUsersData(users)}
                  headers={headers}
                  filename="users_data"
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="searchName">Name</CFormLabel>
                <CFormInput
                  id="searchName"
                  type="text"
                  value={searchFilters.name}
                  onChange={(e) => setSearchFilters({ ...searchFilters, name: e.target.value })}
                />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="searchEmail">Email</CFormLabel>
                <CFormInput
                  id="searchEmail"
                  type="text"
                  value={searchFilters.email}
                  onChange={(e) => setSearchFilters({ ...searchFilters, email: e.target.value })}
                />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" size="sm" onClick={handleSearch} style={{ width: '90px' }}>
                  <CIcon icon={cilSearch} className="me-2" />
                  Search
                </CButton>
                <CButton
                  color="primary"
                  size="sm"
                  className="mx-2"
                  onClick={handleRefresh}
                  style={{ width: '90px' }}
                >
                  <CIcon icon={cilReload} className="me-2" />
                  Refresh
                </CButton>
                <CButton
                  color="danger"
                  size="sm"
                  onClick={handleClear}
                  className="text-white"
                  style={{ width: '90px' }}
                >
                  <CIcon icon={cilX} className="me-2" />
                  Clear
                </CButton>
              </CCol>
            </CForm>
            <hr />
            <DataTable
              columns={columns}
              data={filteredUsers}
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

export default Users
