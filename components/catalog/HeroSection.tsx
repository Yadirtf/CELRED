export default function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-8 py-24 mb-8 shadow-2xl border border-white/5">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-30 bg-cover bg-center mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wide uppercase mb-6 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Equipos de Última Generación
                </div>
                <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-[1.1]">
                    La tecnología que te <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
                        mueve de nivel.
                    </span>
                </h1>
                <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed">
                    Descubre nuestra colección premium de dispositivos móviles. Innovación, potencia y diseño excepcional en la palma de tu mano.
                </p>
            </div>
        </section>
    );
}
