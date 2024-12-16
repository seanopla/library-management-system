import React, { useEffect, useState } from 'react'
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem, CBadge } from '@coreui/react'
import { fetchNotifications } from '../../views/notification/NotificationViewModel'
import CIcon from '@coreui/icons-react'
import { cilBell } from '@coreui/icons'
import { useNavigate } from 'react-router-dom'

const NotificationDropdown = () => {
  const [unreadNotifications, setUnreadNotifications] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const loadUnreadNotifications = async () => {
      const notifications = await fetchNotifications()
      setUnreadNotifications(notifications.filter((notif) => !notif.isRead))
    }

    loadUnreadNotifications()
  }, [])

  return (
    <CDropdown variant="nav-item" placement="top">
      <CDropdownToggle caret={false}>
        <CIcon icon={cilBell} size="lg" />
        <CBadge
          color="danger"
          shape="rounded-pill"
          position="top-end"
          style={{ translate: '-35% 35%' }}
        >
          {unreadNotifications.length}
        </CBadge>
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
