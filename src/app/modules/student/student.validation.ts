import { z } from "zod";

const userNameValidationSchema = z.object({
    firstName: z.string().min(1).max(20),
    middleName: z.string().optional(),
    lastName: z.string().min(1),
})
 ;
  
  const guardianValidationSchema = z.object({
    fatherName: z.string().min(1),
    fatherOccupation: z.string().min(1),
    fatherContactNo: z.string().min(1),
    motherName: z.string().min(1),
    motherOccupation: z.string().min(1),
    motherContactNo: z.string().min(1),
  });
  
  const localGardianValidationSchema = z.object({
    name: z.string().min(1),
    occupation: z.string().min(1),
    contactNo: z.string().min(1),
    address: z.string().min(1),
  });
  
  export const studentValidationSchema = z.object({
    id: z.string(),
    password: z.string().max(20),
    name: userNameValidationSchema,
    gender: z.enum(['male', 'female', 'other']),
    dateOfBirth: z.string(),
    email: z.string().email({ message: 'Invalid email format' }),
    contactNo: z.string(),
    bloodGroup: z.enum(['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-']).optional(),
    presentAddress: z.string(),
    permanentAddress: z.string().min(1, { message: 'Permanent address is required' }),
    guardian: guardianValidationSchema,
    localGardian: localGardianValidationSchema,
    profileImg: z.string().optional(),
    isActive: z.enum(['active', 'blocked']).default('active'),
    isDeleted: z.boolean(),
  });

  export default studentValidationSchema;