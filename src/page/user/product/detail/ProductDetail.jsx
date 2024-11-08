import React, { useState, useEffect, useTransition } from 'react'
import '../../../../util/GlobalStyle/GlobalStyle.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { GET } from '../../../../constants/httpMethod';
import api from '../../../../config/axios';
import './ProductDetail.css'
import { useDispatch, useSelector } from 'react-redux'
import { IDLE } from '../../../../redux/constants/status';
import { verifyToken } from '../../../../service/authUser';
import { addProductToCart } from '../../../../redux/slices/cartSlice';
import { message, Rate } from 'antd';
import { getFeedbackByProductID } from '../../../../service/feedbackService';

export default function ProductDetail() {
    const [product, setProduct] = useState(null); // Khởi tạo là null thay vì mảng rỗng
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeButton, setActiveButton] = useState('descript');
    const [selectedImage, setSelectedImage] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [labDetails, setLabDetails] = useState(null);
    const [feedbacks, setFeedbacks] = useState([]);

    const { productID } = useParams()
    const dispatch = useDispatch()
    //--------------------------------------------------------------------------
    const [isPending, startTransition] = useTransition();
    const [activeLink, setActiveLink] = useState('');
    const [userInfo, setUserInfo] = useState(null); // Lưu trữ thông tin người dùng sau khi verify token
    const navigate = useNavigate();
    //const dispatch = useDispatch()

    // Lấy thông tin người dùng từ Redux Store
    const user = useSelector((state) => state.auth);
    console.log("user in PRODUCTDETAIL: ", user);
    const userDataStatus = useSelector((state) => state.auth.data);

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
    //--------------------------------------------------------------------------
    console.log("USSEERR: ", userInfo?.data); //->.accountID
    //lần đầu & sau khi load lại trang: thông tin user -> userInfo?.data

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                const response = await api[GET](`product/${productID}`);
                setProduct(response.data.data);
                setSelectedImage(response.data.data.images[0].url); // Đặt ảnh đầu tiên làm ảnh được chọn
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
    }, [productID]);

    useEffect(() => {
        const fetchLabDetails = async () => {
            try {
                const response = await api[GET](`lab/product/${productID}`);
                setLabDetails(response.data.data);
                console.log("Lab details: ", response.data.data);
            } catch (err) {
                console.error("Error fetching lab details: ", err);
            }
        }
        fetchLabDetails();
    }, [productID]);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const response = await getFeedbackByProductID(productID);
                setFeedbacks(response.data);
            } catch (err) {
                console.error("Error fetching feedback: ", err);
            }
        }
        fetchFeedback();

    }, [productID]);

    const handleButtonClick = (buttonType) => {
        setActiveButton(buttonType);
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    const handleIncreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity >= product.quantity ? product.quantity : prevQuantity + 1);
        if (quantity === product.quantity) {
            message.error("This product just has " + product.quantity + " in stock.");
        }
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1);
    };

    const handleAddToCart = () => {
        if (userInfo?.data?.accountID && product.productID) {
            dispatch(addProductToCart({
                accountID: userInfo.data.accountID,
                productID: product.productID,
                quantity: quantity
            }));
        } else {
            message.error("Login to add product to cart");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.message}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className='fixed-header'>
            <div className="container mt-4 pb-4" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
                <div className="row">
                    <div className="col-md-6 mt-4 " key={product.productID}>
                        <img style={{ objectFit: 'contain', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', borderRadius: '10px', height: '300px', width: '100%' }} src={selectedImage} alt={product.name} className="img-fluid" />
                        <div className="row mt-4">
                            {product.images.map((image, index) => (
                                <div className="col-lg-3 col-md-4 pr-0 mb-2 product-detail-subimg" key={index}>
                                    <img src={image.url} alt={`Image ${index + 1}`} className="img-fluid" style={{ objectFit: 'contain', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', borderRadius: '10px', height: '150px', width: '100%' }} onClick={() => setSelectedImage(image.url)} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="col-md-6 mt-3">
                        <h2 className='text-center' style={{ color: '#000F8F', fontWeight: '500' }}>{product.name}</h2>
                        <div className="row ">
                            <div className="col-md-5  mt-2">
                                <p><strong>Type:</strong> {product.type}</p>
                                <p><strong>Sold:</strong> {product.unitOnOrder}</p>
                                <p><strong>In stock:</strong> {product.quantity}</p>
                            </div>
                            <div className="col-md-5 mt-2">
                                <p><strong>Status:</strong> {product.status}</p>
                                <p><strong>Publisher:</strong> {product.publisher}</p>
                                {product.categories.length > 0
                                    ? <p><strong>Categories:</strong>

                                        {product.categories.map(category => (
                                            <Link style={{ color: '#000F8F' }} key={category.categoryID} to={`/products/${category.categoryID}`}>
                                                {category.categoryName}
                                            </Link>
                                        )).reduce((prev, curr) => [prev, ', ', curr])}</p>
                                    : null}
                            </div>
                        </div>

                        <h3 style={{ color: '#B43F3F' }}>{formatCurrency(product.price)}</h3>

                        <div className="form-group">
                            <label htmlFor="quantity">Quantity:</label>
                            <div className="input-group" style={{ width: '150px' }}>
                                <div className="input-group-prepend">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={handleDecreaseQuantity}
                                    >
                                        -
                                    </button>
                                </div>
                                <input
                                    type="text"
                                    className="form-control text-center"
                                    style={{ backgroundColor: 'white' }}
                                    value={quantity}
                                    readOnly
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={handleIncreaseQuantity}
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                        </div>
                        {product.quantity === 0 ?
                            <button
                                className='btn btn-block mb-2 out-stock-btn'
                            >
                                Out of stock
                            </button>
                            : <button
                                className="btn btn-block mb-2 detail-atc-btn"
                                onClick={handleAddToCart}
                            >
                                Add to cart
                            </button>}

                    </div>
                </div>
            </div>

            <div className="container mt-4" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
                <div className="product-detail-buttons">
                    <button
                        className={`btn ${activeButton === 'descript' ? 'active' : ''}`}
                        onClick={() => handleButtonClick('descript')}
                    >
                        Description
                    </button>
                    {product.type === 'kit' &&
                        <button
                            className={`btn ${activeButton === 'lab' ? 'active' : ''}`}
                            onClick={() => handleButtonClick('lab')}
                        >
                            Related labs
                        </button>
                    }
                </div>

                {activeButton === 'descript' &&
                    <div className="product-detail-content">
                        <p>{product.description}</p>
                        <p><strong>Weight:</strong> {product.weight}</p>
                        <p><strong>Dimension:</strong> {product.dimension}</p>
                        <p><strong>Material:</strong> {product.material}</p>
                        {product.components.length > 0 ? (
                            <p>
                                <strong>Components:</strong>
                                {product.components.map(component => (
                                    <span key={component.componentID}> {component.componentName} <span style={{color: 'green', fontWeight:'500'}}>x {component.quantity} </span></span>
                                )).reduce((prev, curr) => [prev, ', ', curr])}
                            </p>
                        ) : null}

                        <div className="row mt-4 pb-4">
                            {product.images.slice(2).map((image, index) => (
                                <div className="col-3 pr-0" key={index}>
                                    <img src={image.url} alt={`Image ${index + 1}`} className="img-fluid" style={{ objectFit: 'contain', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)', borderRadius: '10px' }} />
                                </div>
                            ))}
                        </div>
                    </div>
                }

                {activeButton === 'lab' &&
                    <div className="product-detail-content py-2">
                        {labDetails?.map((lab) => (
                            lab.fileNamePDF !== null
                                ? <div key={lab.labID} style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
                                    <div style={{ margin: '20px' }}>
                                        <h3 style={{ paddingTop: '10px', color: '#000F8F' }}>{lab.name}</h3>
                                        <p><strong>Description:</strong> {lab.description}</p>
                                        <p style={{ paddingBottom: '10px' }}><strong>Level:</strong> <strong style={{ color: 'red' }}>{lab.level}</strong></p>
                                    </div>

                                </div>
                                : null
                        ))}
                    </div>
                }
            </div>

            <div className="container mt-4 mb-2" style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
                <h3 style={{ paddingTop: '10px' }}>Feedback</h3>
                {feedbacks.length === 0 ?
                    <div className="no-feedback-message" style={{ textAlign: 'center', padding: '20px', color: '#888' }}>
                        <h3>No Feedback Here</h3>
                        <p>Be the first to leave a feedback for this product!</p>
                    </div>

                    : <div className="product-detail-content pb-1">
                        {feedbacks.map((fb) => (
                            <div key={fb.feedback.feedbackID} style={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
                                <div style={{ margin: '20px' }}>
                                    <h5 style={{ paddingTop: '10px', color: '#000F8F' }}>{fb.customerName}</h5>
                                    <Rate
                                        tooltips={['Very bad', 'Bad', 'Okay', 'Good', 'Very good']}
                                        value={fb.feedback.rate}
                                        allowClear={false}
                                        className='pb-1'
                                    ></Rate>
                                    <p className='pb-2'>{fb.feedback.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                }
            </div>
        </div>
    )
}
