const { v4: uuidv4 } = require('uuid')
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const userModel = require('../models/userModel')
const { User } = require('../models/userModel')
const ApiError = require('../utils/ApiError')
const { StatusCodes } = require('http-status-codes')
const { pickUser } = require('../utils/formatters')
const { BrevoProvider } = require('../providers/BrevoProvider')
const { JwtProvider } = require('../providers/JwtProvider')
const qrcode = require('qrcode');
const { authenticator } = require('otplib');
const otplib = require('otplib');
const crypto = require('crypto');
/**
 * Đăng ký tài khoản mới
 */
const createNew = async (reqBody) => {
  try {
    console.log('Register req.body:', reqBody)
    if (!reqBody.email || !reqBody.password) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Email và mật khẩu là bắt buộc')
    }
    const existUser = await userModel.findOneByEmail(reqBody.email)
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email đã tồn tại trong hệ thống!')
    }
    const nameFromEmail = reqBody.email.split('@')[0]
  const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
    username: nameFromEmail,
    displayName: nameFromEmail,
    verifyToken: uuidv4()
  }

  const createdUser = await userModel.createNew(newUser)
  const getNewUser = await userModel.findById(createdUser._id)

    // Gửi email xác thực
  const verificationLink = `http://localhost:3000/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`
  console.log('Verification link sent:', verificationLink); 
  const customSubject = 'Xác thực tài khoản của bạn'
  const htmlContent = `
    <h3>Xác thực tài khoản</h3>
      <p>Chào mừng bạn đến với ứng dụng của chúng tôi</p>
      <p>Click vào link sau để xác thực tài khoản của bạn: <a href="${verificationLink}">Xác thực</a></p>
  `

    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent)

  return pickUser(getNewUser)
  } catch (error) {
    console.error('createNew error:', error)
    throw error
  }
}

/**
 * Xác thực tài khoản qua email
 */const verifyAccount = async (reqBody) => {
  try {
    console.log("Email từ yêu cầu xác thực:", reqBody.email);
    console.log("Token từ yêu cầu xác thực:", reqBody.token);

    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại!');

    if (existUser.isActive) {
      return existUser;
    }

    if (existUser.verifyToken !== reqBody.token) {
      console.log("Token không khớp, kiểm tra lại token:", reqBody.token, "với token trong DB:", existUser.verifyToken);
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Token không đúng!');
    }

    // Cập nhật trạng thái người dùng
    const updateData = {
      isActive: true,
      verifyToken: null,
      updatedAt: new Date()
    };

    await userModel.update(existUser._id, updateData);
    const updatedUser = await userModel.findById(existUser._id);

    return updatedUser;

  } catch (error) {
    console.error("Lỗi xác thực tài khoản:", error);
    throw error;
  }
}




/**
 * Đăng nhập tài khoản
 */
const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Tài khoản không tồn tại!');
    }
    const isPasswordCorrect = bcryptjs.compareSync(reqBody.password, existUser.password);
    if (!isPasswordCorrect) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, 'Email hoặc mật khẩu không đúng!');
    }

    // Kiểm tra trạng thái xác thực tài khoản (isActive)
    if (!existUser.isActive) {
      throw new ApiError(StatusCodes.FORBIDDEN, 'Tài khoản chưa được xác thực! Vui lòng kiểm tra email để xác nhận tài khoản.');
    }

    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      process.env.REFRESH_TOKEN_LIFE
    );

    return {
      accessToken,
      refreshToken,
      isActive: existUser.isActive,
      ...pickUser(existUser)
    };
  } catch (error) {
    throw error;
  }
};





/**
 * Lấy thông tin user theo ID
 */
const getUserById = async (userId) => {
  try {
    const user = await userModel.findById(userId)
    if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    return pickUser(user)
  } catch (error) {
    throw error
  }
}

const updateUser = async (userId, updateData) => {
  try {
    const existingUser = await userModel.findById(userId)
    if (!existingUser) throw new Error('Không tìm thấy người dùng')

    const updatedUser = await userModel.update(userId, {
      ...updateData,
      updatedAt: Date.now()
    })

    return updatedUser
  } catch (error) {
    throw new Error(error)
  }
}

