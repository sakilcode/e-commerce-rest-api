import Joi from "joi";
import { CustomErrorHandler, JwtService } from "../../services";
import { User } from "../../models";
import bcrypt from "bcrypt";

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
            const accessToken = JwtService.sign({ _id: user._id, role: user.role });
            return res.json({ accessToken })

        } catch (error) {
            return next(error)
        }

    }
}

export default loginController;