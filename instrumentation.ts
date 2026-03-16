/**
 * Next.js Instrumentation Hook
 * Runs once when the server starts (both dev and production).
 * Used here to auto-seed the Parentesco collection if it is empty.
 * See: https://nextjs.org/docs/app/building-your-application/optimizing/instrumentation
 */
export async function register() {
    // Only run on the Node.js runtime (not Edge), to use Mongoose
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const { seedParentescos } = await import(
            '@/infrastructure/database/seedParentescos'
        );
        const { runMigrations } = await import(
            '@/infrastructure/database/runMigrations'
        );
        
        await seedParentescos();
        await runMigrations();
    }
}
