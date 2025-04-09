const ApiError = require('../utils/ApiError')
const { userModel } = require('../models/userModel')
const { StatusCodes } = require('http-status-codes')
const bcryptjs = require('bcryptjs')
const { v4: uuidv4 } = require('uuid')
const { pickUser } = require('../utils/formatters')
const { BrevoProvider } = require('../providers/BrevoProvider')
const { JwtProvider } = require('../providers/JwtProvider')

/**
 * Đăng ký tài khoản mới
 */
const createNew = async (reqBody) => {
  try {
    console.log('🚀 ~ Register req.body:', reqBody)

    // 1. Kiểm tra email và password
    if (!reqBody.email || !reqBody.password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email và mật khẩu là bắt buộc')
    }

    // 2. Kiểm tra xem email đã tồn tại chưa
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại trong hệ thống!')
    }

    // 3. Tạo thông tin user mới
    const nameFromEmail = reqBody.email.split('@')[0]
    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: nameFromEmail,
      displayName: nameFromEmail,
      verifyToken: uuidv4()
    }

    // 4. Lưu user vào DB
    const createdUser = await userModel.createNew(newUser)
    const getNewUser = await userModel.findOneById(createdUser._id)

    // 5. Gửi email xác thực
    const verificationLink = `http://localhost:3000/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
    const customSubject = 'Xác thực tài khoản của bạn'
    const htmlContent = `
      <h3>Xác thực tài khoản</h3>
      <p>Chào mừng bạn đến với ứng dụng của chúng tôi</p>
      <p>Click vào link sau để xác thực tài khoản của bạn: <a href="${verificationLink}">Xác thực</a></p>
    `

    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

    return pickUser(getNewUser)
  } catch (error) {
    console.error('❌ createNew error:', error)
    throw error
  }
}

/**
 * Xác thực tài khoản qua email
 */
const verifyAccount = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)

    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại!')
    if (existUser.isActive) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Tài khoản đã được xác thực!')
    if (existUser.verifyToken !== reqBody.token) throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token không đúng!')

    const updateData = {
      isActive: true,
      verifyToken: null,
      updatedAt: new Date()
    }

    const updatedUser = await userModel.update(existUser._id, updateData)

    return pickUser(updatedUser)
  } catch (error) {
    throw error
  }
}

/**
 * Đăng nhập tài khoản
 */
const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại!')

    const isPasswordCorrect = bcryptjs.compareSync(reqBody.password, existUser.password)
    if (!isPasswordCorrect) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email hoặc mật khẩu không đúng!')
    }

    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role
    }

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    )

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      process.env.REFRESH_TOKEN_LIFE
    )

    return {
      accessToken,
      refreshToken,
      isActive: existUser.isActive,
      ...pickUser(existUser)
    }
  } catch (error) {
    throw error
  }
}

/**
 * Lấy thông tin user theo ID
 */
const getUserById = async (userId) => {
  try {
    const user = await userModel.findOneById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    return pickUser(user)
  } catch (error) {
    throw error
  }
}

module.exports = {
  createNew,
  verifyAccount,
  login,
  getUserById
}
