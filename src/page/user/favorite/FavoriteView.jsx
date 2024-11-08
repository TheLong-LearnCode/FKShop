import React, { useEffect, useRef, useState } from 'react'
import "../../../util/GlobalStyle/GlobalStyle.css";
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '../../../service/authUser';
import { IDLE } from '../../../redux/constants/status';
import { viewFavoriteList } from '../../../service/favoriteApi';
import CardContent from '../product/card/CardContent';
import './FavoriteView.css'

export default function FavoriteView() {
  const dispatch = useDispatch()
  const [userInfo, setUserInfo] = useState(null);
  const user = useSelector((state) => state.auth);
  const userDataStatus = useSelector((state) => state.auth.data);
  const [favoriteList, setFavoriteList] = useState([])
  const prevFavoriteListLength = useRef(favoriteList.length);

  var userToken;
  var userData;
  useEffect(() => {
    console.log("user.data.token: ", user.data?.token);
    if (user.data !== null) {
      userToken = user.data?.token;

    } if (user.status === IDLE && user.data !== null) {
      userToken = user.data;
    }
    console.log("userToken in PRODUCTDETAIL: ", userToken);
    console.log("user.data in PRODUCTDETAIL: ", user.data);


    const fetchUserInfo = async () => {
      try {
        userData = await verifyToken(userToken); // Gọi hàm verifyToken để lấy dữ liệu
        console.log("userData after verify token: ", userData);

        setUserInfo(userData); // Lưu thông tin user vào state
        console.log("userData after SETUSERINFO: ", userData);
        //userData.data -> lấy ra userInfo
      } catch (error) {
        console.error("Error verifying token: ", error);
      }
    };
    fetchUserInfo(); // Gọi API lấy thông tin người dùng
  }, [user.data]); //user.data là thông tin người dùng

  useEffect(() => {
    if (userInfo?.data?.accountID) {
      const fetchFavoriteList = async () => {
        const response = await viewFavoriteList(userInfo.data.accountID);
        setFavoriteList(response);
        console.log('VIEWLIST', response);
      };
      
      if (favoriteList.length !== prevFavoriteListLength.current){
        fetchFavoriteList();
      }

      fetchFavoriteList();
    }
  }, [userInfo, favoriteList])

  console.log('FAVORITELIST', favoriteList)


  return (
    <div className='fixed-header' style={{ minHeight: '350px' }}>
      <h1 className='text-center'>Favorite List</h1>
      <div className="container-xl favorite-list-container mt-3">
        {favoriteList.length === 0 ?(
          <div className="text-center" style={{fontSize: '2rem', color: '#E4E0E1'}}>
          <i class="bi bi-emoji-dizzy-fill text-dark"></i>
          <h3 >Your favorite list is empty.</h3>
          <p>Please add product to favorite list.</p>
        </div>
        )
        :
          <div className="row mt-3">
            {favoriteList.map((wishlist) => (
              <CardContent key={wishlist.products.productID} product={wishlist.products} />
            ))}
          </div>
}
      </div>
    </div>
  )
}
