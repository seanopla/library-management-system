import React from 'react'
import { CSVLink } from 'react-csv'

const ExportToCSV = ({ data, headers, filename }) => {
  return (
    <CSVLink
      data={data}
      headers={headers}
      filename={`${filename}.csv`}
      className="btn btn-primary btn-sm"
      target="_blank"
    >
      Export CSV
    </CSVLink>
  )
}

export default ExportToCSV
