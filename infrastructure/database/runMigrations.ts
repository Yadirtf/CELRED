import dbConnect from '@/infrastructure/database/mongoose';
import ReferenceModel from '@/infrastructure/models/ReferenceModel';

/**
 * Runs database migrations/repairs.
 * This is safe to run multiple times (idempotent).
 */
export async function runMigrations(): Promise<void> {
    try {
        await dbConnect();

        // 1. Fix orphan references (missing advisorId)
        const orphanResult = await ReferenceModel.updateMany(
            { 
                $or: [
                    { advisorId: { $exists: false } }, 
                    { advisorId: "" }, 
                    { advisorId: null }
                ] 
            },
            { $set: { advisorId: "SISTEMA" } }
        );

        if (orphanResult.modifiedCount > 0) {
            console.log(`[migration] ✅ Repaired ${orphanResult.modifiedCount} orphan references (assigned to 'SISTEMA').`);
        }

        // Add more migrations here as the system evolves
        
    } catch (error) {
        console.error('[migration] ⚠️ Database migration failed:', error);
    }
}
