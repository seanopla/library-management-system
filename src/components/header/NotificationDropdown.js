import React, { useEffect, useState } from 'react'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from '@coreui/react'
import {
  fetchNotifications,
  fetchUserNotifications,
} from '../../views/notification/NotificationViewModel'
import CIcon from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { doc } from 'firebase/firestore'
import { db } from '../../config/firestore'

const NotificationDropdown = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const navigate = useNavigate()
  const role = useSelector((state) => state.user?.role)
  const userId = useSelector((state) => state.user?.uid)

  useEffect(() => {
    const loadUnreadNotifications = async () => {
      let notifications = []

      if (role === 'admin') {
        // Admin notifications
        notifications = await fetchNotifications()
      } else if (role === 'user' && userId) {
        // User notifications: Convert userId to DocumentReference
        const userRef = doc(db, 'users', userId)
        notifications = await fetchUserNotifications(userRef)
      }

      setUnreadNotifications(notifications.filter((notif) => !notif.isRead))
    }

    loadUnreadNotifications()
  }, [role, userId])

  return (
    <CDropdown variant="nav-item" placement="top">
      <CDropdownToggle caret={false}>
        <CIcon icon={cilBell} size="lg" />
        {unreadNotifications.length > 0 && (
          <CBadge
            color="danger"
            shape="rounded-pill"
            position="top-end"
            style={{ translate: '-35% 35%' }}
          >
            {unreadNotifications.length}
          </CBadge>
        )}
      </CDropdownToggle>
      <CDropdownMenu>
        {unreadNotifications.map((notif) => (
          <CDropdownItem key={notif.id}>
            {notif.message}
            <br />
            <small className="text-muted">
              {notif.createdAt?.toDate().toLocaleDateString('en-US')}
            </small>
          </CDropdownItem>
        ))}
        {unreadNotifications.length === 0 && <CDropdownItem>No new notifications</CDropdownItem>}
        <CDropdownItem
          className="text-center"
          onClick={() => navigate('/notification')}
          style={{ cursor: 'pointer' }}
        >
          View All
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default NotificationDropdown
