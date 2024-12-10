import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilHome, cilLockLocked, cilLockUnlocked, cilPhone, cilUser } from '@coreui/icons'
import Swal from 'sweetalert2'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from './../../../config/firestore'
import { Link } from 'react-router-dom'

const defaultFormRegister = {
  name: '',
  phone: '',
  address: '',
  email: '',
  password: '',
  confirmPassword: '',
}

const Register = () => {
  const [formData, setFormData] = useState(defaultFormRegister)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    if (formData.password !== formData.confirmPassword) {
      Swal.fire({
        icon: 'error',
        title: 'Password mismatch',
        text: 'Password and Confirm Password must match!',
      })
      setLoading(false)
      return
    }

    try {
      // Buat pengguna di Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password,
      )
      const user = userCredential.user

      // Simpan data pengguna ke Firestore
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        email: formData.email,
        role: 'user', // Set default role
        createdAt: serverTimestamp(), // Set timestamp
        borrowCount: 0,
      })

      Swal.fire({
        icon: 'success',
        title: 'Account Created',
        text: 'Your account has been successfully created!',
      })

      // Reset form
      setFormData(defaultFormRegister)
    } catch (error) {
      console.error('Error creating account:', error)
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Fullname"
                      autoComplete="name"
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilPhone} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Phone"
                      autoComplete="phone"
                      type="number"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilHome} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Address"
                      autoComplete="address"
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Password"
                      autoComplete="new-password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <CButton
                      type="button"
                      color="transparent"
                      onClick={togglePasswordVisibility}
                      className="border"
                    >
                      <CIcon icon={showPassword ? cilLockLocked : cilLockUnlocked} />
                    </CButton>
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <CButton
                      type="button"
                      color="transparent"
                      onClick={toggleConfirmPasswordVisibility}
                      className="border"
                    >
                      <CIcon icon={showConfirmPassword ? cilLockLocked : cilLockUnlocked} />
                    </CButton>
                  </CInputGroup>
                  <div className="d-grid">
                    <CButton
                      className="text-white"
                      color="success"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? (
                        <span>
                          <span
                            className="spinner-border spinner-border-sm me-2"
                            role="status"
                            aria-hidden="true"
                          ></span>
                          Creating Account...
                        </span>
                      ) : (
                        'Create Account'
                      )}
                    </CButton>
                    <div className="mt-2 text-center">
                      Already have an account? <Link to="/login">Login</Link>
                    </div>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
