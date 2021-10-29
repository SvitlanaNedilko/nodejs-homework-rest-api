const guard = require('../helpers/guard')
const passport = require('passport')
require('../config/passport')
const { HttpCode } = require('../config/constants')

describe('Unit test guard helper', () => {
  const user = { token: '1234546789' }
  let req, res, next

  beforeEach(() => {
    req = { get: jest.fn((header) => `Bearer ${user.token}`), user }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    }
    next = jest.fn()
  })

  it('User exist', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => cb(null, user)
    )
    await guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
  })

  it('User exist but have wrong token', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) =>
        cb(null, { token: '12345' })
    )
    await guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(HttpCode.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalled()
  })

  it('User not exist', async () => {
    passport.authenticate = jest.fn(
      (strategy, options, cb) => (req, res, next) => cb(null, false)
    )
    await guard(req, res, next)
    expect(req.get).toHaveBeenCalled()
    expect(res.status).toHaveBeenCalledWith(HttpCode.UNAUTHORIZED)
    expect(res.json).toHaveBeenCalled()
  })
})
