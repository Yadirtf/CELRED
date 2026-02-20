export default function HeroSection() {
    return (
        <section className="text-center space-y-4 py-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-xl border border-slate-700 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1556656793-02715d8dd6f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-10 bg-cover bg-center" />
            <div className="relative z-10 px-4">
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                    Catálogo de Celulares
                </h1>
                <p className="text-xl text-slate-300 max-w-2xl mx-auto font-light">
                    Explora nuestra selección premium de dispositivos móviles con la tecnología más avanzada del mercado.
                </p>
            </div>
        </section>
    );
}
