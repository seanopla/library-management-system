import React, { useState, useEffect } from 'react'
import { CButton, CCard, CCardBody, CCol, CForm, CFormInput, CFormLabel, CRow } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilCheckAlt } from '@coreui/icons'
import { getDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../config/firestore'
import { useSelector } from 'react-redux'
import Swal from 'sweetalert2'

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    borrowCount: 0,
    role: '',
  })
  const [loading, setLoading] = useState(true)
  const userId = useSelector((state) => state.user?.uid)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userRef = doc(db, 'users', userId)
        const userSnap = await getDoc(userRef)
        if (userSnap.exists()) {
          setUserData(userSnap.data())
        }
        setLoading(false)
      } catch (error) {
        console.error('Error fetching user data:', error)
        Swal.fire('Error', 'Failed to fetch user data.', 'error')
      }
    }

    if (userId) fetchUserData()
  }, [userId])

  const handleSave = async () => {
    try {
      const userRef = doc(db, 'users', userId)
      await updateDoc(userRef, {
        name: userData.name,
        phone: userData.phone,
        address: userData.address,
      })
      Swal.fire('Success', 'Profile updated successfully!', 'success')
    } catch (error) {
      console.error('Error updating profile:', error)
      Swal.fire('Error', 'Failed to update profile. Try again.', 'error')
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardBody>
            <CForm className="row g-3">
              <CCol md={6}>
                <CFormLabel>Name</CFormLabel>
                <CFormInput type="text" name="name" value={userData.name} onChange={handleChange} />
                <CFormLabel className="mt-3">Phone</CFormLabel>
                <CFormInput
                  type="number"
                  name="phone"
                  value={userData.phone}
                  onChange={handleChange}
                />
                <CFormLabel className="mt-3">Role</CFormLabel>
                <CFormInput type="text" value={userData.role} disabled />
              </CCol>
              <CCol md={6}>
                <CFormLabel>Email</CFormLabel>
                <CFormInput type="text" value={userData.email} disabled />
                <CFormLabel className="mt-3">Address</CFormLabel>
                <CFormInput
                  type="text"
                  name="address"
                  value={userData.address}
                  onChange={handleChange}
                />
                <CFormLabel className="mt-3">Borrow Count</CFormLabel>
                <CFormInput type="text" value={userData.borrowCount} disabled />
              </CCol>
              <CCol xs={12} className="text-center mt-4">
                <CButton color="primary" style={{ width: '100px' }} size="sm" onClick={handleSave}>
                  <CIcon icon={cilCheckAlt} className="me-2" />
                  Save
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default Profile
