// VALIDATION 

const Joi = require("@hapi/joi");

// Register Validation

const registerValidation = (data) => {
    const schema = Joi.object().keys({
        firstname : Joi.string().min(5).required(),
        lastname : Joi.string().min(3).required(),
        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required(),
        role : Joi.string().min(5).required()
    });


    return schema.validate(data)

}

// Login Validation

const loginValidation = (data) => {
    const schema = Joi.object({
       
        email : Joi.string().min(6).required().email(),
        password : Joi.string().min(6).required()
    });

    return schema.validate(data);

}
module.exports.loginValidation = loginValidation;
module.exports.registerValidation = registerValidation;