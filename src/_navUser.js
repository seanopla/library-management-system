import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilBook, cilUser } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _navUser = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Books',
    to: '/books',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Borrow Book',
    to: '/borrow-book',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
]

export default _navUser
