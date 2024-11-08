import React from 'react';
import './Footer.css';
import 'boxicons'

export default function Footer() {
    return (
        <>
            <footer>
                <div className="container-fluid mt-3">
                    <div className="row">
                        <div className="col-md-3 mt-3">
                            <img src="/img/Logo.png" alt="FPT Kit Shop Logo" className="footer-logo mb-3" />
                        </div>
                        <div className="col-md-3 mt-3">
                            <h5 className="mb-3">Policy</h5>
                            <ul className="list-unstyled">
                                <li><a href="#" className="text-light">Shipping Policy</a></li>
                                <li><a href="#" className="text-light">Warranty policy</a></li>
                                <li><a href="#" className="text-light">Privacy Policy</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 mt-3">
                            <h5 className="mb-3">Support</h5>
                            <ul className="list-unstyled">
                                <li><a href="#" className="text-light">Buying guide</a></li>
                                <li><a href="#" className="text-light">Favorite products</a></li>
                            </ul>
                        </div>
                        <div className="col-md-3 mt-3">
                            <h5 className="mb-3">Account</h5>
                            <ul className="list-unstyled">
                                <li><a href="#" className="text-light">Sign Up</a></li>
                                <li><a href="#" className="text-light">Sign In</a></li>
                                <li><a href="#" className="text-light">Cart</a></li>
                            </ul>
                        </div>
                    </div>
                    <hr className="bg-light" />
                    <div className="row ">
                        <div className="col-md-12 text-center">
                            <h5 className="mb-3">Contact</h5>
                            <p>Address: Lot E2a-7, Road D1, D1 Street, Long Thanh My, Thu Duc City, Ho Chi Minh City 700000</p>
                            <p>Working hours: Monday - Saturday: 8:00 to 17:30</p>
                            <p>Email: abc@example.com</p>
                        </div>
                        <div className="col-md-12 text-center">
                            <div className="social-icons">
                                <a href="#" className="text-light mr-3"><box-icon name='facebook-circle' type='logo' color='#ffffff' ></box-icon></a>
                                <a href="#" className="text-light mr-3"><box-icon name='instagram-alt' type='logo' color='#ffffff' ></box-icon></a>
                                <a href="#" className="text-light"><box-icon name='github' type='logo' color='#ffffff' ></box-icon></a>
                            </div>
                        </div>
                    </div>
                    <div className="row mt-3">
                        <div className="col-12 text-center">
                            <p className="mb-0">&copy; 2024 FKShop. All rights reserved | design by 5CayCo</p>
                        </div>
                    </div>
                </div>
            </footer>
        </>
    )
}
