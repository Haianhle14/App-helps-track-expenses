import axios from 'axios'
import { toast } from 'react-toastify'
import { interceptorLoadingElements } from './formatters'
// Khởi tạo một đối tượng Axios (authorizedAxiosInstance) mục đích để custom và cấu hình chung cho dự án.
const authorizedAxiosInstance = axios.create()

// Thời gian chờ tối đa của 1 request: để 10 phút
authorizedAxiosInstance.defaults.timeout = 1000 * 60 * 10
// WithCredentials: sẽ cho phép axios tự động gửi cookie trong mỗi request lên BE (phục vụ việc chugns ta sẽ lưu
// JWT tokens (refresh token) vào trong httpOnly cookie của trình duyệt.
authorizedAxiosInstance.defaults.withCredentials = true

// Interceptor Request: Can thiệp vào giữa những cái request API
authorizedAxiosInstance.interceptors.request.use((config) => {
  // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formatters chứa function này)
  interceptorLoadingElements(true)
  return config
}, (error) => {
  // Do something with request error
  return Promise.reject(error)
})

// Interceptor Response: Can thiệp vào giữa những cái response nhận về
authorizedAxiosInstance.interceptors.response.use((response) => {
  // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formatters chứa function này)
  interceptorLoadingElements(false)
  return response
}, (error) => {
  // Kỹ thuật chặn spam click (xem kỹ mô tả ở file formatters chứa function này)
  interceptorLoadingElements(false)

  // Mọi mã http status code nằm ngoài khoảng 200 ~ 299 sẽ là error và rơi vào đây
  // Xử lý tập trung phần hiển thị thông báo lỗi trả vể từ mọi API ở đây (viết code một lần: Clean Code)
  let errorMessage = error?.message
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message
  }

  // Dùng toastify để hiện thị bất kì mọi mã lỗi lên màn hình - Ngoại trừ mã 410 - GONE phục vụ việc tự động refresh lại token.
  if (error.response?.status !== 410) {
    toast.error(errorMessage)
  }
  return Promise.reject(error)
})
export default authorizedAxiosInstance