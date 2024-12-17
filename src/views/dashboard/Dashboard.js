import React, { useEffect } from 'react'
import classNames from 'classnames'

import {
  CAvatar,
  CButton,
  CButtonGroup,
  CCard,
  CCardBody,
  CCardFooter,
  CCardHeader,
  CCol,
  CProgress,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import {
  cibCcAmex,
  cibCcApplePay,
  cibCcMastercard,
  cibCcPaypal,
  cibCcStripe,
  cibCcVisa,
  cibGoogle,
  cibFacebook,
  cibLinkedin,
  cifBr,
  cifEs,
  cifFr,
  cifIn,
  cifPl,
  cifUs,
  cibTwitter,
  cilCloudDownload,
  cilPeople,
  cilUser,
  cilUserFemale,
} from '@coreui/icons'

import Widget from '../../components/Widget'
import { useSelector } from 'react-redux'
import {
  handleOverdueNotifications,
  handleUpcomingReminders,
  handleUserReminders,
  handleUserStatusNotifications,
} from '../notification/NotificationViewModel'
import WidgetsCharts from './WidgetChart'

const Dashboard = () => {
  const role = useSelector((state) => state.user?.role)
  const userId = useSelector((state) => state.user?.uid)

  const processNotifications = async () => {
    if (role === 'admin') {
      await handleOverdueNotifications()
      await handleUpcomingReminders()
    } else if (role === 'user' && userId) {
      await handleUserReminders(userId)
      await handleUserStatusNotifications(userId)
    }
  }

  useEffect(() => {
    if (role) {
      processNotifications()
    }
  }, [role, userId])

  return (
    <>
      <CCard>
        <CCardBody>
          <Widget className="mb-4" />
          <WidgetsCharts />
        </CCardBody>
      </CCard>
    </>
  )
}

export default Dashboard
