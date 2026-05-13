import { exportQRCode, printQRCode } from '@/lib/qr/exporter';
import { QRCustomization } from '@/types/qr';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('qrcode', () => ({
  toCanvas: jest.fn().mockResolvedValue(undefined),
  toDataURL: jest.fn().mockResolvedValue('data:image/png;base64,iVBORw0KGgo='),
  toString: jest.fn().mockResolvedValue('<svg></svg>'),
}));

jest.mock('jspdf', () => {
  const save = jest.fn();
  const addImage = jest.fn();
  const setFontSize = jest.fn();
  const setTextColor = jest.fn();
  const getTextWidth = jest.fn().mockReturnValue(50);
  const text = jest.fn();
  return {
    jsPDF: jest.fn().mockImplementation(() => ({
      internal: {
        pageSize: {
          getWidth: () => 210,
          getHeight: () => 297,
        },
      },
      addImage,
      setFontSize,
      setTextColor,
      getTextWidth,
      text,
      save,
    })),
  };
});

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
  HTMLCanvasElement.prototype.toDataURL = jest.fn().mockReturnValue('data:image/jpeg;base64,abc=');

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
});

describe('exporter', () => {
  it('exports PNG', async () => {
    const { saveAs } = jest.requireMock<typeof import('file-saver')>('file-saver');
    await exportQRCode('png', { data: 'hello', customization: baseCustomization, filename: 'mycode' });
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'mycode.png');
  });

  it('exports SVG', async () => {
    const { saveAs } = jest.requireMock<typeof import('file-saver')>('file-saver');
    await exportQRCode('svg', { data: 'hello', customization: baseCustomization });
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'qrcode.svg');
  });

  it('exports PDF with frame text', async () => {
    const jspdf = jest.requireMock<typeof import('jspdf')>('jspdf');
    await exportQRCode('pdf', {
      data: 'hello',
      customization: { ...baseCustomization, frameText: 'SCAN ME' } as QRCustomization,
      filename: 'flyer',
    });
    expect((jspdf.jsPDF as unknown as jest.Mock)).toHaveBeenCalled();
  });

  it('exports PDF without frame text', async () => {
    await exportQRCode('pdf', { data: 'hello', customization: baseCustomization });
  });

  it('exports JPEG', async () => {
    const { saveAs } = jest.requireMock<typeof import('file-saver')>('file-saver');
    await exportQRCode('jpeg', { data: 'hello', customization: baseCustomization, options: { quality: 0.8, scale: 2 } });
    expect(saveAs).toHaveBeenCalledWith(expect.any(Blob), 'qrcode.jpg');
  });

  it('exports WebP', async () => {
    const { saveAs } = jest.requireMock<typeof import('file-saver')>('file-saver');
    await exportQRCode('webp' as 'png', { data: 'hello', customization: baseCustomization });
    expect(saveAs).toHaveBeenCalled();
  });

  it('throws on unsupported format', async () => {
    await expect(
      exportQRCode('bmp' as 'png', { data: 'hello', customization: baseCustomization })
    ).rejects.toThrow('Unsupported export format');
  });
});

describe('printQRCode', () => {
  it('opens a print window with the data URL', () => {
    const fakeWindow = {
      document: { write: jest.fn(), close: jest.fn() },
    };
    const open = jest.spyOn(window, 'open').mockReturnValue(fakeWindow as unknown as Window);
    printQRCode('data:image/png;base64,xx');
    expect(open).toHaveBeenCalled();
    expect(fakeWindow.document.write).toHaveBeenCalledWith(expect.stringContaining('data:image/png;base64,xx'));
    open.mockRestore();
  });

  it('throws when popup is blocked', () => {
    const open = jest.spyOn(window, 'open').mockReturnValue(null);
    expect(() => printQRCode('data:image/png;base64,xx')).toThrow('Could not open print window');
    open.mockRestore();
  });
});
