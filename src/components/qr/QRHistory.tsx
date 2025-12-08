'use client';

import { useTranslations } from 'next-intl';
import { useHistoryStore } from '@/stores/history-store';
import { useQRStore } from '@/stores/qr-store';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { History, Trash2, Download, RotateCcw } from 'lucide-react';
import { formatDistanceToNow } from '@/lib/utils/date';
import { toast } from 'sonner';
import Image from 'next/image';

export function QRHistory() {
  const { items, removeItem, clearHistory } = useHistoryStore();
  const { setQRType, setCustomization, setQRData } = useQRStore();
  const t = useTranslations('history');
  const tTypes = useTranslations('qrTypes');

  const handleRestore = (item: (typeof items)[0]) => {
    setQRType(item.type);
    setCustomization(item.customization);
    setQRData({ type: item.type, data: item.data } as never);
    toast.success(t('qrRestored'));
  };

  const handleDownload = (item: (typeof items)[0]) => {
    const link = document.createElement('a');
    link.href = item.preview;
    link.download = `qrcode-${item.type}-${Date.now()}.png`;
    link.click();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <History className="h-4 w-4" />
          {items.length > 0 && (
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
              {items.length > 9 ? '9+' : items.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center justify-between">
            <span>{t('title')}</span>
            {items.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  clearHistory();
                  toast.success(t('historyCleared'));
                }}
              >
                <Trash2 className="h-4 w-4 me-2" />
                {t('clearAll')}
              </Button>
            )}
          </SheetTitle>
          <SheetDescription>
            {t('description')}
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)] mt-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <History className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">{t('noQrYet')}</p>
              <p className="text-sm text-muted-foreground">
                {t('generatedQrWillAppear')}
              </p>
            </div>
          ) : (
            <div className="space-y-4 pe-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <div className="shrink-0">
                    <Image
                      src={item.preview}
                      alt="QR Code"
                      width={80}
                      height={80}
                      className="rounded-md"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium">
                        {tTypes(item.type)}
                      </span>
                      {item.label && (
                        <span className="text-xs bg-muted px-2 py-0.5 rounded">
                          {item.label}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {formatDistanceToNow(new Date(item.createdAt))}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRestore(item)}
                      >
                        <RotateCcw className="h-3 w-3 me-1" />
                        {t('restore')}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(item)}
                      >
                        <Download className="h-3 w-3 me-1" />
                        {t('download')}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          removeItem(item.id);
                          toast.success(t('removedFromHistory'));
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
