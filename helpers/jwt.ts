import { expressjwt } from 'express-jwt';

// @ts-ignore
async function isRevoked(req, token) {
    if (token.payload.isAdmin == false) {
        return true;
    }
    return false;
}

function authJwt() {
    const api = process.env.API_URL as string;
    return expressjwt({
        secret: process.env.JWT_SECRET as string,
        algorithms: ['HS256'],
        // @ts-ignore
        isRevoked,
    }).unless({
        path: [
            // { url: /\/public\/uploads(.*)/, methods: ['GET', 'OPTIONS'] },
            // { url: /\/api\/v1\/product(.*)/, methods: ['GET', 'OPTIONS'] },
            // { url: /\/api\/v1\/category(.*)/, methods: ['GET', 'OPTIONS'] },
            // {
            //     url: /\/api\/v1\/orders(.*)/,
            //     methods: ['GET', 'OPTIONS', 'POST'],
            // },
            // `${api}/auth/login`,
            // `${api}/auth/register`,
            { url: /(.*)/ },
        ],
    });
}

export default authJwt;
