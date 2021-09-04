import Joi from '@hapi/joi';

const registrationValidator = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(6).required().alphanum(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required(),
        wantsSpam: Joi.string()
    })
    return schema.validate(data);
}

const loginValidator = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(6).required(),
        password: Joi.string().min(6).required()
    })
    return schema.validate(data);
}

export {registrationValidator,loginValidator};