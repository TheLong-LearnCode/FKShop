import React, { useEffect, useState } from 'react'
import Header from './Header/Header.jsx'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie'
import { loadUserFromCookie } from '../../service/authUser.jsx';
import Footer from './Footer/Footer.jsx';
import Loading from '../../component/Loading/Loading.jsx';

export default function UserLayout() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    dispatch(loadUserFromCookie(token));
    console.log("token in UserLayout", token);

    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 seconds loading time, adjust as needed

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <>
        <Header />
        <Loading />
      </>
    )
  }

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}
