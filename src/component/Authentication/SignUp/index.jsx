import './index.scss';
import React, { useState } from 'react';

import GoogleButton from '../GoogleButton';

function SignUp() {
    const [dob, setDob] = useState(''); // Khởi tạo trạng thái cho Year of Birth
    const [isDateType, setIsDateType] = useState(false); // Trạng thái để theo dõi khi nào input là kiểu 'date'


    const handleDobChange = (event) => {
        setDob(event.target.value);
    };

    return (
        <>
            <form id="form-sign-up">
                <div className="row">
                    <div className="col-md-6">

                        <div className="form-group">
                            <input id="fullName" name="fullName" type="text" className="form-control" placeholder="Full name" />
                            <span className="form-message"></span>
                        </div>
                        <div className="form-group">
                            <input
                                id="dob"
                                name="dob"
                                type={isDateType || dob ? 'date' : 'text'}
                                className="form-control"
                                placeholder="Date of birth"
                                onFocus={() => setIsDateType(true)}
                                onBlur={(e) => {
                                    if (!e.target.value) {
                                        setIsDateType(false);
                                        e.target.placeholder = 'Date of birth';
                                    }
                                }}
                                value={dob}

                                onChange={handleDobChange}


                            />
                            <span className="form-message"></span>
                        </div>
                        <div className="form-group">
                            <input id="phoneNumber" name="phoneNumber" type="text" className="form-control" placeholder="Phone number" />
                            <span className="form-message"></span>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <input id="email" name="email" type="email" className="form-control" placeholder="Email" />
                            <span className="form-message"></span>
                        </div>
                        <div className="form-group">
                            <input id="password" name="password" type="password" className="form-control" placeholder="Password" />
                            <span className="form-message"></span>
                        </div>
                        <div className="form-group">
                            <input id="password_confirmation" name="password_confirmation" type="password" className="form-control" placeholder="Password confirmation" />
                            <span className="form-message"></span>
                        </div>
                    </div>
                    <div className="col-md-12 tab-content mt-3">
                        <button type="submit" id='signUp-btn' className="btn btn-outline-dark btn-block">Sign Up</button>
                        <div className="form-group text-center">
                            <hr />
                            <span className="text-muted">or continue with</span>
                        </div>
                        <GoogleButton />
                    </div>
                </div>
            </form >
        </>
    );
}

export default SignUp;
