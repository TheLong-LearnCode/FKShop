import { notification } from 'antd';
// import 'antd/dist/antd.css';

// Notification function
export const Notification = (message, detail, duration, status) => {
  notification[status]({
    message: message,
    description: detail,
    placement: 'topRight',
    duration: duration,
  });
};
