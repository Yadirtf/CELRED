import dbConnect from '@/infrastructure/database/mongoose';
import ParentescoModel from '@/infrastructure/models/ParentescoModel';

const DEFAULT_PARENTESCOS = [
    // Familia Directa
    'Padre / Madre',
    'Hijo / Hija',
    'Esposo / Esposa',
    'Pareja / Novio / Novia',
    // Familia Extendida
    'Hermano / Hermana',
    'Abuelo / Abuela',
    'Nieto / Nieta',
    'Tío / Tía',
    'Sobrino / Sobrina',
    'Primo / Prima',
    // Familia Política
    'Suegro / Suegra',
    'Cuñado / Cuñada',
    'Yerno / Nuera',
    // Círculo Social
    'Amigo / Amiga',
    'Mejor amigo / Mejor amiga',
    'Vecino / Vecina',
    'Conocido / Conocida',
    'Padrino / Madrina',
    'Ahijado / Ahijada',
    // Ámbito Laboral
    'Compañero de trabajo',
    'Jefe / Jefa',
    'Socio / Socia de negocios',
    'Cliente',
    'Empleado / Empleada',
];

/**
 * Seeds the Parentesco collection with the default list.
 * Uses upsert per entry — safe to run on every restart.
 * New entries are added; existing ones (matched by nombre) are left untouched.
 */
export async function seedParentescos(): Promise<void> {
    try {
        await dbConnect();

        const ops = DEFAULT_PARENTESCOS.map(nombre => ({
            updateOne: {
                filter: { nombre },
                update: { $setOnInsert: { nombre, activo: true } },
                upsert: true,
            },
        }));

        const result = await ParentescoModel.bulkWrite(ops, { ordered: false });
        const inserted = result.upsertedCount ?? 0;

        if (inserted > 0) {
            console.log(`[seed] ✅ Parentesco: ${inserted} nueva(s) opción(es) insertada(s).`);
        } else {
            console.log(`[seed] Parentesco: sin cambios (todos los registros ya existen).`);
        }
    } catch (error) {
        console.error('[seed] ⚠️ Failed to seed Parentesco collection:', error);
    }
}
