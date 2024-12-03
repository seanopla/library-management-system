import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { DocsExample } from 'src/components'
import { cilPlus, cilSearch } from '@coreui/icons'
import DataTable from 'react-data-table-component'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../config/firestore'

const columns = [
  {
    name: 'Id',
    selector: (row) => row.id,
    sortable: true,
  },
  {
    name: 'Title',
    selector: (row) => row.title,
    sortable: true,
    wrap: true,
  },
  {
    name: 'Author',
    selector: (row) => row.author,
    sortable: true,
  },
  {
    name: 'Genre',
    selector: (row) => row.genre,
    sortable: true,
  },
  {
    name: 'Publication Year',
    selector: (row) => row.publicationYear,
    sortable: true,
  },
  {
    name: 'Copies Available',
    selector: (row) => row.copiesAvailable,
    sortable: true,
  },
]

const Books = () => {
  const [visible, setVisible] = useState(false)
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const role = useSelector((state) => state.user?.role)

  const getData = async () => {
    setLoading(true)
    try {
      const querySnapshot = await getDocs(collection(db, 'transaction '))
      const books = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      setBooks(books)
    } catch (error) {
      console.error('Error fetching books:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

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
                    onClick={() => setVisible(!visible)}
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
                <CButton color="primary" type="submit" size="sm" style={{ width: '90px' }}>
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
            <CModalTitle id="StaticBackdropExampleLabel">Add Books</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm className="row g-3">
              <CCol md={12}>
                <CFormLabel>ISBN</CFormLabel>
                <CFormInput type="text" />
              </CCol>
              <CCol md={12}>
                <CFormLabel>Book Name</CFormLabel>
                <CFormInput type="text" />
              </CCol>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton
              color="secondary"
              onClick={() => setVisible(false)}
              size="sm"
              style={{ width: '90px' }}
            >
              Close
            </CButton>
            <CButton color="primary" size="sm" style={{ width: '90px' }}>
              Save
            </CButton>
          </CModalFooter>
        </CModal>
      </CCol>
    </CRow>
  )
}

export default Books
