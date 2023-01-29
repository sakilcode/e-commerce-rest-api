import Joi from "joi";
import { CustomErrorHandler, JwtService } from "../../services";
import { RefreshToken, User } from "../../models";
import { REFRESH_SECRET } from "../../config";

const refreshController = {
    async refresh(req, res, next) {
        // Validation
        const refreshSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })

        const { error } = refreshSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        let refresh_token;
        try {
            refresh_token = await RefreshToken.findOne({ token: req.body.refresh_token })
            if (!refresh_token) {
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
            }

            let userId;
            try {
                const { _id } = await JwtService.verify(refresh_token.token, REFRESH_SECRET);
                userId = _id;

            } catch (error) {
                return next(CustomErrorHandler.unAuthorized("Invalid refresh token"));
            }

            const user = await User.findOne({ _id: userId });
            if(!user) {
                return next(CustomErrorHandler.unAuthorized("No user found"));
            }

            // Generate the token 
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const newRefreshToken = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            // Database whitelist
            await RefreshToken.create({ token: newRefreshToken })

            return res.json({ access_token, refresh_token: newRefreshToken })

        } catch (error) {
            return next(error)
        }

    }
}

export default refreshController;