const changePassword = async (userId, oldPassword, newPassword) => {
  try {
    console.log('changePassword input:', { userId, oldPassword, newPassword })

    const user = await userModel.findById(userId)
    if (!user) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Không tìm thấy người dùng')
    }
    const isMatch = await bcryptjs.compare(oldPassword, user.password)
    if (!isMatch) {
      throw new ApiError(StatusCodes.BAD_REQUEST, 'Mật khẩu cũ không chính xác')
    }
    const hashedNewPassword = await bcryptjs.hash(newPassword, 10)
    await userModel.update(userId, {
      password: hashedNewPassword,
      updatedAt: new Date()
    })

    return { message: 'Đổi mật khẩu thành công' }
  } catch (error) {
    console.log('Change password error:', error)
    throw error
  }
}
const get2FAQrCode = async (userId) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) throw new Error('User không tồn tại.');

    if (!user.twoFactorSecretKey) {
      const secret = otplib.authenticator.generateSecret();
      user.twoFactorSecretKey = secret;
      await user.save();
      const freshUser = await userModel.findById(userId);
      const otpauth = otplib.authenticator.keyuri(
        freshUser.email,
        'ExpenseTracker',
        freshUser.twoFactorSecretKey
      );
      const qrCode = await qrcode.toDataURL(otpauth);

      return { qrCode };
    } else {

      const otpauth = otplib.authenticator.keyuri(
        user.email,
        'ExpenseTracker',
        user.twoFactorSecretKey
      );
      const qrCode = await qrcode.toDataURL(otpauth);

      return { qrCode };
    }
  } catch (error) {
    throw new Error('Lỗi khi tạo mã QR: ' + error.message);
  }
};


const hashDeviceId = (userAgent) => {
  return crypto.createHash('sha256').update(userAgent).digest('hex');
};

const setup2FA = async (userId, otpToken, userAgent) => {
  const user = await userModel.findById(userId);
  if (!user) throw new Error('Không tìm thấy người dùng');
  if (!user.twoFactorSecretKey) throw new Error('Người dùng chưa có secret key 2FA');

  const isValid = authenticator.verify({
    token: otpToken,
    secret: user.twoFactorSecretKey,
  });

  if (!isValid) {
    throw new Error('Mã OTP không chính xác');
  }

  const session = {
    device_id: hashDeviceId(userAgent),
    createdAt: new Date(),
    is_2fa_verified: true,
    last_login: new Date(),
  };

  user.sessions.push(session);
  user.is2FAEnabled = true;
  await user.save();

  return session;
};
const verify2FA = async (userId, token, userAgent) => {
  try {
    const user = await userModel.findById(userId);
    if (!user) {
      throw new Error('Không tìm thấy người dùng');
    }

    // Kiểm tra secret 2FA
    if (!user.twoFactorSecretKey) {
      throw new Error('Không có secret 2FA');
    }

    // Kiểm tra mã OTP
    const isValid = otplib.authenticator.verify({ token, secret: user.twoFactorSecretKey });
    if (!isValid) {
      throw new Error('Mã OTP không hợp lệ');
    }

    const hashedUA = hashDeviceId(userAgent);

    const sessionIndex = user.sessions.findIndex((s) => s.device_id === hashedUA);
    if (sessionIndex !== -1) {
      user.sessions[sessionIndex].is_2fa_verified = true;
      user.sessions[sessionIndex].last_login = new Date();
    } else {
      console.warn('Không tìm thấy session tương ứng');
    }

    user.require_2fa = true;
    await user.save();

    const userInfo = {
      _id: user._id,
      email: user.email,
      role: user.role,
      is2FAVerified: true
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
      process.env.ACCESS_TOKEN_LIFE
    );

    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      process.env.REFRESH_TOKEN_SECRET_SIGNATURE,
      process.env.REFRESH_TOKEN_LIFE
    );

    // Trả về token và user
    return {
      accessToken,
      refreshToken,
      ...pickUser(user)
    };
  } catch (error) {
    throw new Error('Lỗi xác thực 2FA: ' + error.message);
  }
}

async function disable2FA(userId) {
  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Xoá thông tin 2FA
    user.twoFactorSecretKey = null;
    user.require_2fa = false;
    user.sessions = []

    await user.save();
    return { success: true, message: '2FA has been disabled' };
  } catch (error) {
    throw new Error(`Error disabling 2FA: ${error.message}`);
  }
}




module.exports = {
  createNew,
  verifyAccount,
  login,
  getUserById,
  updateUser,
  changePassword,
  get2FAQrCode,
  setup2FA,
  verify2FA,
  disable2FA 
}