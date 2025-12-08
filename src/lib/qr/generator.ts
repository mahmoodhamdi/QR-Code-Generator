import QRCode from 'qrcode';
import { QRCustomization, ErrorCorrectionLevel } from '@/types/qr';

interface GeneratorOptions {
  data: string;
  customization: QRCustomization;
}

// Generate QR code as data URL (PNG)
export async function generateQRDataURL(options: GeneratorOptions): Promise<string> {
  const { data, customization } = options;

  if (!data) {
    throw new Error('No data provided for QR code generation');
  }

  const qrOptions: QRCode.QRCodeToDataURLOptions = {
    errorCorrectionLevel: customization.errorCorrection as ErrorCorrectionLevel,
    margin: customization.margin,
    width: customization.size,
    color: {
      dark: customization.foregroundColor,
      light: customization.backgroundColor,
    },
  };

  return QRCode.toDataURL(data, qrOptions);
}

// Generate QR code as SVG string
export async function generateQRSVG(options: GeneratorOptions): Promise<string> {
  const { data, customization } = options;

  if (!data) {
    throw new Error('No data provided for QR code generation');
  }

  const qrOptions: QRCode.QRCodeToStringOptions = {
    errorCorrectionLevel: customization.errorCorrection as ErrorCorrectionLevel,
    margin: customization.margin,
    width: customization.size,
    color: {
      dark: customization.foregroundColor,
      light: customization.backgroundColor,
    },
    type: 'svg',
  };

  return QRCode.toString(data, qrOptions);
}

// Generate QR code to canvas
export async function generateQRCanvas(
  canvas: HTMLCanvasElement,
  options: GeneratorOptions
): Promise<void> {
  const { data, customization } = options;

  if (!data) {
    throw new Error('No data provided for QR code generation');
  }

  const qrOptions: QRCode.QRCodeRenderersOptions = {
    errorCorrectionLevel: customization.errorCorrection as ErrorCorrectionLevel,
    margin: customization.margin,
    width: customization.size,
    color: {
      dark: customization.foregroundColor,
      light: customization.backgroundColor,
    },
  };

  await QRCode.toCanvas(canvas, data, qrOptions);

  // Add logo if present
  if (customization.logo) {
    const ctx = canvas.getContext('2d');
    if (ctx) {
      await addLogoToCanvas(ctx, canvas, customization.logo, customization.logoSize);
    }
  }
}

// Add logo to the center of the QR code
async function addLogoToCanvas(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  logoSrc: string,
  logoSizePercent: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const logoSize = (canvas.width * logoSizePercent) / 100;
      const x = (canvas.width - logoSize) / 2;
      const y = (canvas.height - logoSize) / 2;

      // Draw white background for logo
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(x - 4, y - 4, logoSize + 8, logoSize + 8);

      // Draw logo
      ctx.drawImage(img, x, y, logoSize, logoSize);
      resolve();
    };

    img.onerror = () => {
      reject(new Error('Failed to load logo image'));
    };

    img.src = logoSrc;
  });
}

// Generate QR with logo as data URL
export async function generateQRWithLogo(options: GeneratorOptions): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = options.customization.size;
  canvas.height = options.customization.size;

  await generateQRCanvas(canvas, options);

  return canvas.toDataURL('image/png');
}

// Validate QR content length
export function validateQRContent(data: string): { valid: boolean; message?: string } {
  if (!data) {
    return { valid: false, message: 'Content is required' };
  }

  // QR codes have different capacity based on error correction level
  // Using approximate limits for alphanumeric/binary data
  const maxLength = 4296; // Max binary capacity at L error correction

  if (data.length > maxLength) {
    return {
      valid: false,
      message: `Content too long. Maximum ${maxLength} characters allowed.`,
    };
  }

  return { valid: true };
}
