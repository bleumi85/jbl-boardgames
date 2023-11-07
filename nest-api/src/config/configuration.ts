export const configuration = () => ({
    app: {
        nodeEnv: process.env.NODE_ENV,
        port: parseInt(process.env.PORT, 10),
        showSwagger: JSON.parse(process.env.SHOW_SWAGGER),
    },
    jwt: {
        secret: process.env.JWT_SECRET,
        expTime: parseInt(process.env.JWT_EXP_TIME, 10),
        refreshExpTime: parseInt(process.env.JWT_REFRESH_EXP_TIME, 10),
    },
});
