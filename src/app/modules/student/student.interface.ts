// import { Schema, model, connect } from 'mongoose';

import { Model } from "mongoose";


export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGardian = {
  name: string;
  occupation: string;
  contactNo: string;
  address: string;
};

export type TStudent = {
  id: string;
  password: string;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  email: string;
  contactNo?: string;
  emergencyContactNo?: string;
  bloodGroup?: 'A+' | 'A-' | 'AB+' | 'AB-' | 'B+' | 'B-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGardian: TLocalGardian;
  profileImg?: string;
  isActive: 'active' | 'blocked';
  isDeleted: boolean;
};
//for creating static

export interface StudentModel extends Model<TStudent> {
  isUserExists(id:string): Promise<TStudent | null>
}



//for creating instance

// export interface StudentMethod {
//   isUserExists(id: string): Promise<TStudent | null>;
// }

// export type StudentModel = Model<TStudent, Record<string, never>, StudentMethod>;