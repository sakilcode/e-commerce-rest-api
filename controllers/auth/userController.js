import { User } from "../../models";
import {CustomErrorHandler} from "../../services";

const userController = {
    async me(req, res, next){
        try {
            const user = await User.findOne({ _id: req.user._id }).select('-password -updatedAt -createdAt -__v');

            if(!user){
                return next(CustomErrorHandler.notFound());
            }

            res.status(200).json(user)

        } catch (error) {
            return next(error)
        }
    }
}

export default userController;