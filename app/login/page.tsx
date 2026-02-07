'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ShieldCheck, Lock, User } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [isRegistering, setIsRegistering] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });

    useEffect(() => {
        // Check if system is initialized (has admin)
        fetch('/api/auth/check-init')
            .then(res => res.json())
            .then(data => {
                // If NOT initialized, show Register form
                if (!data.initialized) {
                    setIsRegistering(true);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

        try {
            const res = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Autenticación fallida');
            }

            // Redirect to admin on success
            router.push('/admin');
            router.refresh();

        } catch (err: any) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return (
        <div className="flex h-screen items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/20 blur-[120px]"></div>
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] rounded-full bg-purple-500/20 blur-[100px]"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-cyan-500/20 blur-[80px]"></div>
            </div>

            <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl border border-white/20 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-500/20 rounded-full flex items-center justify-center mb-4 border border-blue-400/30">
                        <Lock className="h-8 w-8 text-blue-400" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-white">
                        {isRegistering ? 'Configuración Inicial' : 'Iniciar Sesión'}
                    </h2>
                    <p className="mt-2 text-sm text-gray-300">
                        {isRegistering
                            ? 'Registra al administrador principal del sistema.'
                            : 'Accede al panel de administración de CelRed.'}
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {isRegistering && (
                            <Input
                                label="Nombre Completo"
                                type="text"
                                required
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Admin User"
                                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/50"
                                labelClassName="text-gray-300"
                            />
                        )}
                        <Input
                            label="Correo Electrónico"
                            type="email"
                            required
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            placeholder="admin@celred.com"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/50"
                            labelClassName="text-gray-300"
                        />
                        <Input
                            label="Contraseña"
                            type="password"
                            required
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder="••••••••"
                            className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-blue-500/50 focus:ring-blue-500/50"
                            labelClassName="text-gray-300"
                        />
                    </div>

                    {error && (
                        <div className="text-red-200 text-sm text-center bg-red-500/20 p-2 rounded-lg border border-red-500/30">
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-900/40 transition-all border border-blue-400/20"
                        disabled={submitting}
                    >
                        {isRegistering ? 'Registrar Administrador' : 'Ingresar'}
                    </Button>
                </form>

                {isRegistering && (
                    <div className="text-center text-xs text-gray-400 mt-4">
                        Este formulario solo aparece porque no existen usuarios registrados.
                    </div>
                )}
            </div>
        </div>
    );
}
