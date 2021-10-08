const Joi = require('joi')

const schemaContact = Joi.object({
  name: Joi.string().alphanum().min(2).max(20).required(),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: true,
  }),
  phone: Joi.number().integer().positive().required(),
})

const schemaUpdate = Joi.object({
  name: Joi.string().alphanum().min(2).max(20),
  email: Joi.string().email({
    minDomainSegments: 2,
    tlds: true,
  }),
  phone: Joi.number().integer().positive(),
}).min(1)

const schemaContactID = Joi.object({
  contactId: Joi.number().required(),
})

const validate = async (schema, obj, res, next) => {
  try {
    const value = await schema.validateAsync(obj)
    next()
  } catch (err) {
    console.log(err)
    res.status(400).json({
      status: 'error',
      code: 400,
      message: `Filed ${err.message.replace(/"/g, '')}`,
    })
  }
}

module.exports.validateContact = async (req, res, next) => {
  return await validate(schemaContact, req.body, res, next)
}

module.exports.validateUpdateContact = async (req, res, next) => {
  return await validate(schemaUpdate, req.body, res, next)
}

module.exports.validateContactId = async (req, res, next) => {
  return await validate(schemaContactID, req.params, res, next)
}
