import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

function PrivateRoute() {
  const isAuthenticated = localStorage.getItem('Token')
  return (isAuthenticated ? <Outlet/> : <Navigate to='/login' />)
}

export default PrivateRoute