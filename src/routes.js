import { exact } from 'prop-types'
import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Transaction = React.lazy(() => import('./views/transaction/Transaction'))
const Users = React.lazy(() => import('./views/users/Users'))
const Books = React.lazy(() => import('./views/books/Books'))
const Report = React.lazy(() => import('./views/report/Report'))
const BorrowBook = React.lazy(() => import('./views/borrow-book/BorrowBook'))
const Profile = React.lazy(() => import('./views/profile/Profile'))
const Notification = React.lazy(() => import('./views/notification/Notification'))
const BorrowHistory = React.lazy(() => import('./views/borrow-history/BorrowHistory'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  { path: '/users', name: 'Users', element: Users, exact: true },
  { path: '/books', name: 'Books', element: Books, exact: true },
  { path: '/transaction', name: 'Transaction', element: Transaction, exact: true },
  { path: '/report', name: 'Report', element: Report, exact: true },
  { path: '/borrow-book', name: 'Borrow Book', element: BorrowBook, exact: true },
  { path: '/profile', name: 'Profile', element: Profile, exact: true },
  { path: '/notification', name: 'Notification', element: Notification, exact: true },
  { path: '/borrow-history', name: 'Borrow History', element: BorrowHistory, exact: true },
]

export default routes
