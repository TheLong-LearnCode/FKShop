import React, { useState, useEffect } from 'react'
import 'boxicons'
import './CardContent.css'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { message } from 'antd';
import { viewFavoriteList, addToFavoriteList, removeFavoriteProduct } from '../../../../service/favoriteApi';
import AddToCartPopup from '../../../../components/AddToCartPopup';
import { addProductToCart } from '../../../../redux/slices/cartSlice';
import { IDLE } from '../../../../redux/constants/status';
import { verifyToken } from '../../../../service/authUser';

export default function CardContent({ product }) {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.data) || {};
    const [userInfo, setUserInfo] = useState(null);
    const userDataStatus = useSelector((state) => state.auth.data);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [wishlistID, setWishlistID] = useState(null);
    const [showPopup, setShowPopup] = useState(false);

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
            checkWishlistStatus();
        }
    }, [userInfo, product.productID]);

    const checkWishlistStatus = async () => {
        try {
            const favoriteList = await viewFavoriteList(userInfo?.data?.accountID);
            const favoriteItem = favoriteList.find(item => item.wishlist.productID === product.productID);
            if (favoriteItem) {
                setIsInWishlist(true);
                setWishlistID(favoriteItem.wishlist.wishlistID);
            } else {
                setIsInWishlist(false);
                setWishlistID(null);
            }
        } catch (error) {
            console.error("Error checking wishlist status:", error);
        }
    };

    const handleWishlistToggle = async () => {
        if (!userInfo?.data?.accountID) {
            message.error("Please login to add " + product.name + " to favorite list");
            return;
        }

        try {
            if (isInWishlist && userInfo?.data?.accountID) {
                await removeFavoriteProduct(wishlistID);
                setIsInWishlist(false);
                setWishlistID(null);
                message.success("Delete " + product.name + " from favorite list successfully");
            } else {
                const response = await addToFavoriteList(userInfo?.data?.accountID, product.productID);
                setIsInWishlist(true);
                setWishlistID(response?.data.wishlist.wishlistID);
                message.success("Add " + product.name + " from favorite list successfully");
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            message.error("An error occurred. Please try again later.");
        }
    };

    const handleAddToCart = (quantity) => {
        if (userInfo?.data?.accountID && product.productID) {
            dispatch(addProductToCart({
                accountID: userInfo?.data?.accountID,
                productID: product.productID,
                quantity: quantity
            }));
        } else {
            message.error("Please login to add " + product.name + " to cart");
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <div className="col-lg-3 col-md-4 product-card" key={product.productID}>
            <div className="card">
                <img className="card-img-top" src={product.images[0].url} alt={product.name} />
                <button
                    className={`like-btn btn ${isInWishlist ? 'liked' : ''}`}
                    onClick={handleWishlistToggle}
                >
                    <i className="bi bi-bag-heart-fill"></i>
                </button>
                <div className="card-body">
                    <h5 className="card-title">{product.name}</h5>
                    <p className="price">{formatCurrency(product.price)}</p>
                    <div className="card-bottom">
                        <Link to={`/detail/${product.productID}`}>
                            <button className="btn view-detail-btn">View Details</button>
                        </Link>
                        <button className="btn atc-btn" onClick={() => setShowPopup(true)}>
                            <i className="bi bi-cart-plus-fill"></i>
                        </button>
                    </div>
                </div>
            </div>
            {showPopup && (
                <AddToCartPopup
                    product={product}
                    onClose={() => setShowPopup(false)}
                    onAddToCart={handleAddToCart}
                />
            )}
        </div>
    );
}
