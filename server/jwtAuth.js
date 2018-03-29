const jwt = require('jsonwebtoken')

module.exports = function(secret) {
  return {
    sign: function(message) {
      return new Promise((resolve, reject) => {
        jwt.sign(message, secret, (err, token) => {
          if (err) reject(new Error(err))
          else resolve(token)
        })
      })
    },

    verify: function(token) {
      return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
          if (err) reject(new Error(err))
          else resolve(decoded)
        })
      })
    }
  }
}
