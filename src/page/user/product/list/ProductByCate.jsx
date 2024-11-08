import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import '../../../../util/GlobalStyle/GlobalStyle.css';
import './ProductByCate.css'
import api from '../../../../config/axios';
import { GET } from '../../../../constants/httpMethod';
import CardContent from '../card/CardContent';
import { Pagination } from 'antd';

export default function ProductList() {
  const { categoryID } = useParams()
  const [cate, setCate] = useState(null);
  const [activeButton, setActiveButton] = useState('');
  const [products, setProducts] = useState([]);
  const [ascProducts, setAscProducts] = useState([]);
  const [descProducts, setDescProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Lấy sản phẩm cho trang hiện tại
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);
  const currentAscProducts = ascProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const currentDescProducts = descProducts.slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.ceil(products.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const fetchCategoryName = async () => {
      try {
        const response = await api[GET](`/categories/${categoryID}`);
        setCate(response.data.data);
        setActiveButton('');
      } catch (err) {
        console.error("Error fetching lab details: ", err);
      }
    }
    fetchCategoryName();

  }, [categoryID])

  const handleButtonClick = (buttonType) => {
    setActiveButton(buttonType);
  }

  useEffect(() => {
    const fetchCateProduct = async () => {
      try {
        const response = await api[GET](`/product/by-category/${categoryID}`);
        setProducts(response.data.data);
      } catch (err) {
        console.error("Error fetching lab details: ", err);
      }
    }
    fetchCateProduct();

  }, [categoryID])

  useEffect(() => {
    const ascCateProduct = async () => {
      try {
        const response = await api[GET](`/product/price-asc/${categoryID}`);
        setAscProducts(response.data.data);
      } catch (err) {
        console.error("Error fetching lab details: ", err);
      }
    }
    ascCateProduct();

  }, [categoryID])

  useEffect(() => {
    const descCateProduct = async () => {
      try {
        const response = await api[GET](`/product/price-desc/${categoryID}`);
        setDescProducts(response.data.data);
      } catch (err) {
        console.error("Error fetching lab details: ", err);
      }
    }
    descCateProduct();

  }, [categoryID])

  return (
    <div className='fixed-header mb-3' style={{ minHeight: '350px' }}>
      <div className="container-xl product-list-container">
        <h2 key={cate?.categoryID}>
          <span></span>{cate?.categoryName}
        </h2>

        <div className="product-list-buttons">
          <button
            className={`btn-asc btn ${activeButton === 'lth' ? 'active' : ''}`}
            onClick={() => handleButtonClick('lth')}
          >
            Low to high price
          </button>

          <button
            className={`btn-asc btn ${activeButton === 'htl' ? 'active' : ''}`}
            onClick={() => handleButtonClick('htl')}
          >
            High to low price
          </button>

          <div className="row mt-3">
            {activeButton === '' &&
              currentProducts.map((product) => (
                <CardContent product={product} />
              ))
            }

            {activeButton === 'lth' &&
              currentAscProducts.map((product) => (
                <CardContent product={product} />
              ))
            }

            {activeButton === 'htl' &&
              currentDescProducts.map((product) => (
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
