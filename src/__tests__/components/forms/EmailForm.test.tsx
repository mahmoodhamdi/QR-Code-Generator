import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmailForm } from '@/components/qr/forms/EmailForm';

describe('EmailForm', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all email fields', () => {
    render(<EmailForm onDataChange={mockOnDataChange} />);

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
  });

  it('should call onDataChange when email is entered', async () => {
    const user = userEvent.setup();
    render(<EmailForm onDataChange={mockOnDataChange} />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'test@example.com');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'test@example.com' })
      );
    });
  });

  it('should include subject and body when provided', async () => {
    const user = userEvent.setup();
    render(<EmailForm onDataChange={mockOnDataChange} />);

    await user.type(screen.getByLabelText(/email address/i), 'test@example.com');
    await user.type(screen.getByLabelText(/subject/i), 'Hello');
    await user.type(screen.getByLabelText(/message/i), 'Message content');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          email: 'test@example.com',
          subject: 'Hello',
          body: 'Message content',
        })
      );
    });
  });

  it('should show error for invalid email format', async () => {
    const user = userEvent.setup();
    render(<EmailForm onDataChange={mockOnDataChange} />);

    const emailInput = screen.getByLabelText(/email address/i);
    await user.type(emailInput, 'invalid-email');
    await user.tab(); // blur

    await waitFor(() => {
      expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
    });
  });

  it('should use initial data when provided', () => {
    render(
      <EmailForm
        onDataChange={mockOnDataChange}
        initialData={{
          email: 'initial@example.com',
          subject: 'Initial Subject',
          body: 'Initial Body',
        }}
      />
    );

    expect(screen.getByLabelText(/email address/i)).toHaveValue('initial@example.com');
    expect(screen.getByLabelText(/subject/i)).toHaveValue('Initial Subject');
    expect(screen.getByLabelText(/message/i)).toHaveValue('Initial Body');
  });
});
