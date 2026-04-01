import { Outlet } from 'react-router-dom'

function DashboardLayout() {
  return (
    <div className='flex flex-col min-h-screen'>
        <Outlet />
    </div>
  )
}

export default DashboardLayout