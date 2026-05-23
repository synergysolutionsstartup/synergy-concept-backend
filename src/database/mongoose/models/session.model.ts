import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface SessionDocument extends Document {
  id: string;
  schoolId: string;
  year: string;
  term: string;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const SessionSchema = new Schema<SessionDocument>(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toHexString(),
      immutable: true,
    },
    schoolId: { type: String, required: true },
    year: { type: String, required: true },
    term: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
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

export const SessionModel: Model<SessionDocument> =
  models.Session || model<SessionDocument>("Session", SessionSchema);
