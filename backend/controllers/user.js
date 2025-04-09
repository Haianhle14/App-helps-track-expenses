const { StatusCodes } = require('http-status-codes');
const userServices = require('../service/userService')


const createNew = async (req, res, next) => {
  try {
    const createUser = await userServices.createNew(req.body)
    res.status(StatusCodes.CREATED).json(createUser)
  }
  catch (error) { 
    // Trả về thông báo lỗi chi tiết hơn
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
    const result = await userServices.login(req.body)
    res.status(StatusCodes.OK).json(result)
  } catch (error) {
    res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: error.message || 'Server Error'
    })
  }
}


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

module.exports = {
  createNew,
  verifyAccount,
  login,
  getUserById
};