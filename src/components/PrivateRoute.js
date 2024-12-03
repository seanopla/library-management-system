import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ children }) => {
  // Ambil status autentikasi dari Redux store
  const isAuthenticated = useSelector((state) => state.isAuthenticated)

  // Jika tidak autentikasi, arahkan ke halaman login
  return isAuthenticated ? children : <Navigate to="/login" />
}

export default React.memo(PrivateRoute)
