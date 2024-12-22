// Fungsi umum untuk memformat tanggal
const formatDate = (timestamp) => {
  return timestamp?.toDate ? timestamp.toDate().toLocaleString() : '-'
}

// Format data buku
export const formatBooksData = (data) => {
  return data.map((item) => ({
    Id: item.id || '-',
    Category: item.category || '-',
    Title: item.title || '-',
    Isbn: item.isbn || '-',
    BorrowCount: item.borrowCount || 0,
    Year: item.year || '-',
    Stock: item.stock || 0,
    Author: item.author || '-',
    CreatedAt: formatDate(item.createdAt),
    Publisher: item.publisher || '-',
  }))
}

// Format data pengguna
export const formatUsersData = (data) => {
  return data.map((item) => ({
    Id: item.id || '-',
    Name: item.name || '-',
    Email: item.email || '-',
    Role: item.role || '-',
    Phone: item.phone || '-',
    Address: item.address || '-',
    BorrowCount: item.borrowCount || 0,
    CreatedAt: formatDate(item.createdAt),
  }))
}

// Format data transaksi
export const formatTransactionsData = (data) => {
  return data.map((item) => ({
    Id: item.id || '-',
    UserId: item.user?.id || '-',
    BookId: item.book?.id || '-',
    Status: item.status || '-',
    BorrowDate: formatDate(item.borrowDate),
    DueDate: formatDate(item.dueDate),
    ReturnDate: formatDate(item.returnDate),
    IsNotified: item.isNotified ? 'Yes' : 'No',
    CreatedAt: formatDate(item.createdAt),
  }))
}
