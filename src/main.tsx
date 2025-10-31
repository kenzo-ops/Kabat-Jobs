import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import LandingPage from './Pages/LandingPage.tsx'
import HomePage from './Pages/HomePage.tsx'
import NotFoundPage from './Pages/NotFoundPage.tsx'
import LoginPage from './Pages/LoginPage.tsx'
import SignInPage from './Pages/SignInPage.tsx'

const router = createBrowserRouter([{
  path: '/',
  element: <LandingPage/>,
  errorElement: <NotFoundPage/>
},
{
  path: '/home',
  element: <HomePage/>
},
{
  path: '/login',
  element: <LoginPage/>
},
{
  path: '/signin',
  element: <SignInPage/>
}]); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
