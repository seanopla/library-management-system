import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilLockUnlocked, cilUser } from '@coreui/icons'
import Swal from 'sweetalert2'
import { auth, db } from './../../../config/firestore'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { useDispatch } from 'react-redux'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (userDoc.exists()) {
        const { role, name } = userDoc.data()
        dispatch({ type: 'login', payload: { uid: user.uid, email: user.email, role, name } })

        Swal.fire({
          icon: 'success',
          title: 'Login berhasil!',
          showConfirmButton: false,
          timer: 1500,
        })

        navigate('/dashboard')
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Data pengguna tidak ditemukan!',
          text: 'Silakan hubungi admin sistem.',
        })
      }
    } catch (error) {
      console.error('Error logging in:', error)
      Swal.fire({
        icon: 'error',
        title: 'Login gagal!',
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
          <CCol lg={8} md={10}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={handleLogin}>
                    <h1>Login</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="email"
                        placeholder="Email"
                        autoComplete="username"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" type="submit" disabled={loading}>
                          {loading ? 'Logging in...' : 'Login'}
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ flex: 1 }}>
                <CCardBody className="text-center d-flex flex-column justify-content-center">
                  <div>
                    <h2>Library Management System</h2>
                    <p className="mt-3">
                      "Join now and enjoy easy access to our extensive library collection. With your
                      account, manage book borrowing, view history, and enjoy a seamless reading
                      experience!"
                    </p>
                    <Link to="/register">
                      <CButton color="light" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
