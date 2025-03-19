import React from 'react'
import Layout from './Layout'
import { Outlet } from 'react-router'

const Root = () => {
  return (
    <Layout>
      <Outlet />
    </Layout>
  )
}

export default Root