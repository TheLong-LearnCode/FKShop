import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './OrderView.css'; // Đảm bảo bạn tạo file CSS này
import { getProvinces, getDistricts, getWards, calculateShippingFee } from '../../../service/ghnApi.jsx';
import { IDLE } from '../../../redux/constants/status.js';
import { checkOutOrder, checkOutVNP} from '../../../service/orderService.jsx';
import { log } from 'react-modal/lib/helpers/ariaAppHider.js';
import { verifyToken } from '../../../service/authUser.jsx';




export default function OrderView() {
    const dispatch = useDispatch();
    const [activeLink, setActiveLink] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null); // Lưu trữ thông tin người dùng sau khi verify token
    const [errors, setErrors] = useState({});
    const cartProducts = useSelector(state => state.cart.products);
    const navigate = useNavigate();
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [shippingFee, setShippingFee] = useState(0);
    const [error, setError] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');


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
            setIsLoading(true);
            try {
                userData = await verifyToken(userToken); // Gọi hàm verifyToken để lấy dữ liệu
                console.log("userData after verify token: ", userData);

                setUserInfo(userData); // Lưu thông tin user vào state
                console.log("userData after SETUSERINFO: ", userData);
                //userData.data -> lấy ra userInfo
            } catch (error) {
                console.error("Error verifying token: ", error);
            }finally {
                setIsLoading(false);
            }
        };
        fetchUserInfo(); // Gọi API lấy thông tin người dùng
    }, [user.data]); //user.data là thông tin người dùng

    const handlePaymentMethodChange = (e) => {
        setPaymentMethod(e.target.value);
    };

    const [formData, setFormData] = useState({
        fullName: '',
        phoneNumber: '',
        address: '',
        province: '',
        district: '',
        ward: '',
        shippingPrice: '',
        payingMethod: '',
        note: ''
    });

    useEffect(() => {
        if (userInfo?.data) {
            setFormData(prevState => ({
                ...prevState,
                fullName: userInfo.data.fullName || '',
                phoneNumber: userInfo.data.phoneNumber || ''
            }));
        }
    }, [userInfo]);

    console.log('FormDATA: ' + userInfo?.data?.fullName + ' ' + userInfo?.data?.phoneNumber)


    useEffect(() => {
        if (cartProducts.length === 0) {
            navigate('/cart');
        }
        fetchProvinces();
    }, [cartProducts, navigate]);

    const fetchProvinces = async () => {
        try {
            const data = await getProvinces();
            setProvinces(data);
        } catch (error) {
            console.error('Failed to fetch provinces:', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'province') {
            const selectedProvince = provinces.find(p => p.ProvinceName === value);
            if (selectedProvince) {
                setFormData(prevState => ({ ...prevState, district: '', ward: '' }));
                fetchDistricts(selectedProvince.ProvinceID);
            }
        } else if (name === 'district') {
            const selectedDistrict = districts.find(d => d.DistrictName === value);
            if (selectedDistrict) {
                setFormData(prevState => ({ ...prevState, ward: '' }));
                fetchWards(selectedDistrict.DistrictID);
            }
        } else if (name === 'ward') {
            const selectedWard = wards.find(d => d.WardName === value);
            if (selectedWard) {
                calculateShipping(formData.province);
            }
        }
    };

    const fetchDistricts = async (provinceId) => {
        try {
            const data = await getDistricts(provinceId);
            setDistricts(data);
        } catch (error) {
            console.error('Failed to fetch districts:', error);
        }
    };

    const fetchWards = async (districtId) => {
        try {
            const data = await getWards(districtId);
            setWards(data);
        } catch (error) {
            console.error('Failed to fetch wards:', error);
        }
    };


    const subtotal = cartProducts.reduce((total, product) => total + (product.price * product.quantity), 0);
    const total = subtotal + shippingFee;

    const calculateShipping = (provinceName) => {
        const hcmCityId = "Hồ Chí Minh";
        const shippingFee = provinceName === hcmCityId ? 25000 : 35000;
        setShippingFee(shippingFee);

    };

    const validateForm = () => {
        let tempErrors = {};
        tempErrors.fullName = formData.fullName ? "" : "Full name is required";
        tempErrors.phoneNumber = formData.phoneNumber ? "" : "Phone number is required";
        tempErrors.address = formData.address ? "" : "Address is required";
        tempErrors.province = formData.province ? "" : "Province is required";
        tempErrors.district = formData.district ? "" : "District is required";
        tempErrors.ward = formData.ward ? "" : "Ward is required";
        setErrors(tempErrors);
        return Object.values(tempErrors).every(x => x === "");
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            const formData2 = {
                accountID: userInfo?.data.accountID,
                name: formData.fullName,
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                address: formData.address,
                payingMethod: paymentMethod,
                phoneNumber: formData.phoneNumber,
                shippingPrice: shippingFee,
                note: formData.note
            };

            const orderDetailsRequest = cartProducts.map(cartProduct => ({
                productID: cartProduct.productID,
                quantity: cartProduct.quantity,
            }));

            if (paymentMethod === 'cod') {
                try {
                    await checkOutOrder(formData2, orderDetailsRequest);
                    navigate('/order-success', { state: { userName: formData.fullName } });
                } catch (error) {
                    console.error("Error placing COD order:", error);
                }
            } else if (paymentMethod === 'VNpay') {
                navigate('/handle-vnpay', { 
                    state: { 
                        formData: formData2, 
                        orderDetails: orderDetailsRequest,
                        total: total
                    } 
                });
            }
        } else {
            console.log('Form is invalid');
        }
    };



    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            minimumFractionDigits: 0,
        }).format(amount);
    };

    if (isLoading) {
        return <div>Loading...</div>; // Or any loading indicator
    }
    return (
        <div className="container mt-2">
            <div className='text-center' style={{ width: '100%', boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2)' }}>
                <h1 className="mb-4">YOUR ORDER</h1>
            </div>
            <div className="row">
                <div className="col-md-7">
                    <h2>Delivery Information</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Full name*"
                                required
                            />
                            {errors.fullName && <div className="invalid-feedback">{errors.fullName}</div>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="tel"
                                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                                placeholder="Phone number*"
                                required
                            />
                            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                        </div>
                        <div className="mb-3">
                            <input
                                type="text"
                                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address*"
                                required
                            />
                            {errors.address && <div className="invalid-feedback">{errors.address}</div>}
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <select
                                    className={`form-control ${errors.province ? 'is-invalid' : ''}`}
                                    name="province"
                                    value={formData.province}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Province</option>
                                    {provinces.map((province) => (
                                        <option key={province.ProvinceID} value={province.ProvinceName}>
                                            {province.ProvinceName}
                                        </option>
                                    ))}
                                </select>
                                {errors.province && <div className="invalid-feedback">{errors.province}</div>}
                            </div>
                            <div className="col-md-4">
                                <select
                                    className={`form-control ${errors.district ? 'is-invalid' : ''}`}
                                    name="district"
                                    value={formData.district}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.province}
                                >
                                    <option value="">Select District</option>
                                    {districts.map((district) => (
                                        <option key={district.DistrictID} value={district.DistrictName}>
                                            {district.DistrictName}
                                        </option>
                                    ))}
                                </select>
                                {errors.district && <div className="invalid-feedback">{errors.district}</div>}
                            </div>
                            <div className="col-md-4">
                                <select
                                    className={`form-control ${errors.ward ? 'is-invalid' : ''}`}
                                    name="ward"
                                    value={formData.ward}
                                    onChange={handleChange}
                                    required
                                    disabled={!formData.district}
                                >
                                    <option value="">Select Ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.WardCode} value={ward.WardName}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>
                                {errors.ward && <div className="invalid-feedback">{errors.ward}</div>}
                            </div>
                        </div>
                        <div className="mb-3">
                            <textarea
                                className="form-control"
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                placeholder="Note"
                                rows="3"
                            ></textarea>
                        </div>
                        <h2>Payment Method</h2>
                        <div className="mb-3">
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="VNpay"
                                    value="VNpay"
                                    checked={paymentMethod === 'VNpay'}
                                    onChange={handlePaymentMethodChange}
                                />
                                <label className="form-check-label" htmlFor="onlineBanking">
                                    VNPAY
                                </label>
                            </div>
                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="paymentMethod"
                                    id="cod"
                                    value="cod"
                                    checked={paymentMethod === 'cod'}
                                    onChange={handlePaymentMethodChange}
                                />
                                <label className="form-check-label" htmlFor="cod">
                                    Cash on Delivery (COD)
                                </label>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="btn btn-dark w-100"
                        //onClick={handlePayNow}
                        >Pay Now
                        </button>
                    </form>
                </div>
                <div className="col-md-5">
                    <div className="order-summary sticky-top">
                        <h2>Order</h2>
                        {cartProducts.map((product) => (
                            <div key={product.productID} className="d-flex justify-content-between align-items-center mb-2">
                                <div className="d-flex align-items-center">
                                    <img src={product.image} alt={product.name} style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                                    <div>
                                        <h6 className="mb-0">{product.name}</h6>
                                        <small>Quantity: {product.quantity}</small>
                                    </div>
                                </div>
                                <span>{formatCurrency(product.price * product.quantity)}</span>
                            </div>
                        ))}
                        <hr />
                        <div className="d-flex justify-content-between">
                            <span>Subtotal ({cartProducts.length} items)</span>
                            <span>{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="d-flex justify-content-between">
                            <span>Shipping</span>
                            <span>{formatCurrency(shippingFee)}</span>
                        </div>
                        <hr />
                        <div className="d-flex justify-content-between">
                            <strong>Total</strong>
                            <strong>{formatCurrency(total)}</strong>
                        </div>
                        <Link to={"/cart"}><box-icon name='chevrons-left' color='#a49898' ></box-icon> Back to your shopping cart</Link>
                    </div>
                </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
        </div>
    );
}
