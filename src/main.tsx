import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import './index.css'
import LandingPage from './Pages/LandingPage.tsx'
import HomePage from './Pages/HomePage.tsx'
import NotFoundPage from './Pages/NotFoundPage.tsx'
import LoginPage from './Pages/LoginPage.tsx'
import SignInPage from './Pages/SignInPage.tsx'
import ProfilePage from './Pages/ProfilePage.tsx'
import PostDetailPage from './Pages/PostDetailPage.tsx'

const router = createBrowserRouter([
  {
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
  },
  {
    path: '/profile',
    element: <ProfilePage/>
  },
  {
    path: '/post/:id',  // ✅ UBAH DARI /posts ke /post/:id
    element: <PostDetailPage/>
  },
]); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)