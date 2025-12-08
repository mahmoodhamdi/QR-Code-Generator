import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { QRTypeSelector } from '@/components/qr/QRTypeSelector';

describe('QRTypeSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all QR type buttons', () => {
    render(<QRTypeSelector value="url" onChange={mockOnChange} />);

    // With i18n mock, t(type) returns the type key itself
    // The QR_TYPES array includes: text, url, email, phone, sms, whatsapp, wifi, vcard, calendar, location, crypto, appstore
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(12);
  });

  it('should highlight the selected type', () => {
    render(<QRTypeSelector value="email" onChange={mockOnChange} />);

    // Find button that contains "email" text
    const emailButton = screen.getByText('email').closest('button');
    expect(emailButton).toHaveClass('border-primary');
  });

  it('should call onChange when a type is clicked', async () => {
    const user = userEvent.setup();
    render(<QRTypeSelector value="url" onChange={mockOnChange} />);

    await user.click(screen.getByText('wifi'));

    expect(mockOnChange).toHaveBeenCalledWith('wifi');
  });

  it('should render icons for each type', () => {
    render(<QRTypeSelector value="url" onChange={mockOnChange} />);

    // Each button should have an svg icon
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      expect(button.querySelector('svg')).toBeInTheDocument();
    });
  });

  it('should render all 12 QR types', () => {
    render(<QRTypeSelector value="url" onChange={mockOnChange} />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(12);
  });

  it('should change selection on click', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<QRTypeSelector value="url" onChange={mockOnChange} />);

    // Initially URL is selected
    expect(screen.getByText('url').closest('button')).toHaveClass('border-primary');

    // Click vCard
    await user.click(screen.getByText('vcard'));
    expect(mockOnChange).toHaveBeenCalledWith('vcard');

    // Simulate parent updating the value
    rerender(<QRTypeSelector value="vcard" onChange={mockOnChange} />);
    expect(screen.getByText('vcard').closest('button')).toHaveClass('border-primary');
    expect(screen.getByText('url').closest('button')).not.toHaveClass('border-primary');
  });
});
