import React from 'react';
import { render, screen } from '@testing-library/react';
import { QRPreview } from '@/components/qr/QRPreview';
import { useQRStore } from '@/stores/qr-store';
import { act } from '@testing-library/react';

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.PropsWithChildren<object>) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: React.PropsWithChildren) => <>{children}</>,
}));

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => <img {...props} />,
}));

describe('QRPreview', () => {
  beforeEach(() => {
    // Reset store state
    act(() => {
      useQRStore.setState({
        previewUrl: '',
        isGenerating: false,
        error: null,
        qrString: '',
      });
    });
  });

  it('should show empty state when no QR code is generated', () => {
    render(<QRPreview />);

    // With i18n mock, text shows translation keys
    expect(screen.getByText('noQrYet')).toBeInTheDocument();
    expect(screen.getByText('fillFormToGenerate')).toBeInTheDocument();
  });

  it('should show loading state when generating', () => {
    act(() => {
      useQRStore.setState({
        isGenerating: true,
      });
    });

    render(<QRPreview />);

    expect(screen.getByText('generatingQr')).toBeInTheDocument();
  });

  it('should show error state when there is an error', () => {
    act(() => {
      useQRStore.setState({
        error: 'Failed to generate QR code',
      });
    });

    render(<QRPreview />);

    expect(screen.getByText(/Failed to generate QR code/i)).toBeInTheDocument();
  });

  it('should show QR code preview when available', () => {
    const previewUrl = 'data:image/png;base64,iVBORw0KGgo...';

    act(() => {
      useQRStore.setState({
        previewUrl,
        qrString: 'https://example.com',
      });
    });

    render(<QRPreview />);

    // The alt text is hardcoded in the component as "QR Code Preview"
    const img = screen.getByAltText('QR Code Preview');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', previewUrl);
  });

  it('should truncate long QR strings', () => {
    const longString = 'https://example.com/' + 'a'.repeat(100);

    act(() => {
      useQRStore.setState({
        previewUrl: 'data:image/png;base64,test',
        qrString: longString,
      });
    });

    render(<QRPreview />);

    // Should be truncated to 50 chars + ...
    expect(screen.getByText(/\.\.\./)).toBeInTheDocument();
  });

  it('should show full string when short enough', () => {
    const shortString = 'https://example.com';

    act(() => {
      useQRStore.setState({
        previewUrl: 'data:image/png;base64,test',
        qrString: shortString,
      });
    });

    render(<QRPreview />);

    expect(screen.getByText(shortString)).toBeInTheDocument();
  });

  it('should prioritize error over other states', () => {
    act(() => {
      useQRStore.setState({
        previewUrl: 'data:image/png;base64,test',
        isGenerating: true,
        error: 'An error occurred',
      });
    });

    render(<QRPreview />);

    expect(screen.getByText(/An error occurred/i)).toBeInTheDocument();
    expect(screen.queryByText('generatingQr')).not.toBeInTheDocument();
  });

  it('should prioritize loading over preview', () => {
    act(() => {
      useQRStore.setState({
        previewUrl: 'data:image/png;base64,test',
        isGenerating: true,
        error: null,
      });
    });

    render(<QRPreview />);

    expect(screen.getByText('generatingQr')).toBeInTheDocument();
  });
});
