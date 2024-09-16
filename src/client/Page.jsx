import React from 'react'
import IsLogin from './IsLogin'
import Sidenav from './Sidenav'
function Page({pageName, children}) {
  return (
    <>
      <IsLogin />
      <div>
        <Sidenav pageName={pageName} children={children}/>
      </div>
    </>
  )
}

export default Page