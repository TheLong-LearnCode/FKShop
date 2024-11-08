import React, { useState, useEffect } from 'react';
import './AddToCartPopup.css';
import { message } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { IDLE } from '../redux/constants/status';
import { verifyToken } from '../service/authUser';

const AddToCartPopup = ({ product, onClose, onAddToCart }) => {
    const [quantity, setQuantity] = useState(1);


    useEffect(() => {
        if (quantity === 0) {
            onClose();
        }
    }, [quantity, onClose]);

    const handleIncreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity >= product.quantity ? product.quantity : prevQuantity + 1);
        if (quantity === product.quantity) {
            message.error("This product just has " + product.quantity + " in stock.");
        }
    };

    const handleDecreaseQuantity = () => {
        setQuantity(prevQuantity => prevQuantity - 1);
    };

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <img src={product.images[0].url} alt={product.name} className="product-image" />
                <h3 style={{ fontSize: '1.5rem' }}>{product.name}</h3>
                <div className='quantity-control'>
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
                {product.quantity > 0 ?
                    <button onClick={() => onAddToCart(quantity)} className="add-to-cart-btn">Add to Cart</button>
                    : 
                    <button className='out-of-stock-btn'>Out of Stock</button>
                }

                <button onClick={onClose} className="close-btn">Cancel</button>
            </div>
        </div>
    );
};

export default AddToCartPopup;
