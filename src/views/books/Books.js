import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPlus, cilSearch } from '@coreui/icons'
import DataTable from 'react-data-table-component'
import { fetchBooks, addBook, updateBook, deleteBook } from './BooksViewModel'

const defaultBook = {
  isbn: '',
  title: '',
  author: '',
  category: '',
  publisher: '',
  year: null,
  stock: null,
}

const Books = () => {
  const [visible, setVisible] = useState(false)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [newBook, setNewBook] = useState({
    isbn: '',
    title: '',
    author: '',
    category: '',
    publisher: '',
    year: '',
    stock: 0,
  })
  const [editBookId, setEditBookId] = useState(null)
  const role = useSelector((state) => state.user?.role)

  const columns = [
    {
      name: 'Id',
      selector: (row) => row.id,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Title',
      selector: (row) => row.title,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Author',
      selector: (row) => row.author,
      sortable: true,
      width: '200px',
    },
    {
      name: 'Category',
      selector: (row) => row.category,
      sortable: true,
    },
    {
      name: 'Publisher',
      selector: (row) => row.publisher,
      sortable: true,
    },
    {
      name: 'Year',
      selector: (row) => row.year,
      sortable: true,
    },
    {
      name: 'Stock',
      selector: (row) => row.stock,
      sortable: true,
    },
    {
      name: 'Created At',
      selector: (row) =>
        row.createdAt && row.createdAt.seconds
          ? new Date(row.createdAt.seconds * 1000).toLocaleString()
          : 'N/A',
      sortable: true,
      width: '200px',
    },
    {
      name: 'Actions',
      cell: (row) => (
        <>
          {role === 'admin' && (
            <>
              <CButton
                color="warning"
                size="sm"
                onClick={() => {
                  setEditBookId(row.id)
                  setNewBook(row)
                  setVisible(true)
                }}
                style={{ width: '60px' }}
              >
                Edit
              </CButton>
              <CButton
                color="danger"
                size="sm"
                onClick={() => deleteBook(row.id, refreshBooks)}
                className="ms-2"
                style={{ width: '60px' }}
              >
                Delete
              </CButton>
            </>
          )}
        </>
      ),
      width: '200px',
    },
  ]

  // Refresh data buku
  const refreshBooks = () => fetchBooks(setBooks, setLoading)

  useEffect(() => {
    refreshBooks()
  }, [])

  const handleSave = () => {
    if (editBookId) {
      updateBook(editBookId, newBook, setVisible, refreshBooks)
    } else {
      addBook(newBook, setVisible, refreshBooks)
    }
    setNewBook({
      isbn: '',
      title: '',
      author: '',
      category: '',
      publisher: '',
      year: null,
      stock: null,
    })
    setEditBookId(null)
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3">
              {role === 'admin' && (
                <CCol xs={12}>
                  <CButton
                    color="primary"
                    onClick={() => {
                      setVisible(true)
                      setEditBookId(null)
                      setNewBook(defaultBook)
                    }}
                    style={{ width: '90px' }}
                    size="sm"
                  >
                    <CIcon icon={cilPlus} className="me-2" />
                    Add
                  </CButton>
                </CCol>
              )}

              <CCol md={6}>
                <CFormLabel htmlFor="inputEmail4">ISBN</CFormLabel>
                <CFormInput type="text" />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="inputPassword4">Book Name</CFormLabel>
                <CFormInput type="text" />
              </CCol>
              <CCol xs={12}>
                <CButton color="primary" size="sm" style={{ width: '90px' }}>
                  <CIcon icon={cilSearch} className="me-2" />
                  Search
                </CButton>
              </CCol>
            </CForm>
            <hr />
            <DataTable
              columns={columns}
              data={books}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="500px"
              responsive
              progressPending={loading}
            />
          </CCardBody>
        </CCard>
        <CModal
          backdrop="static"
          visible={visible}
          onClose={() => setVisible(false)}
          aria-labelledby="StaticBackdropExampleLabel"
          alignment="center"
          size="lg"
        >
          <CModalHeader>
            <CModalTitle>{editBookId ? 'Edit Book' : 'Add Book'}</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol md={12}>
                <CFormLabel>ISBN</CFormLabel>
                <CFormInput
                  type="text"
                  value={newBook.isbn}
                  onChange={(e) => setNewBook({ ...newBook, isbn: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Book Name</CFormLabel>
                <CFormInput
                  type="text"
                  value={newBook.title}
                  onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Author</CFormLabel>
                <CFormInput
                  type="text"
                  value={newBook.author}
                  onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Category</CFormLabel>
                <CFormInput
                  type="text"
                  value={newBook.category}
                  onChange={(e) => setNewBook({ ...newBook, category: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Publisher</CFormLabel>
                <CFormInput
                  type="text"
                  value={newBook.publisher}
                  onChange={(e) => setNewBook({ ...newBook, publisher: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Year</CFormLabel>
                <CFormInput
                  type="number"
                  value={newBook.year}
                  onChange={(e) => setNewBook({ ...newBook, year: e.target.value })}
                  required
                />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Stock</CFormLabel>
                <CFormInput
                  type="number"
                  value={newBook.stock}
                  onChange={(e) => setNewBook({ ...newBook, stock: e.target.value })}
                  required
                />
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => {
                setVisible(false)
                setNewBook(defaultBook)
              }}
              size="sm"
              style={{ width: '90px' }}
            >
              Close
            </CButton>
            <CButton color="primary" size="sm" style={{ width: '90px' }} onClick={handleSave}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default Books
