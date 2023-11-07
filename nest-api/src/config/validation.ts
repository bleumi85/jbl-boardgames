import Joi from 'joi';
import { NodeEnv } from 'src/utils/enums';

export const validationSchema = Joi.object({
    // Application
    NODE_ENV: Joi.string().valid(NodeEnv.Dev, NodeEnv.Prod, NodeEnv.Test, NodeEnv.Prov).default(NodeEnv.Dev),
    PORT: Joi.number().default(3001),
    SHOW_SWAGGER: Joi.boolean().default(false),
    // Postgres
    POSTGRES_HOST: Joi.string().required(),
    POSTGRES_PORT: Joi.number().required(),
    POSTGRES_USER: Joi.string().required(),
    POSTGRES_PASSWORD: Joi.string().required(),
    POSTGRES_DB: Joi.string().required(),
    // JWT
    JWT_SECRET: Joi.string().required(),
    JWT_EXP_TIME: Joi.number().required(),
    JWT_REFRESH_EXP_TIME: Joi.number().required(),
});
