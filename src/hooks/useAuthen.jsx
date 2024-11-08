import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../service/authUser";

const useAuthen = () => {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const user = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUserInfo = async () => {
      if (!user) {
        setLoading(false); // No token, end loading state
        return;
      }

      try {
        const response = await verifyToken(user);
        if (response.data) {
          setUserInfo(response.data);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
      } finally {
        setLoading(false); // End loading regardless of fetch result
      }
    };
    
    fetchUserInfo();
  }, [user, dispatch]);

  const userRole = userInfo?.role;
  return { userInfo, userRole, loading };
};

export default useAuthen;
