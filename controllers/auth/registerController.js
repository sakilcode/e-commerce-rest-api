import Joi from "joi";
import { CustomErrorHandler, JwtService } from "../../services";
import { User } from "../../models";
import bcrypt from "bcrypt";

const registerController = {
    async register(req, res, next) {
        // Validation
        const registerSchema = Joi.object({
            name: Joi.string().min(3).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).required(),
            repeat_password: Joi.ref("password")
        })

        const { error } = registerSchema.validate(req.body);

        if (error) {
            return next(error);
        }

        const { name, email, password } = req.body;
        // Check if user is in the database
        try {
            const exist = await User.exists({ email })
            console.log(exist)
            if (exist) {
                return next(CustomErrorHandler.alreadyExist("This email is already exist"))
            }
        } catch (error) {
            return next(error)
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Prepare the model 
        const user = new User({
            name,
            email,
            password: hashedPassword,
        })

        let accessToken;
        try {
            const result = await user.save();

            // Token
            accessToken = JwtService.sign({ _id: result._id, role: result.role });


        } catch (error) {
            return next(error)
        }

        res.json({ accessToken })
    }
}

export default registerController;