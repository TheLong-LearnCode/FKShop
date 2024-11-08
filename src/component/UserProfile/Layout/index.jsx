import React, { useEffect, useState, useTransition } from 'react';
import styles from './index.module.css';
import Sidebar from '../Sidebar';
import ProfileInformation from '../Information';
import Purchase from '../Purchase';
import UpdateAccount from '../UpdateAccount';
import ChangePassword from '../ChangePassword';
import Support from '../Support';
import MyLab from '../MyLab';
import { useDispatch, useSelector } from 'react-redux';
import { verifyToken } from '../../../service/authUser';
import { setUser } from '../../../redux/slices/authSlice'; // Import the action to set user info
import { IDLE, SUCCESSFULLY } from '../../../redux/constants/status';
import { useLocation, useNavigate } from 'react-router-dom';
import { getUserByAccountID } from '../../../service/userService';
import Question from '../Question/Question';

export default function UserProfile() {
    const [activeTab, setActiveTab] = useState('information'); // State to manage the active tab
    const [isPending, startTransition] = useTransition();
    const [userInfo, setUserInfo] = useState(null); // Lưu trữ thông tin người dùng sau khi verify token

    const user = useSelector((state) => state.auth); // Get user state from Redux store
    const dispatch = useDispatch(); // Initialize dispatch
    const navigate = useNavigate(); // Initialize navigate
    const location = useLocation(); // Get the current URL location

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
                const userFF = await getUserByAccountID(userData.data.accountID);
                console.log("userFF after RENDER: ", userFF);
                setUserInfo(userFF); // Lưu thông tin user vào state
                console.log("userData after SETUSERINFO: ", userData);
                //userData.data -> lấy ra userInfo
            } catch (error) {
                console.error("Error verifying token: ", error);
            }
        };
        fetchUserInfo(); // Gọi API lấy thông tin người dùng
    }, [user.data]); //user.data là thông tin người dùng
    console.log("User info in ProfileLayout after render:", user);
    //--------------------------------------------------------------------------
    console.log("USSEERR: ", userInfo?.data); //->.accountID
    //lần đầu & sau khi load lại trang: thông tin user -> userInfo?.data
    
    const userFinalInfo = userInfo?.data;
    // if(userInfo === null && user.data?.accounts !== null) {
    //     userFinalInfo = user.data?.accounts;
    // } else if(userInfo === undefined && user.data?.data !== null) {
    //     userFinalInfo = user.data?.data;
    // } else if(user.data.data !== null && userInfo.data !== null && user.status === SUCCESSFULLY){
    //     userFinalInfo = user.data.data;
    // } else {
    //     userFinalInfo = userInfo.data;
    // }


    //idle
    //user.data

    //success
    //user.data.data

    // Function to change tab using startTransition
    const handleTabChange = (tabName) => {
        startTransition(() => {
            setActiveTab(tabName);
            navigate(`/user/${tabName}`); // Update the URL when tab changes
        });
    };
    // Update the active tab based on the URL path when the component mounts or when the URL changes
    useEffect(() => {
        const path = location.pathname.split('/').pop(); // Get the last part of the URL
        setActiveTab(path || 'information'); // Set the active tab based on the URL
    }, [location.pathname]); // Run this effect whenever the URL changes

    return (
        <div className={styles.ht} style={{ paddingTop: '0px' }}> {/* Thêm paddingTop ở đây */}
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-10 col-md-12 col-xs-12">
                        <div className="row">
                            <div className="col-lg-3 col-md-12 col-xs-12 border-right">
                                {/* Pass the activeTab and setActiveTab to Sidebar */}
                                <Sidebar 
                                    activeTab={activeTab} 
                                    setActiveTab={handleTabChange} 
                                    userInfo={userFinalInfo} 
                                />
                            </div>
                            <div className='col-lg-9 col-md-12 col-xs-12 profile-display'>
                                {/* Show a dismissible alert if showMessage is true */}
                                {/* Render the content based on the activeTab */}
                                {/* lần đầu vào -> user.data?.accounts , khi load lại trang -> user.data?.data */}
                                {activeTab === 'information' && <ProfileInformation userInfo={userFinalInfo} />}
                                {activeTab === 'purchase' && <Purchase userInfo={userFinalInfo}/>}
                                {activeTab === 'support' && <Support userInfo={userFinalInfo}/>}
                                {activeTab === 'updateAccount' && <UpdateAccount userInfo={userFinalInfo}/>}
                                {activeTab === 'changePassword' && <ChangePassword userInfo={userFinalInfo}/>}
                                {activeTab === 'myLab' && <MyLab userInfo={userFinalInfo}/>}
                                {activeTab === 'question' && <Question userInfo={userFinalInfo}/>}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
