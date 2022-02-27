import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App'
import AddUser from './components/AddUser'
import Users from './components/Users'

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path='/' element={<App />} />
        <Route path='/add' element={<AddUser />} />
        <Route path='/users' element={<Users />} />
      </Routes>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
)
