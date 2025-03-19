import 'dotenv/config'

const config = {
    port: process.env.PORT,
    frontendUrl: process.env.FRONTEND_API_URL
}

export default Object.freeze(config);