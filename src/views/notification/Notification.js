import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import {
  fetchNotifications,
  fetchUserNotifications,
  markAsRead,
  deleteNotification,
  handleOverdueNotifications,
  handleUpcomingReminders,
  handleUserReminders,
  handleUserStatusNotifications,
} from './NotificationViewModel'
import { useSelector } from 'react-redux'
import { doc } from 'firebase/firestore'
import { db } from '../../config/firestore'

const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const role = useSelector((state) => state.user?.role)
  const userId = useSelector((state) => state.user?.uid)

  // Load notifications based on role
  const loadNotifications = async () => {
    setLoading(true)
    let data = []

    if (role === 'admin') {
      data = await fetchNotifications()
    } else if (role === 'user' && userId) {
      const userRef = doc(db, 'users', userId)
      data = await fetchUserNotifications(userRef)
    }

    setNotifications(data)
    setLoading(false)
  }

  const handleMarkAsRead = async (id) => {
    await markAsRead(id)
    loadNotifications()
  }

  const handleDelete = async (id, transactionId) => {
    await deleteNotification(id, transactionId)
    loadNotifications()
  }

  const handleProcessNotifications = async () => {
    if (role === 'admin') {
      // Admin-specific notifications
      await handleOverdueNotifications()
      await handleUpcomingReminders()
    } else if (role === 'user' && userId) {
      // User-specific notifications
      await handleUserReminders()
      await handleUserStatusNotifications()
    }
    // Reload notifications after processing
    loadNotifications()
  }

  useEffect(() => {
    loadNotifications()
  }, [role, userId])

  if (loading) return <p>Loading notifications...</p>

  return (
    <CRow className="gy-3">
      <CButton
        size="sm"
        color="primary"
        style={{ width: '180px', marginLeft: '13px' }}
        onClick={handleProcessNotifications}
      >
        Process Notifications
      </CButton>

      {notifications.length === 0 ? (
        <p className="text-center">No notifications available.</p>
      ) : (
        notifications.map((notification) => (
          <CCol xs={12} key={notification.id}>
            <CCard className="mb-2">
              <CCardBody className="d-flex flex-column flex-md-row justify-content-between align-items-md-center">
                <div>
                  <p className="mb-1 fw-bold">{notification.message}</p>
                  <small className="text-muted">
                    {notification.createdAt?.toDate().toLocaleDateString('en-US')}
                  </small>
                </div>
                <div className="d-flex gap-2 mt-3 mt-md-0">
                  {!notification.isRead && (
                    <CButton
                      size="sm"
                      color="primary"
                      style={{ width: '100px' }}
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      Mark as read
                    </CButton>
                  )}
                  <CButton
                    size="sm"
                    color="danger"
                    className="text-white"
                    style={{ width: '100px' }}
                    onClick={() => handleDelete(notification.id, notification.transactionId)}
                  >
                    Delete
                  </CButton>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))
      )}
    </CRow>
  )
}

export default Notification
