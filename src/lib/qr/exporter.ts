import { saveAs } from 'file-saver';
import { jsPDF } from 'jspdf';
import { ExportFormat, ExportOptions, QRCustomization } from '@/types/qr';
import { generateQRSVG, generateQRWithLogo } from './generator';

interface ExportParams {
  data: string;
  customization: QRCustomization;
  filename?: string;
  options?: ExportOptions;
}

// Export as PNG
export async function exportAsPNG(params: ExportParams): Promise<void> {
  const { data, customization, filename = 'qrcode', options } = params;
  const scale = options?.scale || 1;

  const scaledCustomization = {
    ...customization,
    size: customization.size * scale,
  };

  const dataUrl = await generateQRWithLogo({
    data,
    customization: scaledCustomization,
  });

  const blob = dataURLToBlob(dataUrl);
  saveAs(blob, `${filename}.png`);
}

// Export as SVG
export async function exportAsSVG(params: ExportParams): Promise<void> {
  const { data, customization, filename = 'qrcode' } = params;

  const svg = await generateQRSVG({ data, customization });
  const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
  saveAs(blob, `${filename}.svg`);
}

// Export as PDF (with optional print-ready features)
export async function exportAsPDF(params: ExportParams): Promise<void> {
  const { data, customization, filename = 'qrcode', options } = params;
  const print = options?.print;
  const dpi = print?.dpi ?? 150;
  const bleed = print?.bleedMm ?? 0;
  const cropMarks = print?.cropMarks ?? false;

  // Render at high resolution for print quality
  const renderScale = Math.max(1, Math.round(dpi / 72));
  const scaledCustomization = {
    ...customization,
    size: customization.size * renderScale,
  };
  const dataUrl = await generateQRWithLogo({ data, customization: scaledCustomization });

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const qrSize = 80; // 80mm
  const x = (pageWidth - qrSize) / 2;
  const y = (pageHeight - qrSize) / 2;

  // Bleed area frame (informational, drawn just outside QR)
  if (bleed > 0) {
    pdf.setDrawColor(220, 220, 220);
    pdf.setLineWidth(0.1);
    pdf.rect(x - bleed, y - bleed, qrSize + bleed * 2, qrSize + bleed * 2);
  }

  pdf.addImage(dataUrl, 'PNG', x, y, qrSize, qrSize);

  // Crop marks: short lines at each corner, 3mm long, 2mm offset
  if (cropMarks) {
    pdf.setDrawColor(0, 0, 0);
    pdf.setLineWidth(0.2);
    const offset = bleed > 0 ? bleed + 2 : 2;
    const len = 3;
    // top-left
    pdf.line(x - offset - len, y - offset, x - offset, y - offset);
    pdf.line(x - offset, y - offset - len, x - offset, y - offset);
    // top-right
    pdf.line(x + qrSize + offset, y - offset, x + qrSize + offset + len, y - offset);
    pdf.line(x + qrSize + offset, y - offset - len, x + qrSize + offset, y - offset);
    // bottom-left
    pdf.line(x - offset - len, y + qrSize + offset, x - offset, y + qrSize + offset);
    pdf.line(x - offset, y + qrSize + offset, x - offset, y + qrSize + offset + len);
    // bottom-right
    pdf.line(x + qrSize + offset, y + qrSize + offset, x + qrSize + offset + len, y + qrSize + offset);
    pdf.line(x + qrSize + offset, y + qrSize + offset, x + qrSize + offset, y + qrSize + offset + len);
  }

  // Add frame text if present
  if (customization.frameText) {
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    const textWidth = pdf.getTextWidth(customization.frameText);
    pdf.text(customization.frameText, (pageWidth - textWidth) / 2, y + qrSize + 10);
  }

  // Print-spec note (small, bottom-left)
  if (print?.cmykNote || cropMarks || bleed > 0) {
    pdf.setFontSize(7);
    pdf.setTextColor(120, 120, 120);
    const note = `Print @ ${dpi}dpi${bleed ? ` · bleed ${bleed}mm` : ''}${cropMarks ? ' · crop marks' : ''}${print?.cmykNote ? ' · convert RGB→CMYK in your RIP' : ''}`;
    pdf.text(note, 10, pageHeight - 8);
  }

  pdf.save(`${filename}.pdf`);
}

