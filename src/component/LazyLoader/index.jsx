import { Spin } from "antd"
import { Suspense, useEffect } from "react"
import { useLocation } from "react-router-dom";


const LazyLoader = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        }); // Cuộn về đầu trang
    }, [location]);

    return (
        <Suspense
            fallback={
                <>
                    <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-[rgba(255,255,255,0.5)]">
                        <Spin size="large" />
                    </div>
                </>
            }> 
            <div style={{width: '100%',minHeight: '100%'}}>
                {children}
            </div>
                
        </Suspense>
    )
}

export default LazyLoader;