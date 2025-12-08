'use client';

import { useCallback, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { useQRStore } from '@/stores/qr-store';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { SECURITY_LIMITS } from '@/lib/constants';
import { ErrorCorrectionLevel, GradientType, QRCornerStyle, QRPatternStyle } from '@/types/qr';
import { Palette, Image as ImageIcon, Settings2, RotateCcw, Upload, X } from 'lucide-react';
import { toast } from 'sonner';

export function QRCustomizer() {
  const { customization, setCustomization, resetCustomization } = useQRStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('customizer');
  const tSizes = useTranslations('sizePresets');
  const tLevels = useTranslations('errorLevels');

  const SIZE_PRESETS = [
    { label: tSizes('small'), value: 128 },
    { label: tSizes('medium'), value: 256 },
    { label: tSizes('large'), value: 512 },
    { label: tSizes('extraLarge'), value: 1024 },
    { label: tSizes('printReady'), value: 2048 },
  ];

  const ERROR_CORRECTION_LABELS: Record<string, string> = {
    L: tLevels('low'),
    M: tLevels('medium'),
    Q: tLevels('quartile'),
    H: tLevels('high'),
  };

  const handleLogoUpload = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!SECURITY_LIMITS.allowedImageTypes.includes(file.type)) {
        toast.error(t('invalidFileType'));
        return;
      }

      if (file.size > SECURITY_LIMITS.maxLogoSize) {
        toast.error(t('fileTooLarge'));
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setCustomization({ logo: result });
      };
      reader.readAsDataURL(file);
    },
    [setCustomization, t]
  );

  const removeLogo = () => {
    setCustomization({ logo: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t('title')}</h3>
        <Button variant="ghost" size="sm" onClick={resetCustomization}>
          <RotateCcw className="h-4 w-4 me-2" />
          {t('reset')}
        </Button>
      </div>

      <Accordion type="multiple" defaultValue={['colors', 'style', 'logo']} className="w-full">
        {/* Colors */}
        <AccordionItem value="colors">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              {t('colors')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="foreground">{t('foreground')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="foreground"
                    type="color"
                    value={customization.foregroundColor}
                    onChange={(e) => setCustomization({ foregroundColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={customization.foregroundColor}
                    onChange={(e) => setCustomization({ foregroundColor: e.target.value })}
                    className="font-mono text-sm flex-1"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="background">{t('background')}</Label>
                <div className="flex gap-2">
                  <Input
                    id="background"
                    type="color"
                    value={customization.backgroundColor}
                    onChange={(e) => setCustomization({ backgroundColor: e.target.value })}
                    className="w-12 h-10 p-1 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={customization.backgroundColor}
                    onChange={(e) => setCustomization({ backgroundColor: e.target.value })}
                    className="font-mono text-sm flex-1"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>{t('gradient')}</Label>
              <Select
                value={customization.gradientType}
                onValueChange={(value) => setCustomization({ gradientType: value as GradientType })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{t('gradientNone')}</SelectItem>
                  <SelectItem value="linear">{t('gradientLinear')}</SelectItem>
                  <SelectItem value="radial">{t('gradientRadial')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {customization.gradientType !== 'none' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>{t('gradientStart')}</Label>
                  <Input
                    type="color"
                    value={customization.gradientColors[0]}
                    onChange={(e) =>
                      setCustomization({
                        gradientColors: [e.target.value, customization.gradientColors[1]],
                      })
                    }
                    className="w-full h-10 p-1 cursor-pointer"
                  />
                </div>
                <div className="space-y-2">
                  <Label>{t('gradientEnd')}</Label>
                  <Input
                    type="color"
                    value={customization.gradientColors[1]}
                    onChange={(e) =>
                      setCustomization({
                        gradientColors: [customization.gradientColors[0], e.target.value],
                      })
                    }
                    className="w-full h-10 p-1 cursor-pointer"
                  />
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

        {/* Style */}
        <AccordionItem value="style">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Settings2 className="h-4 w-4" />
              {t('styleAndSize')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>{t('patternStyle')}</Label>
              <Select
                value={customization.patternStyle}
                onValueChange={(value) =>
                  setCustomization({ patternStyle: value as QRPatternStyle })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="squares">{t('patternSquares')}</SelectItem>
                  <SelectItem value="dots">{t('patternDots')}</SelectItem>
                  <SelectItem value="rounded">{t('patternRounded')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>{t('cornerStyle')}</Label>
              <Select
                value={customization.cornerStyle}
                onValueChange={(value) =>
                  setCustomization({ cornerStyle: value as QRCornerStyle })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="square">{t('cornerSquare')}</SelectItem>
                  <SelectItem value="rounded">{t('cornerRounded')}</SelectItem>
                  <SelectItem value="extra-rounded">{t('cornerExtraRounded')}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t('size')}: {customization.size}px</Label>
                <Select
                  value={customization.size.toString()}
                  onValueChange={(value) => setCustomization({ size: parseInt(value) })}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SIZE_PRESETS.map((preset) => (
                      <SelectItem key={preset.value} value={preset.value.toString()}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Slider
                value={[customization.size]}
                onValueChange={([value]) => setCustomization({ size: value })}
                min={128}
                max={2048}
                step={64}
              />
            </div>

            <div className="space-y-2">
              <Label>{t('errorCorrection')}</Label>
              <Select
                value={customization.errorCorrection}
                onValueChange={(value) =>
                  setCustomization({ errorCorrection: value as ErrorCorrectionLevel })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(ERROR_CORRECTION_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {t('errorCorrectionHelp')}
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>{t('margin')}: {customization.margin}</Label>
              </div>
              <Slider
                value={[customization.margin]}
                onValueChange={([value]) => setCustomization({ margin: value })}
                min={0}
                max={10}
                step={1}
              />
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Logo */}
        <AccordionItem value="logo">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              {t('logo')}
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>{t('uploadLogo')}</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/svg+xml,image/webp"
                onChange={handleLogoUpload}
                className="hidden"
                id="logo-upload"
              />
              {customization.logo ? (
                <div className="flex items-center gap-2">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden border">
                    <img
                      src={customization.logo}
                      alt="Logo preview"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <Button variant="outline" size="sm" onClick={removeLogo}>
                    <X className="h-4 w-4 me-2" />
                    {t('removeLogo')}
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="h-4 w-4 me-2" />
                  {t('uploadLogo')}
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                {t('logoHelp')}
              </p>
            </div>

            {customization.logo && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>{t('logoSize')}: {customization.logoSize}%</Label>
                </div>
                <Slider
                  value={[customization.logoSize]}
                  onValueChange={([value]) => setCustomization({ logoSize: value })}
                  min={10}
                  max={30}
                  step={1}
                />
                <p className="text-xs text-muted-foreground">
                  {t('logoSizeHelp')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="frameText">{t('frameText')}</Label>
              <Input
                id="frameText"
                placeholder={t('frameTextPlaceholder')}
                value={customization.frameText || ''}
                onChange={(e) => setCustomization({ frameText: e.target.value })}
              />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
