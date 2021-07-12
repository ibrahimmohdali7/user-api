const Joi = require('joi')

const registerValidation = data => {
  const schema = {
    email: Joi.string()
      .min(7)
      .required()
      .email(),
    password: Joi.string()
      .min(7)
      .required()
  };
  return Joi.validate(data, schema)
};

const loginValidation = data => {
  const schema = {
    email: Joi.string()
      .min(7)
      .required()
      .email(),
    password: Joi.string()
      .min(7)
      .required()
  };
  return Joi.validate(data, schema)
};

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;

