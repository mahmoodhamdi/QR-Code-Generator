'use client';

import Link from 'next/link';
import { useTranslations } from 'next-intl';
import { QrCode, Github, Twitter } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations('footer');
  const tCommon = useTranslations('common');
  const tNav = useTranslations('nav');

  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-lg bg-primary">
                <QrCode className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-lg">{tCommon('appName')}</span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-md">
              {t('description')}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">{t('features')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  {t('qrGenerator')}
                </Link>
              </li>
              <li>
                <Link href="/scan" className="hover:text-foreground transition-colors">
                  {t('qrScanner')}
                </Link>
              </li>
              <li>
                <Link href="/batch" className="hover:text-foreground transition-colors">
                  {t('batchGeneration')}
                </Link>
              </li>
              <li>
                <Link href="/templates" className="hover:text-foreground transition-colors">
                  {tNav('templates')}
                </Link>
              </li>
            </ul>
          </div>

          {/* QR Types */}
          <div>
            <h4 className="font-semibold mb-4">{t('qrTypes')}</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>{t('urlWebsite')}</li>
              <li>{t('wifiNetwork')}</li>
              <li>{t('contactCard')}</li>
              <li>{t('emailPhone')}</li>
              <li>{t('andMore', { count: 8 })}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 mt-8 border-t">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} {t('copyright')}
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
