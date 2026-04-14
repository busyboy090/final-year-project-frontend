import { Outlet } from 'react-router-dom'

function CheckUserRole({ children, role }: { children?: React.ReactNode, role: string }) {
  console.log(role)
  return (
    <>
        { children ? children : <Outlet /> }
    </>
  )
}

export default CheckUserRole