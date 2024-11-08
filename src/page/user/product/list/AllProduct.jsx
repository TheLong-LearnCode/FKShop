import React, { useEffect, useState } from 'react'
import '../../../../util/GlobalStyle/GlobalStyle.css';
import './ProductByCate.css'
import CardContent from '../card/CardContent';
import { Pagination } from 'antd';
import api from '../../../../config/axios';
import { GET } from '../../../../constants/httpMethod';

export default function AllProduct() {
    const [products, setProducts] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

    // Lấy sản phẩm cho trang hiện tại
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(products.length / productsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api[GET]("product/products");
                setProducts(response.data.data);

            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);


    return (
        <div className='fixed-header mb-3' style={{ minHeight: '350px' }}>
            <div className="container-xl product-list-container">
                <h2>
                    <span></span> All Products
                </h2>

                <div className="product-list-buttons">

                    <div className="row mt-3">
                        {currentProducts.map((product) => (
                            <CardContent product={product} />
                        ))
                        }
                    </div>

                    <div className='col-md-12 d-flex justify-content-center' style={{ marginTop: '20px' }}>
                        <Pagination
                            current={currentPage}
                            pageSize={productsPerPage}
                            total={products.length}
                            onChange={handlePageChange}
                            showSizeChanger={false} // Ẩn tùy chọn thay đổi kích thước trang
                        />
                    </div>
                </div>
            </div>

        </div>
    )
}
