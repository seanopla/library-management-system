import { exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Member = React.lazy(() => import('./views/member/Member'))
const Librarian = React.lazy(() => import('./views/librarian/Librarian'))
const Transaction = React.lazy(() => import('./views/transaction/Transaction'))
const Books = React.lazy(() => import('./views/books/Books'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/member', name: 'Member', element: Member, exact: true },
  { path: '/librarian', name: 'Librarian', element: Librarian, exact: true },
  { path: '/books', name: 'Books', element: Books, exact: true },
  { path: '/transaction', name: 'Transaction', element: Transaction, exact: true },
]

export default routes
