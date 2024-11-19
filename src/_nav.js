import React from 'react'
import CIcon from '@coreui/icons-react'
import { cilSpeedometer, cilPencil, cilBook, cilUser, cilLibraryBuilding } from '@coreui/icons'
import { CNavGroup, CNavItem } from '@coreui/react'

const _nav = [
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
    name: 'Librarian',
    to: '/librarian',
    icon: <CIcon icon={cilLibraryBuilding} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Books',
    to: '/books',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Transaction',
    to: '/transaction',
    icon: <CIcon icon={cilPencil} customClassName="nav-icon" />,
  },
]

export default _nav
