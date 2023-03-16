import { createBrowserRouter } from "react-router-dom";

import SignUpPage from "@/pages/signup/SignUp";
import SignInPage  from "@/pages/signin/SignIn";
import HomePage from '@/pages/home/Home'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />
  },
  {
    path: '/signin',
    element: <SignInPage />
  },
  {
    path: '/signup',
    element: <SignUpPage />
  }
])