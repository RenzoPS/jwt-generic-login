// Generar el token JWT

export function createAccessToken(payload){
    return new Promise((resolve, reject) => {
        jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }, (err, token) => {
            if(err){
                return reject(err)
            }
            resolve(token)
        })
    })
}
