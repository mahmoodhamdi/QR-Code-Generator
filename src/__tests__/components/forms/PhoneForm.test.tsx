import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PhoneForm } from '@/components/qr/forms/PhoneForm';

describe('PhoneForm', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render phone input field', () => {
    render(<PhoneForm onDataChange={mockOnDataChange} />);
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument();
  });

  it('should show placeholder with international format hint', () => {
    render(<PhoneForm onDataChange={mockOnDataChange} />);
    expect(screen.getByPlaceholderText(/\+1234567890/i)).toBeInTheDocument();
  });

  it('should call onDataChange when valid phone is entered', async () => {
    const user = userEvent.setup();
    render(<PhoneForm onDataChange={mockOnDataChange} />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, '+1234567890');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith({ phone: '+1234567890' });
    });
  });

  it('should use initial data when provided', () => {
    render(
      <PhoneForm
        onDataChange={mockOnDataChange}
        initialData={{ phone: '+9876543210' }}
      />
    );

    expect(screen.getByLabelText(/phone number/i)).toHaveValue('+9876543210');
  });

  it('should show error for invalid phone format', async () => {
    const user = userEvent.setup();
    render(<PhoneForm onDataChange={mockOnDataChange} />);

    const phoneInput = screen.getByLabelText(/phone number/i);
    await user.type(phoneInput, 'invalid');
    await user.tab(); // blur

    await waitFor(() => {
      expect(screen.getByText(/invalid phone/i)).toBeInTheDocument();
    });
  });

  it('should show helper text about international format', () => {
    render(<PhoneForm onDataChange={mockOnDataChange} />);
    expect(screen.getByText(/international format/i)).toBeInTheDocument();
  });
});
