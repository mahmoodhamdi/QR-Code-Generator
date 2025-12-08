'use client';

import { useTranslations } from 'next-intl';
import { useQRStore } from '@/stores/qr-store';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { QrCode, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

export function QRPreview() {
  const { previewUrl, isGenerating, error, qrString } = useQRStore();
  const t = useTranslations('preview');

  return (
    <Card className="p-6 flex flex-col items-center justify-center min-h-[320px]">
      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="p-4 rounded-full bg-destructive/10">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <p className="text-sm text-destructive max-w-[200px]">{error}</p>
          </motion.div>
        ) : isGenerating ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4"
          >
            <Skeleton className="w-[200px] h-[200px] rounded-lg" />
            <p className="text-sm text-muted-foreground">{t('generatingQr')}</p>
          </motion.div>
        ) : previewUrl ? (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center gap-4"
          >
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              <Image
                src={previewUrl}
                alt="QR Code Preview"
                width={200}
                height={200}
                className="w-[200px] h-[200px]"
                unoptimized
              />
            </div>
            <p className="text-sm text-muted-foreground text-center max-w-[200px] truncate">
              {qrString.length > 50 ? qrString.substring(0, 50) + '...' : qrString}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-4 text-center"
          >
            <div className="p-6 rounded-full bg-muted">
              <QrCode className="h-12 w-12 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{t('noQrYet')}</p>
              <p className="text-sm text-muted-foreground">
                {t('fillFormToGenerate')}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}
