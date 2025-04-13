const mongoose = require('mongoose')
const Joi = require('joi')
const { EMAIL_RULE, EMAIL_RULE_MESSAGE } = require('../utils/validators')
const ApiError = require('../utils/ApiError')
const { StatusCodes } = require('http-status-codes');
const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

// Tạo Schema người dùng
const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    match: EMAIL_RULE,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true,
    trim: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String,
    default: null
  },
  bio: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CLIENT
  },
  isActive: {
    type: Boolean,
    default: false
  },
  require_2fa: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String
  },
  twoFactorSecretKey: {
    type: String,
    default: null
  },
  sessions: [
    {
      device_id: { type: String, required: true },
      is_2fa_verified: { type: Boolean, default: false },
      last_login: { type: Date, default: Date.now }
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: null
  },
  _destroy: {
    type: Boolean,
    default: false
  }
})

const User = mongoose.model('User', userSchema)

// Validation với Joi
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  bio: Joi.string().default('Chưa cập nhật'),
  role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN).default(USER_ROLES.CLIENT),
  isActive: Joi.boolean().default(false),
  require_2fa: Joi.boolean().default(false),
  verifyToken: Joi.string(),
  twoFactorSecretKey: Joi.string().allow(null),
  sessions: Joi.array().items(
    Joi.object({
      device_id: Joi.string().required(),
      is_2fa_verified: Joi.boolean().default(false),
      last_login: Joi.date().timestamp('javascript').default(Date.now())
    })
  ).default([]),
  createdAt: Joi.date().timestamp('javascript').default(Date.now()),
  updatedAt: Joi.date().timestamp('javascript').default(null),
  _destroy: Joi.boolean().default(false)
})

const INVALID_UPDATE_FIELDS = ['_id', 'email', 'username', 'createdAt']

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false })
}

// Thao tác với Model
const createNew = async (data) => {
  try {
    const validData = await validateBeforeCreate(data)
    const newUser = new User(validData)
    return await newUser.save()
  } catch (error) {
    // Nếu là lỗi duplicate key (MongoDB error code 11000)
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern)[0] // Lấy tên field bị trùng
      throw new ApiError(StatusCodes.CONFLICT, `${duplicateField} đã được sử dụng.`)
    }

    // Nếu là lỗi Joi validate
    if (error.isJoi) {
      throw new ApiError(StatusCodes.BAD_REQUEST, error.message)
    }

    // Các lỗi khác
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Lỗi tạo tài khoản.')
  }
}

const findById = async (userId) => {
  try {
    return await User.findById(userId)
  } catch (error) {
    throw new Error(error)
  }
}

const findOneByEmail = async (emailValue) => {
  try {
    return await User.findOne({ email: emailValue })
  } catch (error) {
    throw new Error(error)
  }
}

const update = async (userId, updateData) => {
  try {
    INVALID_UPDATE_FIELDS.forEach((field) => delete updateData[field])
    return await User.findByIdAndUpdate(userId, updateData, { new: true })
  } catch (error) {
    throw new Error(error)
  }
}

module.exports = {
  User,
  USER_ROLES,
  USER_COLLECTION_SCHEMA,
  createNew,
  findById,
  findOneByEmail,
  update
}