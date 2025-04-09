// User
import authorizedAxiosInstance from '../utils/authorizeAxios'
import { toast } from 'react-toastify'

export const registerUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.post(`http://localhost:5000/api/v1/users/register`, data)
  toast.success('Account created successfully! Please check and verify your account before logging in!',
    { theme: 'colored' })
  return response.data
}

export const verifyUserAPI = async (data) => {
  const response = await authorizedAxiosInstance.put(`http://localhost:5000/api/v1/users/verify`, data)
  toast.success('Account created successfully! Now you can login to enjoy our services! Have a good day!',
    { theme: 'colored' })
  return response.data
}
