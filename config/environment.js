const development = {
    name: 'development',
    asset_path: '/assets',
    session_cookie_key: 'blahsomething',
    db: 'codial_development',
    smtp: {
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        auth: {
            user: 'ag4919411@gmail.com',
            pass: 'izlqrgcejtxlbqyr'
        }
    },

    google_client_id: "786190956504-64ov7laa6n0j57errp8ptlskufqq268h.apps.googleusercontent.com",
    google_client_secret: "1NfDBMM7sShGUjg7xPmHzwhv",
    google_call_back_url: "http://localhost:8000/users/auth/google/callback",
    jwt_secret: 'codial'

}

const production = {
    name: 'production'
}


module.exports = development;