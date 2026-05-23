import mongoose, { Schema, model, models, Model, Document } from "mongoose";

export interface SectionDocument {
  id: string;
  classId: string;
  section: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ClassDocument extends Document {
  id: string;
  schoolId: string;
  name: string;
  sections: SectionDocument[];
  createdAt: Date;
  updatedAt: Date;
}

const SectionSchema = new Schema<SectionDocument>(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toHexString(),
      immutable: true,
    },
    classId: { type: String, required: true },
    section: { type: String, required: true },
  },
  {
    timestamps: true,
    _id: false,
  }
);

const ClassSchema = new Schema<ClassDocument>(
  {
    id: {
      type: String,
      default: () => new mongoose.Types.ObjectId().toHexString(),
      immutable: true,
    },
    schoolId: { type: String, required: true },
    name: { type: String, required: true },
    sections: { type: [SectionSchema], default: [] },
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

export const ClassModel: Model<ClassDocument> =
  models.Class || model<ClassDocument>("Class", ClassSchema);
