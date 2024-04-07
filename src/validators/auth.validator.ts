import joi from "joi";

export const signupValidator = joi
  .object()
  .keys({
    email: joi.string().required(),
    name: joi.string().required(),
    password: joi.string().required(),
  })
  .options({
    abortEarly: false,
  });
