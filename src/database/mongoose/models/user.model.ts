import mongoose, { Schema, model, models, Model, Document } from "mongoose";
import { UserRole } from "@src/_types/account/enums.type";

export interface BaseProfileSubDoc {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  gender?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface StudentProfileSubDoc extends BaseProfileSubDoc {
  dob?: Date | null;
  parents?: string | null;
  currentClass?: string | null;
}

export interface StaffProfileSubDoc extends BaseProfileSubDoc {
  department?: string | null;
  hireDate?: Date | null;
  subRoles: string[];
}

export interface ParentProfileSubDoc extends BaseProfileSubDoc {
  children?: string | null;
}

export interface SuperAdminProfileSubDoc extends BaseProfileSubDoc {
  office?: string | null;
}

export interface AdminProfileSubDoc extends BaseProfileSubDoc {}

export interface UserDocument extends Document {
  id: string;
  email: string;
  password: string;
  role: UserRole;
  schoolId: string;
  verified: boolean;
  isApproved: boolean;
  refreshToken?: string | null;
  verificationToken?: string | null;
  verificationTokenExpiresAt?: Date | null;
  passwordResetToken?: string | null;
  passwordResetTokenExpiresAt?: Date | null;
  adminProfile?: AdminProfileSubDoc | null;
  studentProfile?: StudentProfileSubDoc | null;
  staffProfile?: StaffProfileSubDoc | null;
  parentProfile?: ParentProfileSubDoc | null;
  superAdminProfile?: SuperAdminProfileSubDoc | null;
  createdAt: Date;
  updatedAt: Date;
}

const profileBaseSchema = new Schema(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toHexString(),
      immutable: true,
    },
    userId: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    gender: { type: String, default: null },
  },
  { _id: false, timestamps: true }
);

const studentProfileSchema = new Schema(
  {
    ...profileBaseSchema.obj,
    dob: { type: Date, default: null },
    parents: { type: String, default: null },
    currentClass: { type: String, default: null },
  },
  { _id: false, timestamps: true }
);

const staffProfileSchema = new Schema(
  {
    ...profileBaseSchema.obj,
    department: { type: String, default: null },
    hireDate: { type: Date, default: null },
    subRoles: { type: [String], default: [] },
  },
  { _id: false, timestamps: true }
);

const parentProfileSchema = new Schema(
  {
    ...profileBaseSchema.obj,
    children: { type: String, default: null },
  },
  { _id: false, timestamps: true }
);

const superAdminProfileSchema = new Schema(
  {
    ...profileBaseSchema.obj,
    office: { type: String, default: null },
  },
  { _id: false, timestamps: true }
);

const adminProfileSchema = new Schema(
  {
    ...profileBaseSchema.obj,
  },
  { _id: false, timestamps: true }
);

const UserSchema = new Schema<UserDocument>(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      required: true,
    },
    schoolId: { type: String, required: true, default: "NA" },
    verified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
    verificationToken: { type: String, default: null },
    verificationTokenExpiresAt: { type: Date, default: null },
    passwordResetToken: { type: String, default: null },
    passwordResetTokenExpiresAt: { type: Date, default: null },
    adminProfile: { type: adminProfileSchema, default: null },
    studentProfile: { type: studentProfileSchema, default: null },
    staffProfile: { type: staffProfileSchema, default: null },
    parentProfile: { type: parentProfileSchema, default: null },
    superAdminProfile: { type: superAdminProfileSchema, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret) => {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
    toObject: {
      virtuals: true,
      transform: (_doc, ret) => {
        if (ret._id) {
          ret.id = ret._id.toString();
        }
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

UserSchema.virtual("id").get(function (this: UserDocument) {
  return this._id?.toHexString();
});

export const UserModel: Model<UserDocument> =
  models.User || model<UserDocument>("User", UserSchema);
