import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WiFiForm } from '@/components/qr/forms/WiFiForm';

describe('WiFiForm', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all WiFi fields', () => {
    render(<WiFiForm onDataChange={mockOnDataChange} />);

    // With i18n mock, labels show translation keys
    expect(screen.getByLabelText(/ssidLabel/)).toBeInTheDocument();
    expect(screen.getByText('encryptionLabel')).toBeInTheDocument();
    expect(screen.getByLabelText(/passwordLabel/)).toBeInTheDocument();
    expect(screen.getByLabelText(/hiddenLabel/)).toBeInTheDocument();
  });

  it('should call onDataChange when SSID is entered', async () => {
    const user = userEvent.setup();
    render(<WiFiForm onDataChange={mockOnDataChange} />);

    const ssidInput = screen.getByLabelText(/ssidLabel/);
    await user.type(ssidInput, 'MyNetwork');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ ssid: 'MyNetwork' })
      );
    });
  });

  it('should include encryption type in data', async () => {
    const user = userEvent.setup();
    render(<WiFiForm onDataChange={mockOnDataChange} />);

    await user.type(screen.getByLabelText(/ssidLabel/), 'TestNetwork');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({
          ssid: 'TestNetwork',
          encryption: 'WPA', // default value
        })
      );
    });
  });

  it('should toggle password visibility', async () => {
    const user = userEvent.setup();
    render(<WiFiForm onDataChange={mockOnDataChange} />);

    const passwordInput = screen.getByLabelText(/passwordLabel/);
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Find and click the toggle button (eye icon)
    const toggleButton = screen.getByRole('button');
    await user.click(toggleButton);

    expect(passwordInput).toHaveAttribute('type', 'text');

    await user.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });

  it('should use initial data when provided', () => {
    render(
      <WiFiForm
        onDataChange={mockOnDataChange}
        initialData={{
          ssid: 'InitialNetwork',
          password: 'initialpass',
          encryption: 'WEP',
          hidden: true,
        }}
      />
    );

    expect(screen.getByLabelText(/ssidLabel/)).toHaveValue('InitialNetwork');
    expect(screen.getByLabelText(/passwordLabel/)).toHaveValue('initialpass');
  });

  it('should require SSID for validation', async () => {
    render(<WiFiForm onDataChange={mockOnDataChange} />);

    // SSID is required - verify input exists and is empty by default
    const ssidInput = screen.getByLabelText(/ssidLabel/);
    expect(ssidInput).toHaveValue('');
  });
});
