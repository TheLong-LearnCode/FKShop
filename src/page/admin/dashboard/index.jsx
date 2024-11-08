import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice';
import './Dashboard.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Nav } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome
import { Button } from 'antd';
import { Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js';
import api from '../../../config/axios';
import { GET } from '../../../constants/httpMethod';
import { formatCurrency } from '../../../util/CurrencyUnit';

// Đăng ký các components cần thiết
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export default function Dashboard() {
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalCustomer, setTotalCustomer] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  // Lấy dữ liệu
  const data = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.auth.data);
  // Action
  const [revenueData, setRevenueData] = useState([]);

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await api[GET]('/orders/revenue');
        const total = response.data.data.reduce((acc, item) => acc + item.totalRevenue, 0);
        setTotalRevenue(total)
        setRevenueData(response.data.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };
    fetchRevenueData();
  }, []);

  useEffect(() => {
    const getTotalCustomer = async () => {
      try {
        const response = await api[GET]('accounts/customer');
        const total = response.data.data.length;
        const orderNumber = response.data.data.reduce((acc, item) => acc + item.numberOrder, 0);
        setTotalCustomer(total)
        setTotalOrder(orderNumber)
      } catch (error) {
        console.error("Error fetching total revenue:", error);
      }
    };
    getTotalCustomer();
  }, []);

  // Cấu hình cho biểu đồ cột
  const barChartData = {
    labels: revenueData.map(item => item.monthCode),
    datasets: [
      {
        label: 'Revenue by month',
        data: revenueData.map(item => item.totalRevenue),
        backgroundColor: '#133E87',
        borderColor: '#024CAA',
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly revenue chart',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0
            }).format(value);
          }
        }
      }
    }
  };

  // Lấy dữ liệu cho biểu đồ tròn (2 tháng gần nhất)
  const lastTwoMonths = revenueData.slice(-2);
  const pieChartData = {
    labels: lastTwoMonths.map(item => item.monthCode),
    datasets: [
      {
        data: lastTwoMonths.map(item => item.totalRevenue),
        backgroundColor: [
          '#B8001F',
          '#133E87',
        ],
        borderColor: [
          'red',
          'blue',
        ],
        borderWidth: 1,
      },
    ],
  };
  console.log("Data in dashboard: ", data); // data.data => lấy ra info của admin
  console.log("Admin in dashboard: ", admin); // data.data => lấy ra info của admin

  const pieChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Compare revenue for the last 2 months',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const value = context.raw;
            const formattedValue = new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              maximumFractionDigits: 0
            }).format(value);
            return `${context.label}: ${formattedValue}`;
          }
        }
      }
    }
  };

  return (
    <Container fluid className="p-4">
      <Row>
        <Col sm={4} className="mb-3">
          <div className="revenue-card">
            <h4>Total revenue</h4>
            <p className='pt-2'>{formatCurrency(totalRevenue)}</p>
          </div>
        </Col>
        <Col sm={4} className="mb-3">
          <div className="customer-card">
            <h4>Number of customers</h4>
            <p className='pt-2'>{totalCustomer}</p>
          </div>
        </Col>
        <Col sm={4} className="mb-3">
        <div className="order-card">
            <h4>Number of orders</h4>
            <p className='pt-2'>{totalOrder}</p>
          </div>
        </Col>
      </Row>
    
    <Row className="mt-4">
      <Col sm={8} className="mb-3">
        <div className="chart-container p-3 bg-white rounded shadow">
          <Bar data={barChartData} options={barChartOptions} />
        </div>
      </Col>
      <Col sm={4} className="mb-3">
        <div className="chart-container p-3 bg-white rounded shadow">
          <Pie data={pieChartData} options={pieChartOptions} />
          {lastTwoMonths.length === 2 && (
            <div className="mt-3 text-center">
              <p>
                Profits: {' '}
                <span className={lastTwoMonths[1].status === 1 ? 'text-success' : 'text-danger'}>
                  {lastTwoMonths[1].differencePercent > 0 ? '+' : '-'}
                  {(lastTwoMonths[1].differencePercent).toFixed(2)} times
                </span>
              </p>
            </div>
          )}
        </div>
      </Col>
    </Row>
    </Container>
  );
}
