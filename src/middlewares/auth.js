const jwt = require('jsonwebtoken')
const helpers = require('../helpers/helper')
const privateKey = process.env.PRIVATEKEY

const verivyAccess = (req, res, next) => {
  const auth = req.headers.authorization
  if (!auth) {
    return helpers.response(res, null, 401, {
      message: 'Invalid Token'
    })
  }
  const token = auth.split(' ')
  jwt.verify(token[1], privateKey, function (err, decoded) {
    console.log('AUTHEN BERJALAN');
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return helpers.response(res, null, 401, {
          message: 'TOKEN expired'
        })
      } else if (err.name === 'JsonWebTokenError') {
        return helpers.response(res, null, 401, {
          message: 'invalid TOKEN'
        })
      } else if (err.name === 'NotBeforeError') {
        return helpers.response(res, null, 401, {
          message: 'TOKEN not active'
        })
      }
    } else {
      if(decoded.role === 1){ //ROLE ADMIN
        console.log(decoded);
        next()
      }else{
        if(decoded.id === req.body.userId){
        console.log('ini userid', req.params.id);
        console.log('decode id', decoded.id);
        next()
        } else{
          console.log(req.body);
          console.log(decoded.id);
          console.log(req.params.id);
          return helpers.response(res, null, 401, {
            message: 'Unauthorized coy'
          })
        }
      }
    }
  })
}

const verivyProfil = (req, res, next) => {
  const auth = req.params
  if (!auth) {
    return helpers.response(res, null, 401, {
      message: 'Invalid Token'
    })
  }
  jwt.verify(auth, privateKey, function (err, decoded) {
    console.log('AUTHEN BERJALAN');
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return helpers.response(res, null, 401, {
          message: 'TOKEN expired'
        })
      } else if (err.name === 'JsonWebTokenError') {
        return helpers.response(res, null, 401, {
          message: 'invalid TOKEN'
        })
      } else if (err.name === 'NotBeforeError') {
        return helpers.response(res, null, 401, {
          message: 'TOKEN not active'
        })
      }
    } else {
      if(decoded.role === 1){ //ROLE ADMIN
        console.log(decoded);
        next()
      }else{
        if(decoded.id === req.params.id){
        console.log('ini userid', req.params.id);
        console.log('decode id', decoded.id);
        next()
        } else{
          return helpers.response(res, 'ada yang salh', 401, {
            message: 'Unauthorized coy'
          })
        }
      }
    }
  })
}

module.exports = {
  verivyAccess,
  verivyProfil
}
