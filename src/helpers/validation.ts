import Joi from "joi";
import { userInterface } from "../databases/interface/userInterface";
// Define the validation schema
const userSchema: Joi.ObjectSchema<userInterface> = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().min(4).max(32).required()
  });
  
  // Validation function
  const userValidate = (data: userInterface): Joi.ValidationResult<userInterface> => {
    return userSchema.validate(data);
  };
  
  export { userValidate };