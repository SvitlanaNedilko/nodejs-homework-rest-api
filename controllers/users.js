const jwt = require('jsonwebtoken')
const Users = require('../repository/users')
const { HttpCode } = require('../config/constants')
const { findByEmail, create, updateToken } = require('../repository/users')
require('dotenv').config()
const SECRET_KEY = process.env.JVT_SECRET_KEY

const registration = async (req, res, next) => {
  const { email, password, subscription } = req.body
  const user = await Users.findByEmail(email)
  if (user) {
    return res.status(HttpCode.CONFLICT).json({
      status: 'error',
      code: HttpCode.CONFLICT,
      message: 'Email is already use',
    })
  }
  try {
    const newUser = await Users.create({ email, password, subscription })
    return res.status(HttpCode.CREATED).json({
      status: 'success',
      cade: HttpCode.CREATED,
      data: {
        id: newUser.id,
        email: newUser.email,
        subscription: newUser.subscription,
      },
    })
  } catch (e) {
    next(e)
  }

  res.json()
}

const login = async (req, res, next) => {
  const { email, password } = req.body
  const user = await Users.findByEmail(email)
  const isValidPassword = await user.isValidPassword(password)
  if (!user || !isValidPassword) {
    return res.status(HttpCode.UNAUTHORIZED).json({
      status: 'error',
      code: HttpCode.UNAUTHORIZED,
      message: 'Invalide Credentional',
    })
  }
  const id = user._id
  const payload = { id }
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' })
  await Users.updateToken(id, token)
  return res.status(HttpCode.OK).json({
    status: 'success',
    code: HttpCode.OK,
    date: { token },
  })

  res.json({})
}

const logout = async (req, res, next) => {
  res.json()
}

module.exports = { registration, login, logout }
