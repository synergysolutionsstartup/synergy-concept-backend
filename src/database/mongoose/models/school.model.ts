import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface SchoolDocument extends Document {
  id: string;
  userId: string;
  name: string;
  email: string;
  state: string;
  country: string;
  address: string;
  phoneNumber1: string;
  phoneNumber2?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const SchoolSchema = new Schema<SchoolDocument>(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toHexString(),
      immutable: true,
    },
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    address: { type: String, required: true },
    phoneNumber1: { type: String, required: true },
    phoneNumber2: { type: String, default: null },
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

export const SchoolModel: Model<SchoolDocument> =
  models.School || model<SchoolDocument>("School", SchoolSchema);
