import mongoose, { Schema, Document } from 'mongoose';

export interface ISettings extends Document {
    advisors: {
        number: string;
        imageUrl?: string;
        name?: string;
    }[];
    referralMessage: string;
    updatedAt: Date;
}

const SettingsSchema: Schema = new Schema({
    advisors: [{
        number: { type: String, required: true },
        imageUrl: { type: String },
        name: { type: String }
    }],
    referralMessage: {
        type: String,
        default: '¡Hola {nombre_referido}! \uD83D\uDE0A ¿Cómo vas? Te escribo de parte de {nombre_comprador}, quien nos recomendó contigo. \n\nPasaba por aquí para poner a tu disposición nuestro catálogo, ya que contamos con gran variedad de marcas y modelos para entrega inmediata. \uD83D\uDCF1\u2728\n\nLo mejor de todo es que tenemos las mayores facilidades del mercado:\n\u2705 ¡Desde $0 de cuota inicial! (Aprobamos incluso si estás reportado o sin historial).\n\u2705 Créditos rápidos con Addi, Sistecredito, SuCupo y Krediya.\n\u2705 Compras de contado con precios especiales.\n\n¡Estrenar es más fácil de lo que crees! ¿Te gustaría que te enviara nuestro catálogo de hoy para que nos conozcas?'
    },
}, { timestamps: true });

export default mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);
