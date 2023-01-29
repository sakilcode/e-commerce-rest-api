import Joi from "joi";
import { CustomErrorHandler, JwtService } from "../../services";
import { RefreshToken, User } from "../../models";
import bcrypt from "bcrypt";
import { REFRESH_SECRET } from "../../config";

const loginController = {
    async login(req, res, next) {
        // Validation
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).required(),
        })

        const { error } = loginSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email })
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials("Invalid credentials"))
            }

            // Compare the password
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                return next(CustomErrorHandler.wrongCredentials("Invalid credentials"))
            }

            // Generate the token 
            const access_token = JwtService.sign({ _id: user._id, role: user.role });
            const refresh_token = JwtService.sign({ _id: user._id, role: user.role }, '1y', REFRESH_SECRET);

            // Database whitelist
            await RefreshToken.create({ token: refresh_token })

            return res.json({ access_token, refresh_token })

        } catch (error) {
            return next(error)
        }

    },

    async logout(req, res, next) {
        // Validation
        const logoutSchema = Joi.object({
            refresh_token: Joi.string().required(),
        })

        const { error } = logoutSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        try {
            await RefreshToken.deleteOne({ token: req.body.refresh_token })

        } catch (error) {
            return next(new Error("Something went wrong in the database"))
        }
        res.status(200).json({ status: 1 })
    }
}

export default loginController;