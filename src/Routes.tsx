import type { ReactElement } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'

// pages
import Home from './pages/Home'
import Settings from './pages/Settings'

export const ROUTES = {
  HOME: '/',
}

const BaseRouter = (): ReactElement => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/settings" element={<Settings />} />
      {/* <Route path="*" component={Page404} /> */}
    </Routes>
  </BrowserRouter>
)

export default BaseRouter
