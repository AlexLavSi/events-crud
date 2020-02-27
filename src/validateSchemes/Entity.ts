import Joi from "joi";

export const entityScheme =  Joi.object({
    name: Joi.string().required()
});