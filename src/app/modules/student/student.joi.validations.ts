import Joi from "joi";

const userNameValidationSchema = Joi.object({
    firstName: Joi.string()
      .required()
      .trim()
      .max(20)
      .pattern(/^[A-Z][a-z]*$/, { name: 'capitalize' })
      .message('First name should be capitalized'),
    middleName: Joi.string().trim(),
    lastName: Joi.string()
      .required()
      .trim()
      .pattern(/^[A-Za-z]+$/, { name: 'alphabet' })
      .message('Last name should contain only alphabets'),
  });
  
  const guardianValidationSchema = Joi.object({
    fatherName: Joi.string().required().trim(),
    fatherOccupation: Joi.string().required().trim(),
    fatherContactNo: Joi.string().required().trim(),
    motherName: Joi.string().required().trim(),
    motherOccupation: Joi.string().required().trim(),
    motherContactNo: Joi.string().required().trim(),
  });
  
  const localGardianValidationSchema = Joi.object({
    name: Joi.string().required().trim(),
    occupation: Joi.string().required().trim(),
    contactNo: Joi.string().required().trim(),
    address: Joi.string().required().trim(),
  });
  
  const studentValidationSchema = Joi.object({
    id: Joi.string().required(),
    name: userNameValidationSchema.required().messages({ 'any.required': 'Student name is required' }),
    gender: Joi.string().valid('male', 'female', 'other').required().trim(),
    dateOfBirth: Joi.string(),
    email: Joi.string().email().required(),
    contactNo: Joi.string().required(),
    bloodGroup: Joi.string().valid('A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'),
    presentAddress: Joi.string().required(),
    permanentAddress: Joi.string().required().trim(),
    guardian: guardianValidationSchema.required().messages({ 'any.required': 'Guardian information is required' }),
    localGardian: localGardianValidationSchema.required().messages({ 'any.required': 'Local guardian information is required' }),
    profileImg: Joi.string(),
    isActive: Joi.string().valid('active', 'blocked').default('active'),
  });

  export default studentValidationSchema;