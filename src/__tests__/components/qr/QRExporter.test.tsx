import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRExporter } from '@/components/qr/QRExporter';
import { useQRStore } from '@/stores/qr-store';
import { useHistoryStore } from '@/stores/history-store';
import { act } from '@testing-library/react';
import * as exporter from '@/lib/qr/exporter';

// Mock exporter functions
jest.mock('@/lib/qr/exporter', () => ({
  exportAsPNG: jest.fn().mockResolvedValue(undefined),
  exportAsSVG: jest.fn().mockResolvedValue(undefined),
  exportAsPDF: jest.fn().mockResolvedValue(undefined),
  exportAsJPEG: jest.fn().mockResolvedValue(undefined),
  exportAsWebP: jest.fn().mockResolvedValue(undefined),
  copyToClipboard: jest.fn().mockResolvedValue(undefined),
  shareQRCode: jest.fn().mockResolvedValue(undefined),
  printQRCode: jest.fn(),
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe('QRExporter', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Set up store with valid QR data
    act(() => {
      useQRStore.setState({
        qrString: 'https://example.com',
        previewUrl: 'data:image/png;base64,test',
        qrType: 'url',
        qrData: { type: 'url', data: { url: 'https://example.com' } },
        customization: {
          size: 256,
          foregroundColor: '#000000',
          backgroundColor: '#ffffff',
          errorCorrection: 'M',
          margin: 4,
          pattern: 'square',
          cornerStyle: 'square',
          logoSize: 20,
        },
      });

      useHistoryStore.setState({ items: [] });
    });
  });

  it('should render download button', () => {
    render(<QRExporter />);
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument();
  });

  it('should render action buttons', () => {
    render(<QRExporter />);

    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /share/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /print/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('should disable buttons when no QR code', () => {
    act(() => {
      useQRStore.setState({
        qrString: '',
        previewUrl: '',
      });
    });

    render(<QRExporter />);

    expect(screen.getByRole('button', { name: /download/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /copy/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /share/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /print/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('should copy QR code to clipboard', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /copy/i }));

    await waitFor(() => {
      expect(exporter.copyToClipboard).toHaveBeenCalled();
    });
  });

  it('should share QR code', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /share/i }));

    await waitFor(() => {
      expect(exporter.shareQRCode).toHaveBeenCalled();
    });
  });

  it('should print QR code', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /print/i }));

    expect(exporter.printQRCode).toHaveBeenCalledWith('data:image/png;base64,test');
  });

  it('should save to history', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      const historyItems = useHistoryStore.getState().items;
      expect(historyItems.length).toBe(1);
      expect(historyItems[0].type).toBe('url');
    });
  });

  it('should show export dropdown menu', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /download/i }));

    await waitFor(() => {
      expect(screen.getByText('PNG')).toBeInTheDocument();
      expect(screen.getByText('SVG')).toBeInTheDocument();
      expect(screen.getByText('PDF')).toBeInTheDocument();
      expect(screen.getByText('JPEG')).toBeInTheDocument();
      expect(screen.getByText('WebP')).toBeInTheDocument();
    });
  });

  it('should export as PNG', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /download/i }));
    await user.click(screen.getByText('PNG'));

    await waitFor(() => {
      expect(exporter.exportAsPNG).toHaveBeenCalled();
    });
  });

  it('should export as SVG', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /download/i }));
    await user.click(screen.getByText('SVG'));

    await waitFor(() => {
      expect(exporter.exportAsSVG).toHaveBeenCalled();
    });
  });

  it('should export as PDF', async () => {
    const user = userEvent.setup();
    render(<QRExporter />);

    await user.click(screen.getByRole('button', { name: /download/i }));
    await user.click(screen.getByText('PDF'));

    await waitFor(() => {
      expect(exporter.exportAsPDF).toHaveBeenCalled();
    });
  });
});
