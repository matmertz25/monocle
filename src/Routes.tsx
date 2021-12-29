import type { ReactElement } from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import Error404 from './pages/404'

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
      <Route path="*" element={<Error404 />} />
    </Routes>
  </BrowserRouter>
)

export default BaseRouter
