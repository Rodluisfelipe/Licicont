import mongoose, { Schema, Document } from 'mongoose';

export interface ILead extends Document {
  fullName: string;
  company: string;
  phone: string;
  email?: string;
  /** Respuestas del diagnóstico: { [questionId]: optionValue } */
  answers: Record<string, string>;
  recommendedService: string;
  recommendedServiceName: string;
  complements: string[];
  affinity: number;
  createdAt: Date;
  updatedAt: Date;
}

const LeadSchema = new Schema<ILead>(
  {
    fullName: {
      type: String,
      required: [true, 'Nombre completo es requerido'],
      trim: true,
      maxlength: 120,
    },
    company: {
      type: String,
      required: [true, 'Empresa es requerida'],
      trim: true,
      maxlength: 160,
    },
    phone: {
      type: String,
      required: [true, 'Teléfono es requerido'],
      trim: true,
      maxlength: 40,
    },
    email: {
      type: String,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    answers: {
      type: Map,
      of: String,
      default: {},
    },
    recommendedService: {
      type: String,
      required: true,
      index: true,
    },
    recommendedServiceName: {
      type: String,
      required: true,
    },
    complements: {
      type: [String],
      default: [],
    },
    affinity: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Lead = mongoose.model<ILead>('Lead', LeadSchema);
