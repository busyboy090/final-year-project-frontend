import { Outlet } from 'react-router-dom';

function Protected({ children }: { children?: React.ReactNode }) {
  return (
    <>
        { children ? children : <Outlet /> }
    </>
  )
}

export default Protected