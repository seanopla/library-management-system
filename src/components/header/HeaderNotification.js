import React, { useState, useEffect } from 'react'
import { CButton, CPopover, CListGroup, CListGroupItem, CBadge } from '@coreui/react'
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  doc,
  updateDoc,
  limit,
} from 'firebase/firestore'
import { db } from '../../config/firestore'
import CIcon from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'

const HeaderNotification = ({ userId }) => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const fetchNotifications = async () => {
    setLoading(true)
    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
        limit(5),
      )
      const querySnapshot = await getDocs(q)

      const notificationsData = []
      let unread = 0

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        console.log('Notification Data:', data)
        notificationsData.push({ id: doc.id, ...data })
        if (!data.isRead) unread++
      })

      setNotifications(notificationsData)
      setUnreadCount(unread)
    } catch (error) {
      console.error('Error fetching notifications:', error.message)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId)
      await updateDoc(notificationRef, { isRead: true })
      fetchNotifications()
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <CPopover
      content={
        <CListGroup style={{ width: '300px', maxHeight: '400px', overflowY: 'auto' }}>
          {loading ? (
            <CListGroupItem>Loading...</CListGroupItem>
          ) : notifications.length > 0 ? (
            notifications.map((notif) => (
              <CListGroupItem key={notif.id}>
                <strong>{notif.message}</strong>
                <br />
                <small>
                  {notif.createdAt
                    ? new Date(notif.createdAt.seconds * 1000).toLocaleString()
                    : 'No timestamp'}
                </small>
              </CListGroupItem>
            ))
          ) : (
            <CListGroupItem>No notifications</CListGroupItem>
          )}
        </CListGroup>
      }
      placement="bottom"
    >
      <CButton color="light">
        <CIcon icon={cilBell} size="lg" />
        {unreadCount > 0 && <CBadge color="danger">{unreadCount}</CBadge>}
      </CButton>
    </CPopover>
  )
}

export default HeaderNotification