// Export as JPEG
export async function exportAsJPEG(params: ExportParams): Promise<void> {
  const { data, customization, filename = 'qrcode', options } = params;
  const quality = options?.quality || 0.92;
  const scale = options?.scale || 1;

  const scaledCustomization = {
    ...customization,
    size: customization.size * scale,
  };

  const canvas = document.createElement('canvas');
  canvas.width = scaledCustomization.size;
  canvas.height = scaledCustomization.size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  // Fill background (JPEG doesn't support transparency)
  ctx.fillStyle = customization.backgroundColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw QR code
  const dataUrl = await generateQRWithLogo({ data, customization: scaledCustomization });
  const img = await loadImage(dataUrl);
  ctx.drawImage(img, 0, 0);

  const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
  const blob = dataURLToBlob(jpegDataUrl);
  saveAs(blob, `${filename}.jpg`);
}

// Export as WebP
export async function exportAsWebP(params: ExportParams): Promise<void> {
  const { data, customization, filename = 'qrcode', options } = params;
  const quality = options?.quality || 0.92;
  const scale = options?.scale || 1;

  const scaledCustomization = {
    ...customization,
    size: customization.size * scale,
  };

  const dataUrl = await generateQRWithLogo({ data, customization: scaledCustomization });
  const img = await loadImage(dataUrl);

  const canvas = document.createElement('canvas');
  canvas.width = scaledCustomization.size;
  canvas.height = scaledCustomization.size;

  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not get canvas context');

  ctx.drawImage(img, 0, 0);

  const webpDataUrl = canvas.toDataURL('image/webp', quality);
  const blob = dataURLToBlob(webpDataUrl);
  saveAs(blob, `${filename}.webp`);
}

// Copy QR code to clipboard
export async function copyToClipboard(params: ExportParams): Promise<void> {
  const { data, customization } = params;

  const dataUrl = await generateQRWithLogo({ data, customization });
  const blob = dataURLToBlob(dataUrl);

  try {
    await navigator.clipboard.write([
      new ClipboardItem({
        'image/png': blob,
      }),
    ]);
  } catch {
    throw new Error('Failed to copy to clipboard. Your browser may not support this feature.');
  }
}

// Share using Web Share API
export async function shareQRCode(params: ExportParams): Promise<void> {
  const { data, customization, filename = 'qrcode' } = params;

  if (!navigator.share) {
    throw new Error('Web Share API is not supported in your browser');
  }

  const dataUrl = await generateQRWithLogo({ data, customization });
  const blob = dataURLToBlob(dataUrl);
  const file = new File([blob], `${filename}.png`, { type: 'image/png' });

  try {
    await navigator.share({
      title: 'QR Code',
      text: 'Check out this QR code',
      files: [file],
    });
  } catch (error) {
    if ((error as Error).name !== 'AbortError') {
      throw error;
    }
  }
}

// Print QR code
export function printQRCode(dataUrl: string): void {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window. Please check your popup blocker settings.');
  }

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Print QR Code</title>
        <style>
          body {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
          }
          img {
            max-width: 100%;
            height: auto;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <img src="${dataUrl}" alt="QR Code" />
        <script>
          window.onload = function() {
            window.print();
            window.close();
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
}

// Main export function
export async function exportQRCode(
  format: ExportFormat,
  params: ExportParams
): Promise<void> {
  switch (format) {
    case 'png':
      return exportAsPNG(params);
    case 'svg':
      return exportAsSVG(params);
    case 'pdf':
      return exportAsPDF(params);
    case 'jpeg':
      return exportAsJPEG(params);
    case 'webp':
      return exportAsWebP(params);
    default:
      throw new Error(`Unsupported export format: ${format}`);
  }
}

// Helper: Convert data URL to Blob
function dataURLToBlob(dataUrl: string): Blob {
  const parts = dataUrl.split(',');
  const mime = parts[0].match(/:(.*?);/)?.[1] || 'image/png';
  const bstr = atob(parts[1]);
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new Blob([u8arr], { type: mime });
}

// Helper: Load image from URL
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
