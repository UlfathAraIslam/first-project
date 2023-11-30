import { Schema, model } from 'mongoose';
import validator from 'validator';
import { TGuardian, TLocalGardian, TStudent, StudentModel, TUserName } from './student.interface';
import bcrypt from 'bcrypt'
import config from '../../config';

const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true,'first name is required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 charecters'],
    validate: {
      validator: function(value: string){
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        return firstNameStr === value;
      },
      message: '{VALUE} is not in capitalize format'
    }
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    trim: true,
    required: [true,'last name is required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid'
    }
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father name is required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father occupation is required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father contact number is required'],
    trim: true,
  },
  motherName: {
    type: String,
    required: [true, 'Mother name is required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother occupation is required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother contact number is required'],
    trim: true,
  },
});

const localGardianSchema = new Schema<TLocalGardian>({
  name: {
    type: String,
    required: [true, 'Local guardian name is required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local guardian occupation is required'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian contact number is required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Local guardian address is required'],
    trim: true,
  },
});

const studentSchema = new Schema<TStudent,StudentModel>({
  id: { type: String, required: [true, 'ID is required'], unique: true },
  password: { type: String, required: [true, 'password is required'], maxlength: [20, 'Password can not be more than 20 characters'] },
  name: {
    type: userNameSchema,
    required:[true, 'Student name is required'],
  },
  gender: {
    type:String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not valid'
    },
    required: [true, 'Gender is required'],
    trim: true,
  },
  dateOfBirth: { type: String },
  email: { 
    type: String, 
    required: true, 
    unique: true ,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a valid email type'
    }
  },
  contactNo: { type: String, required: true },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'AB+', 'AB-', 'B+', 'B-', 'O+', 'O-'],
  },
  presentAddress: { type: String, required: true },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required'],
    trim: true,
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian information is required'],
  },
  localGardian: {
    type: localGardianSchema,
    required: [true, 'Local guardian information is required'],
  },
  profileImg: { type: String },

  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
  isDeleted: {
    type: Boolean,
    default: false,
  }
},{
  toJSON: {
    virtuals: true,
  }
});

//virtual

studentSchema.virtual('fullName').get(function(){
  return (
    `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`
  )
})

//pre save middleware/hook : will work on create() save()
studentSchema.pre('save',async function(next){
  // console.log(this, 'pre hook : we will save the data');

  // const user = this;
  //hashing password and save into DB
  this.password = await bcrypt.hash(this.password,Number(config.bcrypt_salt_rounds));
  next()
})

//post save middleware / hook
studentSchema.post('save', function(doc,next){

  doc.password= '';
  next()
});

//query middleware

studentSchema.pre('find', function(next){
  this.find({isDeleted: {$ne: true}})
  next()
})
studentSchema.pre('findOne', function(next){
  this.find({isDeleted: {$ne: true}})
  next()
})

//[ {$match: { isDeleted : { $ne: true}}} , { '$match': { id: '18'}}]

studentSchema.pre('aggregate', function(next){
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true}}});
  next()
})

//creating a custom static method

studentSchema.statics.isUserExists = async function(id){
  const existingUser = await Student.findOne({id});

  return existingUser;
}


//creating a custom instance method
// studentSchema.methods.isUserExists = async function(id: string){
//   const existingUser = await Student.findOne({ id});

//   return existingUser;
// }

export const Student = model<TStudent,StudentModel>('Student', studentSchema);
