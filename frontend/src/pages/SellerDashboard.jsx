import React from 'react'
import Topbar from '../components/dashboard/Topbar'
import Sidebar from '../components/dashboard/SidebarComponent'

export default function SellerDashboard() {
  return (
    <div className="flex h-screen">
      <div className="w-64">
        <Sidebar />
      </div>
      <div className="flex-1">
        <Topbar />
      </div>
    </div>
  )
}
