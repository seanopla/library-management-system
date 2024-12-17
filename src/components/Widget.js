import React, { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { CRow, CCol, CWidgetStatsA } from '@coreui/react'
import { getStyle } from '@coreui/utils'
import {
  fetchPendingBooks,
  fetchTotalBooks,
  fetchTotalTransactions,
  fetchTotalUsers,
} from '../views/dashboard/DashboardViewModel'

const WidgetsDropdown = (props) => {
  const [totalBooks, setTotalBooks] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)
  const [totalTransactions, setTotalTransactions] = useState(0)
  const [pendingBooks, setPendingBooks] = useState(0)

  const widgetChartRef1 = useRef(null)
  const widgetChartRef2 = useRef(null)

  useEffect(() => {
    // Fetch dashboard data
    const loadDashboardData = async () => {
      const books = await fetchTotalBooks()
      const users = await fetchTotalUsers()
      const transactions = await fetchTotalTransactions()
      const pending = await fetchPendingBooks()

      setTotalBooks(books)
      setTotalUsers(users)
      setTotalTransactions(transactions)
      setPendingBooks(pending)
    }

    loadDashboardData()

    document.documentElement.addEventListener('ColorSchemeChange', () => {
      if (widgetChartRef1.current) {
        setTimeout(() => {
          widgetChartRef1.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-primary')
          widgetChartRef1.current.update()
        })
      }

      if (widgetChartRef2.current) {
        setTimeout(() => {
          widgetChartRef2.current.data.datasets[0].pointBackgroundColor = getStyle('--cui-info')
          widgetChartRef2.current.update()
        })
      }
    })
  }, [widgetChartRef1, widgetChartRef2])

  return (
    <CRow className={props.className} xs={{ gutter: 4 }}>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="primary"
          value={<>{totalBooks}</>}
          title="Total Books"
          style={{ height: '150px' }}
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="info"
          value={<>{totalUsers}</>}
          style={{ height: '150px' }}
          title="Total Users"
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="warning"
          value={<>{totalTransactions}</>}
          style={{ height: '150px' }}
          title="Total Transactions"
        />
      </CCol>
      <CCol sm={6} xl={4} xxl={3}>
        <CWidgetStatsA
          color="danger"
          value={<>{pendingBooks}</>}
          style={{ height: '150px' }}
          title="Book Pending"
        />
      </CCol>
    </CRow>
  )
}

WidgetsDropdown.propTypes = {
  className: PropTypes.string,
  withCharts: PropTypes.bool,
}

export default WidgetsDropdown
