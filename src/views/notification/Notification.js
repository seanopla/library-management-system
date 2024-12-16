import React, { useEffect, useState } from 'react'
import { CButton, CCard, CCardBody, CCol, CRow } from '@coreui/react'
import {
  fetchNotifications,
  markAsRead,
  deleteNotification,
  handleOverdueNotifications,
  handleUpcomingReminders,
} from './NotificationViewModel'

const Notification = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  const loadNotifications = async () => {
    setLoading(true)
    const data = await fetchNotifications()
    setNotifications(data)
    setLoading(false)
  }

  const handleMarkAsRead = async (id) => {
    await markAsRead(id)
    loadNotifications()
  }

  const handleDelete = async (id) => {
    await deleteNotification(id)
    loadNotifications()
  }

  const handleProcessNotifications = async () => {
    await handleOverdueNotifications()
    await handleUpcomingReminders()

    // Reload notifikasi
    loadNotifications()
  }

  useEffect(() => {
    loadNotifications()
  }, [])

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
      {notifications.map((notification) => (
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
                  onClick={() => handleDelete(notification.id)}
                >
                  Delete
                </CButton>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      ))}
    </CRow>
  )
}

export default Notification
