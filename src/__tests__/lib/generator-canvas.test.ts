import { generateQRCanvas, generateQRWithLogo } from '@/lib/qr/generator';
import { QRCustomization } from '@/types/qr';

jest.mock('qrcode', () => ({
  toCanvas: jest.fn().mockResolvedValue(undefined),
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,mockdata'),
  toString: jest.fn().mockResolvedValue('<svg></svg>'),
}));

const baseCustomization: QRCustomization = {
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

beforeAll(() => {
  HTMLCanvasElement.prototype.getContext = jest.fn().mockReturnValue({
    fillStyle: '',
    fillRect: jest.fn(),
    drawImage: jest.fn(),
  }) as unknown as typeof HTMLCanvasElement.prototype.getContext;
  HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue('data:image/png;base64,abc=');
});

describe('generateQRCanvas', () => {
  it('renders without logo when no logo set', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    await expect(generateQRCanvas(canvas, { data: 'hello', customization: baseCustomization })).resolves.toBeUndefined();
  });

  it('throws when no data provided', async () => {
    const canvas = document.createElement('canvas');
    await expect(
      generateQRCanvas(canvas, { data: '', customization: baseCustomization })
    ).rejects.toThrow('No data provided');
  });

  it('adds logo when logo is set (success path)', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    // Stub Image to fire onload immediately
    const RealImage = global.Image;
    class FakeImage {
      onload: (() => void) | null = null;
      onerror: ((e?: unknown) => void) | null = null;
      crossOrigin = '';
      _src = '';
      set src(value: string) {
        this._src = value;
        setTimeout(() => this.onload?.(), 0);
      }
      get src() {
        return this._src;
      }
    }
    (global as unknown as { Image: typeof Image }).Image = FakeImage as unknown as typeof Image;
    try {
      await generateQRCanvas(canvas, {
        data: 'with-logo',
        customization: { ...baseCustomization, logo: 'data:image/png;base64,xxx', logoSize: 25 },
      });
    } finally {
      (global as unknown as { Image: typeof Image }).Image = RealImage;
    }
  });

  it('rejects when logo image fails to load', async () => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const RealImage = global.Image;
    class FailingImage {
      onload: (() => void) | null = null;
      onerror: ((e?: unknown) => void) | null = null;
      crossOrigin = '';
      _src = '';
      set src(value: string) {
        this._src = value;
        setTimeout(() => this.onerror?.(), 0);
      }
      get src() {
        return this._src;
      }
    }
    (global as unknown as { Image: typeof Image }).Image = FailingImage as unknown as typeof Image;
    try {
      await expect(
        generateQRCanvas(canvas, {
          data: 'bad-logo',
          customization: { ...baseCustomization, logo: 'data:image/png;base64,bad', logoSize: 20 },
        })
      ).rejects.toThrow('Failed to load logo image');
    } finally {
      (global as unknown as { Image: typeof Image }).Image = RealImage;
    }
  });
});

describe('generateQRWithLogo', () => {
  it('returns a PNG data URL', async () => {
    const result = await generateQRWithLogo({ data: 'logo-or-not', customization: baseCustomization });
    expect(typeof result).toBe('string');
    expect(result.startsWith('data:image/png')).toBe(true);
  });
});
