import React, { useEffect, useState } from 'react'
import { CRow, CCol, CCard, CCardBody } from '@coreui/react'
import { Bar, Pie, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
  scales,
} from 'chart.js'
import {
  fetchTransactionStatusCounts,
  fetchTransactionsByMonth,
  fetchBookCategoryCounts,
} from './DashboardViewModel'

// **Register Chart.js components**
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
)

const WidgetsCharts = () => {
  const [transactionStatusData, setTransactionStatusData] = useState({})
  const [monthlyTransactionData, setMonthlyTransactionData] = useState([])
  const [bookCategoryData, setBookCategoryData] = useState({})

  useEffect(() => {
    const loadData = async () => {
      const statusCounts = await fetchTransactionStatusCounts()
      const transactionsByMonth = await fetchTransactionsByMonth()
      const categoryCounts = await fetchBookCategoryCounts()

      setTransactionStatusData(statusCounts)
      setMonthlyTransactionData(transactionsByMonth)
      setBookCategoryData(categoryCounts)
    }

    loadData()
  }, [])

  // Pie Chart: Transaction Status
  const pieChartData = {
    labels: ['Approved', 'Pending', 'Rejected'],
    datasets: [
      {
        data: Object.values(transactionStatusData),
        backgroundColor: ['#4CAF50', '#FFC107', '#F44336'],
      },
    ],
    options: {
      responsive: true,
      maintainAspectRatio: false,
    },
  }

  // Line Chart: Transactions by Month
  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Transactions',
        data: monthlyTransactionData,
        borderColor: '#007bff',
        backgroundColor: 'rgba(0,123,255,0.2)',
        fill: true,
      },
    ],
  }

  // Bar Chart: Book Categories
  const barChartData = {
    labels: Object.keys(bookCategoryData),
    datasets: [
      {
        label: 'Books',
        data: Object.values(bookCategoryData),
        backgroundColor: '#42A5F5',
      },
    ],
  }

  return (
    <CRow className="mt-4">
      <CCol md={6}>
        <CCard>
          <CCardBody>
            <h5 className="mb-3">Transaction Status Distribution</h5>
            <Pie data={pieChartData} />
          </CCardBody>
        </CCard>
      </CCol>
      <CCol md={6}>
        <CCard>
          <CCardBody>
            <h5 className="mb-3">Transactions Over the Year</h5>
            <Line data={lineChartData} />
          </CCardBody>
        </CCard>
        <CCard className="mt-3">
          <CCardBody>
            <h5 className="mb-3">Books by Category</h5>
            <Bar data={barChartData} />
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default WidgetsCharts
