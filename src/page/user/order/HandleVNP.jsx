import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { checkOutOrder, checkOutVNP } from '../../../service/orderService.jsx';
import './HandleVNP.css'; 

export default function HandleVNP() {
    const location = useLocation();
    const navigate = useNavigate();
    const [status, setStatus] = useState(null);

    useEffect(() => {
        const initiateVNPAY = async () => {
            if (location.state) {
                const { formData, orderDetails, total } = location.state;
                try {
                    const vnpayUrl = await checkOutVNP(total);
                    // Lưu thông tin đơn hàng vào localStorage
                    localStorage.setItem('pendingOrder', JSON.stringify({ formData, orderDetails }));
                    window.location.href = vnpayUrl;
                } catch (error) {
                    console.error("Error initiating VNPAY:", error);
                    setStatus('fail');
                }
            }
        };

        const handleVNPAYResponse = async () => {
            const queryParams = new URLSearchParams(location.search);
            const transactionStatus = queryParams.get('vnp_TransactionStatus');
            const responseCode = queryParams.get('vnp_ResponseCode');

            const pendingOrderString = localStorage.getItem('pendingOrder');
            console.log("Pending order from localStorage:", pendingOrderString);
            if (!pendingOrderString) {
                setStatus('fail');
                return;
            }

            const { formData, orderDetails } = JSON.parse(pendingOrderString);

            console.log("formData from Handle:", formData);
            console.log("orderDetails from Handle:", orderDetails);

            if (transactionStatus === '00' && responseCode === '00') {
                setStatus('success');
                try {
                    const orderResponse = await checkOutOrder(formData, orderDetails);
                    console.log("Order placed successfully:", orderResponse);
                    localStorage.removeItem('pendingOrder');
                    navigate('/order-success', { state: { userName: formData.name } });
                } catch (error) {
                    console.error("Error placing order:", error);
                    setStatus('fail');
                }
            } else {
                setStatus('fail');
            }
        };

        if (location.state) {
            initiateVNPAY();
        } else if (location.search) {
            handleVNPAYResponse();
        }
    }, [location, navigate]);

    if (status === 'fail') {
        return (
            <div className="vnp-container fail">
                <div className="vnp-content">

                    <box-icon className="vnp-icon" name='x-circle' type='solid' color='#f30101' ></box-icon>

                    <h2>Payment Failed</h2>
                    <p>We're sorry, but your payment could not be processed. Please try again or choose a different payment method.</p>
                    <button className="vnp-button" onClick={() => navigate('/')}>
                        Return to Home
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="vnp-container processing">
            <div className="vnp-content">
                <div className="vnp-loader"></div>
                <h2>Processing Your Payment</h2>
                <p>Please wait while we confirm your transaction. This may take a few moments.</p>
            </div>
        </div>
    );
}
