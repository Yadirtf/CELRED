import mongoose, { Schema, Document } from 'mongoose';

export interface IUserDocument extends Document {
    name: string;
    email: string;
    password?: string;
    role: 'admin' | 'user';
    createdAt: Date;
}

const UserSchema = new Schema<IUserDocument>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'admin' },
    createdAt: { type: Date, default: Date.now },
});

export const UserModel = mongoose.models.User || mongoose.model<IUserDocument>('User', UserSchema);
