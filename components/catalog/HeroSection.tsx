const TechPartnerLogo = ({ src, alt, className }: { src: string, alt: string, className: string }) => (
    <div className="relative flex items-center justify-center p-3 md:px-6 md:py-4 transition-all duration-300 group min-w-[120px] hover:-translate-y-1">
        {/* Custom background pattern from user */}
        <div className="absolute inset-0 bg-[url('/brocha.png')] bg-contain bg-center bg-no-repeat opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Logo */}
        <div className="relative z-10 flex items-center justify-center pointer-events-none drop-shadow-md">
            <img src={src} alt={alt} className={className} />
        </div>
    </div>
);

export default function HeroSection() {
    return (
        <section className="relative overflow-hidden rounded-[2.5rem] bg-zinc-950 px-8 py-12 md:py-16 mb-8 shadow-2xl border border-white/5">
            {/* Background Effects */}
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1605236453806-6ff36851218e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] opacity-30 bg-cover bg-center mix-blend-luminosity" />
            <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/10 blur-[120px] rounded-full pointer-events-none" />
            
            {/* Soft subtle glow under partner logos */}
            <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-zinc-700/30 via-zinc-800/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[120%] h-32 bg-white/5 blur-[80px] rounded-[100%] pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs font-semibold tracking-wide uppercase mb-4 backdrop-blur-md">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    Equipos de Última Generación
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight mb-4 leading-[1.1]">
                    La tecnología que te <br className="hidden md:block" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-orange-400">
                        mueve de nivel.
                    </span>
                </h1>
                <p className="text-base md:text-lg text-zinc-400 max-w-2xl mx-auto font-light leading-relaxed mb-6">
                    Descubre nuestra colección premium de dispositivos móviles. Innovación, potencia y diseño excepcional en la palma de tu mano.
                </p>

                {/* Partners/Financing Section */}
                <div className="w-full pt-6 border-t border-white/10 mt-2">
                    <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4">
                        Respaldo y Financiación Oficial por
                    </p>
                    <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
                        <TechPartnerLogo
                            src="/addi.png"
                            alt="Addi"
                            className="h-5 md:h-7 object-contain opacity-90 transition-transform group-hover:scale-105 duration-300"
                        />
                        <TechPartnerLogo
                            src="/payjoy.png"
                            alt="PayJoy"
                            className="h-5 md:h-7 object-contain opacity-90 transition-transform group-hover:scale-105 duration-300"
                        />
                        <TechPartnerLogo
                            src="/sistecredito.svg"
                            alt="Sistecredito"
                            className="h-6 md:h-8 object-contain opacity-90 transition-transform group-hover:scale-105 duration-300"
                        />
                        <TechPartnerLogo
                            src="/krediya.png"
                            alt="Krediya"
                            className="h-5 md:h-7 object-contain opacity-90 transition-transform group-hover:scale-105 duration-300"
                        />
                        <TechPartnerLogo
                            src="/Banco-de-Bogota-Logo.png"
                            alt="Banco de Bogotá"
                            className="h-8 md:h-12 object-contain opacity-90 transition-transform group-hover:scale-105 duration-300"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
