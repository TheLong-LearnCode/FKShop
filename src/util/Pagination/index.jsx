import React from 'react';
import { Button } from 'react-bootstrap';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // Tạo một mảng các item trống để điền vào trang cuối cùng nếu cần
  const createEmptyItems = () => {
    const lastPageItems = totalItems % itemsPerPage;
    if (lastPageItems === 0) return [];
    return Array(itemsPerPage - lastPageItems).fill(null);
  };

  const emptyItems = createEmptyItems();

  return (
    <div className="d-flex justify-content-between align-items-center">
      <div>
        Page {currentPage} of {totalPages}
      </div>
      <div>
        <Button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="mr-2"
        >
          Previous
        </Button>
        <Button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default Pagination;