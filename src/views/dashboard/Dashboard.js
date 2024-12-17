import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CContainer,
  CListGroup,
  CListGroupItem,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import WidgetsCharts from './WidgetChart'
import WidgetsDropdown from './../../components/Widget'

const libraryInfo = {
  schedule: [
    { day: 'Monday - Friday', time: '08:00 AM - 08:00 PM' },
    { day: 'Saturday', time: '09:00 AM - 06:00 PM' },
    { day: 'Sunday', time: 'Closed' },
  ],
  rules: [
    'Users must bring their library membership card.',
    'No food or drinks are allowed inside the library.',
    'Borrowed books must be returned on time.',
    'Please maintain silence in the library area.',
  ],
  contact: {
    address: '123 Library Street, Booktown',
    phone: '(021) 123-4567',
    email: 'info@library.com',
    instagram: '@library_hub',
    facebook: 'Library Hub',
  },
}

const Dashboard = () => {
  const role = useSelector((state) => state.user?.role)

  return (
    <>
      {role === 'admin' ? (
        <CCard>
          <CCardBody>
            <WidgetsDropdown className="mb-4" />
            <WidgetsCharts />
          </CCardBody>
        </CCard>
      ) : (
        <CContainer fluid>
          <CCard className="shadow-sm rounded mb-4">
            <CCardHeader className="bg-primary text-white text-center">
              <h3 className="pt-1">Library Management System</h3>
            </CCardHeader>
            <CCardBody>
              <p className="text-muted">
                Welcome to the <b>Library Management System</b>. Access library services
                efficiently, check operational hours, understand the rules, and get the latest
                updates on books and events.
              </p>
              <hr />
              <CRow>
                <CCol md="6">
                  <h5 className="text-primary">Library Schedule</h5>
                  <CTable striped hover>
                    <CTableHead>
                      <CTableRow>
                        <CTableHeaderCell>Day</CTableHeaderCell>
                        <CTableHeaderCell>Operating Hours</CTableHeaderCell>
                      </CTableRow>
                    </CTableHead>
                    <CTableBody>
                      {libraryInfo.schedule.map((item, idx) => (
                        <CTableRow key={idx}>
                          <CTableDataCell>{item.day}</CTableDataCell>
                          <CTableDataCell>{item.time}</CTableDataCell>
                        </CTableRow>
                      ))}
                    </CTableBody>
                  </CTable>
                </CCol>
                <CCol md="6">
                  <h5 className="text-primary">Library Rules</h5>
                  <CListGroup flush>
                    {libraryInfo.rules.map((rule, idx) => (
                      <CListGroupItem key={idx} className="bg-light">
                        {rule}
                      </CListGroupItem>
                    ))}
                  </CListGroup>
                </CCol>
              </CRow>
              <hr />
              <CRow>
                <CCol md="6" className="mb-4">
                  <h5 className="text-primary">Contact Us</h5>
                  <CListGroup>
                    <CListGroupItem>
                      <b>Address:</b> {libraryInfo.contact.address}
                    </CListGroupItem>
                    <CListGroupItem>
                      <b>Phone:</b> {libraryInfo.contact.phone}
                    </CListGroupItem>
                    <CListGroupItem>
                      <b>Email:</b> {libraryInfo.contact.email}
                    </CListGroupItem>
                    <CListGroupItem>
                      <b>Instagram:</b> {libraryInfo.contact.instagram}
                    </CListGroupItem>
                    <CListGroupItem>
                      <b>Facebook:</b> {libraryInfo.contact.facebook}
                    </CListGroupItem>
                  </CListGroup>
                </CCol>
                <CCol md="6">
                  <h5 className="text-primary">Our Location</h5>
                  <iframe
                    title="Library Location"
                    src="https://maps.google.com/maps?q=Jl.+Perpustakaan+No.+123,+Kota+Buku&output=embed"
                    width="100%"
                    height="250px"
                    style={{ border: '0', borderRadius: '8px' }}
                    allowFullScreen
                  ></iframe>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CContainer>
      )}
    </>
  )
}

export default Dashboard
