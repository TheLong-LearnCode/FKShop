import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import '../../../../util/GlobalStyle/GlobalStyle.css';
import CardContent from '../card/CardContent';
import './ProductByCate.css'
import { Pagination } from 'antd';

export default function ProductByName() {
  const location = useLocation();
  const { state } = location;
  const searchResults = state?.searchResults || [];
  console.log(searchResults)
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  // Lấy sản phẩm cho trang hiện tại
  const currentSearchProducts = searchResults.slice(indexOfFirstProduct, indexOfLastProduct);


  const totalPages = Math.ceil(searchResults.length / productsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };


  return (
    <div className='fixed-header' style={{ minHeight: '350px' }}>
      <h1 className='text-center'>Search Result</h1>
      <div className="container-xl product-list-container">
        {searchResults.length === 0 ? (
          <div className="text-center" style={{ fontSize: '2rem', color: '#E4E0E1' }}>
            <i class="bi bi-emoji-dizzy-fill text-dark"></i>
            <h3 >No search results found.</h3>
            <p>Please try a different search term.</p>
          </div>
        ) : (
          <div>
            <div className="row mt-3">
              {currentSearchProducts.map((product) => (
                <CardContent key={product.id} product={product} />
              ))}
            </div>

            <div className='col-md-12 d-flex justify-content-center' style={{ marginTop: '20px' }}>
              <Pagination
                current={currentPage}
                pageSize={productsPerPage}
                total={searchResults.length}
                onChange={handlePageChange}
                showSizeChanger={false} // Ẩn tùy chọn thay đổi kích thước trang
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
