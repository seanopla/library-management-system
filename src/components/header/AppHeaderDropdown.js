import React, { useEffect, useState } from 'react'
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [userName, setUserName] = useState('')
  const user = useSelector((state) => state.user) // Redux state

  const handleLogout = () => {
    dispatch({ type: 'logout' })
    navigate('/login')
  }

  useEffect(() => {
    if (user?.name) {
      setUserName(user.name)
    } else {
      const storedUser = JSON.parse(localStorage.getItem('user'))
      if (storedUser && storedUser.name) {
        setUserName(storedUser.name)
      }
    }
  }, [user])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0 pe-0" caret={false}>
        <span className="d-flex" style={{ fontSize: '16px', paddingTop: '7px' }}>
          {userName || 'Guest'}
        </span>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">Account</CDropdownHeader>
        <CDropdownItem onClick={() => navigate('/profile')}>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#" onClick={handleLogout}>
          <CIcon icon={cilSettings} className="me-2" />
          Logout
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
