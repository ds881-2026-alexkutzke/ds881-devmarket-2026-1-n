import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GITHUB_REPO_URL =
  'https://github.com/ds881-2026-alexkutzke/ds881-devmarket-2026-1-n';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="w-full bg-primary-950 text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-4">

        <div className="flex flex-col gap-2">
          <p className="text-base font-medium text-white">
            {t('components.footer.brand')}
          </p>
          <p className="text-sm text-primary-300 leading-relaxed">
            {t('components.footer.copyright')}
            <br />
            {t('components.footer.tagline')}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            {t('components.footer.privacyTitle')}
          </p>
          <a
            href="#"
            className="text-sm text-primary-300 transition-colors hover:text-white"
          >
            {t('components.footer.termsOfService')}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            {t('components.footer.helpTitle')}
          </p>
          <a
            href="#"
            className="text-sm text-primary-300 transition-colors hover:text-white"
          >
            {t('components.footer.shipping')}
          </a>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-sm font-medium text-white">
            {t('components.footer.contactTitle')}
          </p>
          <Link
            to="/"
            className="text-sm text-primary-300 transition-colors hover:text-white"
          >
            {t('components.footer.aboutProject')}
          </Link>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noreferrer noopener"
            className="text-sm text-primary-300 transition-colors hover:text-white"
          >
            {t('components.footer.githubRepo')}
          </a>
        </div>

      </div>
    </footer>
  );
}
