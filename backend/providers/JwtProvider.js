const JWT = require('jsonwebtoken')

const JwtProvider = {
  generateToken: async (userInfo, secretSignature, tokenLife) => {
    try {
      return JWT.sign(userInfo, secretSignature, {
        algorithm: 'HS256',
        expiresIn: tokenLife
      })
    } catch (error) {
      throw error
    }
  },

  verifyToken: async (token, secretSignature) => {
    try {
      return JWT.verify(token, secretSignature)
    } catch (error) {
      throw error
    }
  }
}

module.exports = { JwtProvider }
