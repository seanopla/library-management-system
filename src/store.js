import { legacy_createStore as createStore } from 'redux'

const initialState = {
  sidebarShow: true,
  theme: 'light',
  isAuthenticated: JSON.parse(localStorage.getItem('isAuthenticated')) || false,
  user: JSON.parse(localStorage.getItem('user')) || null, // Informasi pengguna
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case 'set':
      return { ...state, ...action }
    case 'login':
      localStorage.setItem('isAuthenticated', true)
      localStorage.setItem('user', JSON.stringify(action.payload)) // Simpan data pengguna
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload,
      }
    case 'logout':
      localStorage.removeItem('isAuthenticated')
      localStorage.removeItem('user') // Hapus data pengguna
      return {
        isAuthenticated: false,
        user: null,
      }
    default:
      return state
  }
}

const store = createStore(reducer)
export default store
