import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import LandingPage from './Pages/LandingPage.tsx'
import HomePage from './Pages/HomePage.tsx'
import NotFoundPage from './Pages/NotFoundPage.tsx'
import LoginPage from './Pages/LoginPage.tsx'
import SignInPage from './Pages/SignInPage.tsx'
import ProfilePage from './Pages/ProfilePage.tsx'
import PostDetailPage from './Pages/PostDetailPage.tsx'
import AuthCallbackPage from './Pages/AuthCallback.tsx'
import SavedPostsPage from './Pages/SavedPostsPage.tsx'
import FriendsPage from './Pages/FriendsPage.tsx'
import UserProfilePage from './Pages/UserProfilePage.tsx'
import InboxPage from './Pages/InboxPage.tsx'

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
    path: '/user/:userId',
    element: <UserProfilePage/>
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
  {
    path: '/saved-jobs',
    element: <SavedPostsPage/>
  },
  {
    path: '/friends',
    element: <FriendsPage/>
  },
  {
    path: '/inbox',
    element: <InboxPage/>
  },
  {
    path: '/auth/callback',
    element: <AuthCallbackPage />,
  },
]); 

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  </StrictMode>,
)