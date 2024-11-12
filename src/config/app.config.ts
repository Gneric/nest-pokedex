export const EnvConfig = () => {
    return {
        enviroment: process.env.NODE_ENV || 'dev',
        port: process.env.PORT || 3000,
        defaultLimit: +process.env.DEFAULT_LIMIT || 10,
        mongodb: process.env.MONGODB
    }
}