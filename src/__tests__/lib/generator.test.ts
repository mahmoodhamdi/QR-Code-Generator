import {
  generateQRDataURL,
  generateQRSVG,
  validateQRContent,
} from '@/lib/qr/generator';
import { QRCustomization } from '@/types/qr';

// Mock the qrcode library
jest.mock('qrcode', () => ({
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockdata'),
  toString: jest.fn().mockResolvedValue('<svg>mock svg</svg>'),
  toCanvas: jest.fn().mockResolvedValue(undefined),
}));

describe('QR Generator', () => {
  const defaultCustomization: QRCustomization = {
    size: 256,
    foregroundColor: '#000000',
    backgroundColor: '#ffffff',
    errorCorrection: 'M',
    margin: 4,
    pattern: 'square',
    cornerStyle: 'square',
    logo: undefined,
    logoSize: 20,
    gradient: undefined,
  };

  describe('generateQRDataURL', () => {
    it('should generate QR code as data URL', async () => {
      const result = await generateQRDataURL({
        data: 'Hello World',
        customization: defaultCustomization,
      });
      expect(result).toContain('data:image/png;base64');
    });

    it('should throw error when no data provided', async () => {
      await expect(
        generateQRDataURL({
          data: '',
          customization: defaultCustomization,
        })
      ).rejects.toThrow('No data provided for QR code generation');
    });

    it('should apply customization options', async () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const QRCode = require('qrcode');
      await generateQRDataURL({
        data: 'Test',
        customization: {
          ...defaultCustomization,
          size: 512,
          foregroundColor: '#ff0000',
          backgroundColor: '#0000ff',
          errorCorrection: 'H',
          margin: 2,
        },
      });

      expect(QRCode.toDataURL).toHaveBeenCalledWith('Test', {
        errorCorrectionLevel: 'H',
        margin: 2,
        width: 512,
        color: {
          dark: '#ff0000',
          light: '#0000ff',
        },
      });
    });
  });

  describe('generateQRSVG', () => {
    it('should generate QR code as SVG string', async () => {
      const result = await generateQRSVG({
        data: 'Hello World',
        customization: defaultCustomization,
      });
      expect(result).toContain('<svg>');
    });

    it('should throw error when no data provided', async () => {
      await expect(
        generateQRSVG({
          data: '',
          customization: defaultCustomization,
        })
      ).rejects.toThrow('No data provided for QR code generation');
    });
  });

  describe('validateQRContent', () => {
    it('should validate valid content', () => {
      const result = validateQRContent('Hello World');
      expect(result.valid).toBe(true);
      expect(result.message).toBeUndefined();
    });

    it('should reject empty content', () => {
      const result = validateQRContent('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Content is required');
    });

    it('should reject content exceeding max length', () => {
      const longContent = 'a'.repeat(5000);
      const result = validateQRContent(longContent);
      expect(result.valid).toBe(false);
      expect(result.message).toContain('Content too long');
    });

    it('should accept content at max length boundary', () => {
      const maxContent = 'a'.repeat(4296);
      const result = validateQRContent(maxContent);
      expect(result.valid).toBe(true);
    });
  });
});
