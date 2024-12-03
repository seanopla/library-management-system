import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilBook, cilUser, cilPlus } from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _navAdmin = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Members',
    to: '/member',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Books',
    to: '/books',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Add Book',
    to: '/books/add',
    icon: <CIcon icon={cilPlus} customClassName="nav-icon" />,
  },
]

export default _navAdmin
