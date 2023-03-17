import { useAppSelector } from '@/store/hooks';
import { userSelector } from '@/store/user/userSlice';
import { message } from 'antd';
import React, { useEffect } from 'react';
import { useLocation, useNavigate, matchRoutes } from 'react-router-dom';

const AuthRoute = ({ children, auth }: {children: React.ReactNode, auth: boolean }) => {

  const navigate = useNavigate();
  const token = useAppSelector(userSelector).token;
  const location = useLocation();

  // const mathchs = matchRoutes(routers, location);

  // const isExist = mathchs?.some((item) => item.pathname == location.pathname);

  useEffect(() => {
    if (!token && auth) {
      message.error('你还没有登录，请登录!');
      navigate('/signin')
    }

    if (token) {
      if (location.pathname === '/signin' || location.pathname === '/signup') {
        navigate('/')
      } else {
        navigate(location.pathname)
      }
    }
  }, [token])

  return children;
}

export default AuthRoute;