import mongoose, { Schema, Document, Model } from 'mongoose';
import crypto from 'crypto';
import { INVITATION_EXPIRY_HOURS, CODE_LENGTH } from '../config/constants.js';

export type InvitationStatus = 'pending' | 'sent' | 'redeemed' | 'expired';

export interface IInvitation extends Document {
  fullName: string;
  email: string;
  company: string;
  nit: string;
  sector: string;
  code: string;
  status: InvitationStatus;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

interface IInvitationModel extends Model<IInvitation> {
  generateCode(): string;
}

const InvitationSchema = new Schema<IInvitation>(
  {
    fullName: {
      type: String,
      required: [true, 'Nombre completo es requerido'],
      trim: true,
      maxlength: 120,
    },
    email: {
      type: String,
      required: [true, 'Email es requerido'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email inválido'],
    },
    company: {
      type: String,
      required: [true, 'Empresa es requerida'],
      trim: true,
    },
    nit: {
      type: String,
      required: [true, 'NIT es requerido'],
      trim: true,
    },
    sector: {
      type: String,
      required: [true, 'Sector es requerido'],
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['pending', 'sent', 'redeemed', 'expired'],
      default: 'pending',
    },
    expiresAt: {
      type: Date,
      default: null,
      index: { expires: 0 },
    },
  },
  {
    timestamps: true,
  }
);

// ── Static: Generar código alfanumérico único ──
InvitationSchema.statics.generateCode = function (): string {
  return crypto
    .randomBytes(CODE_LENGTH / 2)
    .toString('hex')
    .toUpperCase();
};

// ── Pre-save: Asignar código si no existe ──
InvitationSchema.pre('save', function (next) {
  if (!this.code) {
    this.code = crypto
      .randomBytes(CODE_LENGTH / 2)
      .toString('hex')
      .toUpperCase();
  }
  next();
});

// ── Método de instancia: Marcar como enviado con expiración ──
InvitationSchema.methods.markAsSent = function () {
  this.status = 'sent';
  this.expiresAt = new Date(Date.now() + INVITATION_EXPIRY_HOURS * 60 * 60 * 1000);
  return this.save();
};

export const Invitation = mongoose.model<IInvitation, IInvitationModel>(
  'Invitation',
  InvitationSchema
);
