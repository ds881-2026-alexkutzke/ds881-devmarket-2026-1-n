export default function AboutHeroSection() {
  return (
    <section className="px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="max-w-xl text-left md:pr-4 lg:pr-10">
          <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-gray-800 sm:text-5xl lg:text-6xl">
            Redefinindo o mercado digital.
          </h1>

          <p className="max-w-prose text-base leading-7 text-gray-600 sm:text-lg">
            Acreditamos em um mundo onde a qualidade encontra a conveniência.
            O Market foi fundado no princípio de que encontrar produtos premium
            deve ser uma experiência sem esforço e curada.
          </p>
        </div>

        <div className="justify-self-center md:justify-self-end w-full max-w-[560px]">
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-100 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
              alt="Escritório corporativo moderno com grandes janelas, mesas de reunião e plantas ao fundo"
              className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[460px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}