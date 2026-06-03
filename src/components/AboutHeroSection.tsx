import { useTranslation } from "react-i18next";

export default function AboutHeroSection() {
  const { t } = useTranslation();

  return (
    <section className="px-6 py-10 sm:px-10 lg:px-12 lg:py-16">
      <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
        <div className="max-w-xl text-left md:pr-4 lg:pr-10">
          <h1 className="mb-6 text-4xl font-semibold leading-tight tracking-tight text-gray-800 sm:text-5xl lg:text-6xl">
            {t("pages.about.hero.title")}
          </h1>

          <p className="max-w-prose text-base leading-7 text-gray-600 sm:text-lg">
            {t("pages.about.hero.description")}
          </p>
        </div>

        <div className="justify-self-center md:justify-self-end w-full max-w-[560px]">
          <div className="overflow-hidden rounded-[2rem] border border-gray-200 bg-gray-100 shadow-[0_24px_70px_-36px_rgba(15,23,42,0.55)]">
            <img
              src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80"
              alt={t("pages.about.hero.imageAlt")}
              className="h-[320px] w-full object-cover sm:h-[400px] lg:h-[460px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}