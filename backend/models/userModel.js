const mongoose = require('mongoose')
const Joi = require('joi')
const { EMAIL_RULE, EMAIL_RULE_MESSAGE } = require('../utils/validators')

// Định nghĩa role
const USER_ROLES = {
  CLIENT: 'client',
  ADMIN: 'admin'
}

// Tạo Schema bằng Mongoose
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
  role: {
    type: String,
    enum: Object.values(USER_ROLES),
    default: USER_ROLES.CLIENT
  },
  isActive: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String
  },
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

// Khai báo Model
const User = mongoose.model('User', userSchema)

// Validation với Joi
const USER_COLLECTION_SCHEMA = Joi.object({
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required().trim().strict(),
  displayName: Joi.string().required().trim().strict(),
  avatar: Joi.string().default(null),
  role: Joi.string().valid(USER_ROLES.CLIENT, USER_ROLES.ADMIN).default(USER_ROLES.CLIENT),
  isActive: Joi.boolean().default(false),
  verifyToken: Joi.string(),
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
    throw new Error(error)
  }
}

const findOneById = async (userId) => {
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

// Export theo CommonJS
module.exports = {
  userModel: {
    USER_ROLES,
    USER_COLLECTION_SCHEMA,
    createNew,
    findOneById,
    findOneByEmail,
    update
  }
}
