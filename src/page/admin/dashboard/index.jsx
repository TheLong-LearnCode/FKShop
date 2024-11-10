import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../redux/slices/authSlice';
import './Dashboard.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col, Form, InputGroup, Nav } from 'react-bootstrap';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import FontAwesome
import { Button, Select } from 'antd';
const { Option } = Select;
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
  const [totalCustomer, setTotalCustomer] = useState(0);
  const [customers, setCustomers] = useState([]);
  const [totalOrder, setTotalOrder] = useState(0);
  // Lấy dữ liệu
  const data = useSelector((state) => state.auth);
  const admin = useSelector((state) => state.auth.data);
  // Action
  const [revenueData, setRevenueData] = useState([]);

  const [filterType, setFilterType] = useState('year');
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 2019 },
    (_, i) => (2020 + i).toString()
  );

  const [displayFilter, setDisplayFilter] = useState('2024');
  const [chartLabel, setChartLabel] = useState('Revenue by month');

  useEffect(() => {
    const fetchYearRevenueData = async () => {
      try {
        const response = await api[GET](`/orders/revenue?year=${selectedYear}`);
        const total = response.data.data.reduce((acc, item) => acc + item.totalRevenue, 0);
        setTotalRevenue(total)
        setRevenueData(response.data.data);
      } catch (error) {
        console.error('Error fetching revenue data:', error);
      }
    };
    fetchYearRevenueData();
  }, []);

  useEffect(() => {
    const getTotalCustomer = async () => {
      try {
        const response = await api[GET]('accounts/customer');
        const total = response.data.data.length;
        const orderNumber = response.data.data.reduce((acc, item) => acc + item.numberOrder, 0);
        setCustomers(response.data.data);
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
    labels: revenueData.map(item => item.code),
    datasets: [
      {
        label: chartLabel,
        data: revenueData.map(item => item.totalRevenue),
        backgroundColor: revenueData.map(item => {
          if (item.status === 1) return '#133E87';  // Tăng
          if (item.status === -1) return '#dc3545'; // Giảm
          return '#6c757d';  // Không đổi
        }),
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
        text: 'Revenue chart',
      },
      tooltip: {
        callbacks: {
          afterLabel: function(context) {
            const dataIndex = context.dataIndex;
            const item = revenueData[dataIndex];
            const lines = [];
            
            if (item.differenceRevenue !== null) {
              const sign = item.differenceRevenue >= 0 ? '+' : '';
              lines.push(`Change: ${sign}${formatCurrency(item.differenceRevenue)}`);
            }
            
            return lines;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return formatCurrency(value);
          }
        }
      }
    }
  };

  const handleSubmit = async () => {
    try {
      let endpoint;
      if (filterType === 'year') {
        endpoint = `/orders/revenue?year=${selectedYear}`;
        setDisplayFilter(selectedYear);
        setChartLabel(`Revenue by month`);
      } else {
        const monthNumber = months.indexOf(selectedMonth) + 1;
        endpoint = `/orders/dailyrevenue?year=${selectedYear}&month=${monthNumber}`;
        setDisplayFilter(`${selectedMonth} of ${selectedYear}`);
        setChartLabel(`Revenue by day`);
      }

      const response = await api[GET](endpoint);
      const total = response.data.data.reduce((acc, item) => acc + item.totalRevenue, 0);
      setTotalRevenue(total);
      setRevenueData(response.data.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  return (
    <Container fluid className="p-4">
      <Row className="mb-4">
        <Col sm={6} className="d-flex align-items-center">
          <Select
            style={{ width: 120, marginRight: 16 }}
            value={filterType}
            onChange={(value) => setFilterType(value)}
          >
            <Option value="month">Month</Option>
            <Option value="year">Year</Option>
          </Select>

          {filterType === 'month' ? (
            <>
              <Select
                style={{ width: 120, marginRight: 16 }}
                value={selectedMonth}
                onChange={(value) => setSelectedMonth(value)}
              >
                {months.map(month => (
                  <Option key={month} value={month}>{month}</Option>
                ))}
              </Select>
              <Select
                style={{ width: 120, marginRight: 16 }}
                value={selectedYear}
                onChange={(value) => setSelectedYear(value)}
              >
                {years.map(year => (
                  <Option key={year} value={year}>{year}</Option>
                ))}
              </Select>
            </>
          ) : (
            <Select
              style={{ width: 120, marginRight: 16 }}
              value={selectedYear}
              onChange={(value) => setSelectedYear(value)}
            >
              {years.map(year => (
                <Option key={year} value={year}>{year}</Option>
              ))}
            </Select>
          )}

          <Button type="primary" onClick={handleSubmit}>
            Choose
          </Button>
        </Col>
      </Row>

      <Row>
        <Col sm={4} className="mb-3">
          <div className="revenue-card">
            <h5>Total revenue {displayFilter}</h5>
            <p className='pt-2'>{formatCurrency(totalRevenue)}</p>
          </div>
        </Col>
        <Col sm={4} className="mb-3">
          <div className="customer-card">
            <h5>Number of customers</h5>
            <p className='pt-2'>{totalCustomer}</p>
          </div>
        </Col>
        <Col sm={4} className="mb-3">
          <div className="order-card">
            <h5>Number of orders</h5>
            <p className='pt-2'>{totalOrder}</p>
          </div>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col sm={12} className="mb-3">
          <div className="chart-container p-3 bg-white rounded shadow">
            <Bar data={barChartData} options={barChartOptions} />
          </div>
        </Col>
      </Row>
      
      <Row className="mt-4">
        <Col sm={12}>
          <div className="top-customers-card p-4 bg-white rounded shadow">
            <h4 className="mb-4 text-center">Top 5 Loyal Customers</h4>
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Customer Name</th>
                    <th>Number of Orders</th>
                    <th>Achievement</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.slice(0, 5).map((customer, index) => (
                    <tr key={customer.accountID}>
                      <td>
                        <div className={`rank-badge rank-${index + 1}`}>
                          {index + 1}
                        </div>
                      </td>
                      <td>{customer.accountName}</td>
                      <td>{customer.numberOrder} orders</td>
                      <td>
                        {index === 0 && <span className="badge bg-gold">Gold Member</span>}
                        {index === 1 && <span className="badge bg-silver">Silver Member</span>}
                        {index === 2 && <span className="badge bg-bronze">Bronze Member</span>}
                        {index > 2 && <span className="badge bg-regular">Regular Member</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Col>
      </Row>
      
    </Container>
  );
}
