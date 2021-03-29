/** @format */
const Joi = require("joi");

function registerValidation(body) {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().min(3).email().required(),
    password: Joi.string().min(6),
    password2: Joi.string().min(6),
  });
  const value = schema.validate(body);
  return value;
}
function loginValidation(body2) {
  const schema = Joi.object({
    email: Joi.string().min(3).email().required(),
    password: Joi.string().min(6),
  });
  const value = schema.validate(body2);
  return value;
}

module.exports = { registerValidation, loginValidation };
