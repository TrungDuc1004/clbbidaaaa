import axios from 'axios';
import { toast } from 'sonner';

const api = axios.create({
    baseURL: 'http://localhost:5000', // URL API chính
    timeout: 5000, // Timeout 5 giây
    headers: { 'Content-Type': 'application/json' ,},
});

let isRefreshingToken = false;
// Thêm interceptor để tự động đính kèm token vào request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token'); // Lấy token từ localStorage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("Không tìm thất token, gửi request không có Authorization")
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response) {
        console.error("Error Response Data:", error);
  
        if (error.response.status === 401) {
          // Kiểm tra xem đã xử lý redirect chưa
          if (!isRefreshingToken) {
              isRefreshingToken = true; // Đánh dấu đã xử lý
              toast.error("Bạn chưa đăng nhập hoặc phiên đã hết hạn!");
              localStorage.removeItem('token'); // Xóa token cũ
              setTimeout(() => {
                  window.location.href = "/login";
              }, 1000); // Chờ 1 giây để tránh lặp liên tục
          }
        } else if (error.response.status === 403) {
            toast.error("Bạn không có quyền truy cập!");
        }else if (error.response.status === 500 || error.response.status === 400) {
            const errorMessage = error.response.data?.error || error.response.data?.message || "Lỗi không xác định từ server!";
            toast.error(errorMessage);
        }
          
      } else if (error.request) {
        toast.error("Không thể kết nối đến server!");
      } else {
        console.error("Axios error:", error.message);
      }
      return Promise.reject(error);
    }
  );


export default api
