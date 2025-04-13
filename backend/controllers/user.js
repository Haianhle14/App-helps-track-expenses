const { StatusCodes } = require('http-status-codes');
const userServices = require('../service/userService')

const createNew = async (req, res, next) => {
  try {
    const createUser = await userServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)
  }
  catch (error) { 
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Server Error'
    }); 
  }
}

const verifyAccount = async (req, res, next) => {
  try {
    const result = await userServices.verifyAccount(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) { res.status(500).json({ message: 'Server Error' });}
}

const login = async (req, res, next) => {
  try {
    const userAgent = req.headers['user-agent'];
    const result = await userServices.login(req.body, userAgent);

    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Server Error'
    });
  }
};



const getUserById = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await userServices.getUserById(userId);
    res.status(StatusCodes.OK).json(user);
  } catch (error) {
    res.status(StatusCodes.NOT_FOUND).json({ 
      message: error.message || 'User not found'
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params
    const { updateData } = req.body

    if (!updateData || typeof updateData !== 'object') {
      return res.status(400).json({ message: 'Dữ liệu cập nhật không hợp lệ' })
    }

    const updatedUser = await userServices.updateUser(userId, updateData)
    return res.status(200).json(updatedUser)
  } catch (error) {
    return res.status(500).json({ message: error.message || 'Lỗi khi cập nhật người dùng' })
  }
}

const bcrypt = require('bcryptjs')
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body
    const userId = req.params.id

    const result = await userServices.changePassword(userId, oldPassword, newPassword)
    res.status(200).json(result)
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message })
  }
}

const get2FAQrCode = async (req, res) => {
  try {
    const userId = req.params.id;
    const { qrCode } = await userServices.get2FAQrCode(userId);
    res.status(200).json({ qrCode });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Ghi nhận session sau khi quét QR code để bắt đầu 2FA
const setup2FA = async (req, res) => {
  try {
    const userId = req.params.id;
    const { otpToken } = req.body;
    if (!otpToken) {
      return res.status(400).json({ message: 'Thiếu mã OTP' });
    }
    
    const userAgent = req.headers['user-agent'];

    const session = await userServices.setup2FA(userId, otpToken, userAgent);
    res.status(200).json({ message: 'Thiết lập session 2FA thành công', session });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// ✅ Xác minh OTP từ ứng dụng Google Authenticator
const verify2FA = async (req, res) => {
  try {
    const userId = req.params.id; // ✅ lấy đúng string
    const { otpToken } = req.body;
    const userAgent = req.headers['user-agent'];

    if (!otpToken) {
      return res.status(400).json({ message: 'Thiếu mã OTP.' });
    }

    const isValid = await userServices.verify2FA(userId, otpToken, userAgent); // ✅ truyền userId là string
    if (!isValid) {
      return res.status(400).json({ message: 'Mã 2FA không hợp lệ.' });
    }

    res.status(200).json({ message: 'Xác thực 2FA thành công.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



module.exports = {
  createNew,
  verifyAccount,
  login,
  getUserById,
  updateUser,
  changePassword,
  get2FAQrCode,
  setup2FA,
  verify2FA
}
