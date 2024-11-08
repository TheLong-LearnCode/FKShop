import { Navigate, useNavigate } from "react-router-dom";
import useAuthen from "../hooks/useAuthen";
import Loading from "../component/Loading/Loading";
import { message } from "antd";

const ProtectedRoutes = ({ allowedRoles, children }) => {
  const navigate = useNavigate();
  const { userInfo, userRole, loading } = useAuthen(); 
  if (loading) {
    return (
      <Loading />
    );
  }

  if (!userRole) {
    message.warning("Please login to continue!!");
    return <Navigate to="/login" />; // Nếu không có role, chuyển hướng đến trang đăng nhập
  }

  return allowedRoles.includes(userRole) ? (
    children
  ) : (
    <Navigate to="/unauthorized" state={{ userInfo }} />
  );
};
export default ProtectedRoutes;
