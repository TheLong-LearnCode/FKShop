import React, { useEffect, useState } from 'react'
import './index.css'
import { getMyLab, downloadMyLab } from '../../../service/userService';
import { getLabByProductID } from '../../../service/labService';
import { Pagination, Select, message } from 'antd';

const { Option } = Select;

export default function MyLab({ userInfo }) {
  const [allLabs, setAllLabs] = useState([]);
  const [filteredLabs, setFilteredLabs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const pageSize = 4; // Số item trên mỗi trang

  useEffect(() => {
    const fetchGetMyLab = async () => {
      if (userInfo?.accountID) {
        const response = await getMyLab(userInfo.accountID);
        console.log("response in MyLab: ", response.data.orderLabs);
        setAllLabs(response.data.orderLabs);
        setFilteredLabs(response.data.orderLabs);
        
        // Extract unique products from labs
        const uniqueProducts = [...new Set(response.data.orderLabs.map(lab => lab.lab.productID))];
        setProducts(uniqueProducts.map((productId, productName) => ({ id: productId, name: `${productId}` })));
      }
    };
    fetchGetMyLab();
  }, [userInfo]);

  useEffect(() => {
    if (selectedProductId) {
      fetchLabsByProductID(selectedProductId);
    } else {
      setFilteredLabs(allLabs);
    }
    setCurrentPage(1);
  }, [selectedProductId, allLabs]);

  const fetchLabsByProductID = async (productID) => {
    try {
      const response = await getLabByProductID(productID);
      const filteredLabs = response.data.map(lab => ({
        lab: {
          labID: lab.labID,
          productID: lab.productID,
          name: lab.name,
          fileNamePDF: lab.fileNamePDF
        }
      }));
      setFilteredLabs(filteredLabs);
    } catch (error) {
      console.error("Error fetching labs by productID:", error);
      message.error(error.response.data.message);
    }
  };

  // const handleDownload = async (lab) => {
  //   try {
  //     const response = await downloadMyLab(userInfo?.accountID, lab.orderID, lab.lab.labID, lab.lab.productID, lab.lab.fileNamePDF);
  //     window.location.href = response;
  //     //window.open(response, '_blank');
  //   } catch (error) {
  //     console.error('Error downloading lab:', error);
  //     message.error(error.response.data.message);
  //   }
  // };
  const handleDownload = async (lab) => {
    try {
      const url = await downloadMyLab(userInfo?.accountID, lab.orderID, lab.lab.labID, lab.lab.productID, lab.lab.fileNamePDF);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', lab.lab.fileNamePDF); // Set the file name for download
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading lab:', error);
      message.error(error.response?.data?.message || 'Error downloading lab');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProductChange = (value) => {
    setSelectedProductId(value);
  };

  // Tính toán các lab sẽ hiển thị trên trang hiện tại
  const paginatedLabList = filteredLabs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="container">
      <h4 className='text-center'><strong>My LAB</strong></h4>
      <div style={{ marginBottom: '16px' }}>
        <Select
          style={{ width: 200 }}
          placeholder="Filter by Product"
          onChange={handleProductChange}
          value={selectedProductId}
        >
          <Option value={null}>All Products</Option>
          {products.map((product) => (
            <Option key={product.id} value={product.id}>
              {product.name}
            </Option>
          ))}
        </Select>
      </div>
      <div className="lab-table">
        <table className="table table-bordered">
          <thead className="lab-thead">
            <tr>
              <th className="col-8">Lab Title</th>
              <th className="col-2">Download</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLabList.map((lab) => (
              <tr key={lab.lab.labID}>
                <td className="col-8">{lab.lab.fileNamePDF}</td>
                <td className='text-center col-2'>
                  <button className='btn' onClick={() => handleDownload(lab)}>
                    <box-icon name='download' type='solid' color='#3fe70f'></box-icon>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="pagination-container" style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Pagination
          current={currentPage}
          total={filteredLabs.length}
          pageSize={pageSize}
          onChange={handlePageChange}
          showSizeChanger={false}
        />
      </div>
    </div>
  )
}
