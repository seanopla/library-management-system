import React, { useState } from 'react'
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

const columns = [
  {
    name: 'Title',
    selector: (row) => row.title,
    sortable: true,
  },
  {
    name: 'Year',
    selector: (row) => row.year,
    sortable: true,
  },
]

const data = [
  {
    id: 1,
    title: 'Beetlejuice',
    year: '1988',
  },
  {
    id: 2,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 3,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 4,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 5,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 6,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 7,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 8,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 9,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 10,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 11,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 12,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 13,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 14,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 15,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 16,
    title: 'Ghostbusters',
    year: '1984',
  },
  {
    id: 17,
    title: 'Ghostbusters',
    year: '1984',
  },
]

const Books = () => {
  const [visible, setVisible] = useState(false)

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3">
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
              data={data}
              pagination
              fixedHeader
              fixedHeaderScrollHeight="500px"
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
              <CCol md={6}>
                <CFormLabel htmlFor="inputEmail4">ISBN</CFormLabel>
                <CFormInput type="text" />
              </CCol>
              <CCol md={6}>
                <CFormLabel htmlFor="inputPassword4">Book Name</CFormLabel>
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
