import { CustomErrorHandler, JwtService } from "../services";

const auth = async (req, res, next) => {
    let authToken = req.headers.auth_token;

    if (!authToken) {
        return next(CustomErrorHandler.unAuthorized())
    }

    try {
        const { _id, role } = await JwtService.verify(authToken);
        req.user = { _id, role };

        next()

    } catch (error) {
        next(CustomErrorHandler.unAuthorized())
    }
}

export default auth;