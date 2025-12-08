import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { VCardForm } from '@/components/qr/forms/VCardForm';

describe('VCardForm', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all vCard sections', () => {
    render(<VCardForm onDataChange={mockOnDataChange} />);

    // Personal Information
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/organization/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/job title/i)).toBeInTheDocument();

    // Contact Information
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/work phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mobile/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/website/i)).toBeInTheDocument();

    // Address
    expect(screen.getByLabelText(/street address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/city/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/state/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/zip/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/country/i)).toBeInTheDocument();

    // Note
    expect(screen.getByLabelText(/note/i)).toBeInTheDocument();
  });

  it('should call onDataChange when first name is entered', async () => {
    const user = userEvent.setup();
    render(<VCardForm onDataChange={mockOnDataChange} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    await user.type(firstNameInput, 'John');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({ firstName: 'John' })
      );
    });
  });

  it('should include all filled fields in data', async () => {
    const user = userEvent.setup();
    render(<VCardForm onDataChange={mockOnDataChange} />);

    await user.type(screen.getByLabelText(/first name/i), 'John');
    await user.type(screen.getByLabelText(/last name/i), 'Doe');
    await user.type(screen.getByLabelText(/organization/i), 'ACME');
    await user.type(screen.getByLabelText(/email/i), 'john@example.com');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenLastCalledWith(
        expect.objectContaining({
          firstName: 'John',
          lastName: 'Doe',
          organization: 'ACME',
          email: 'john@example.com',
        })
      );
    });
  });

  it('should require first name', () => {
    render(<VCardForm onDataChange={mockOnDataChange} />);

    const firstNameInput = screen.getByLabelText(/first name/i);
    expect(firstNameInput).toHaveValue('');
    // First name is marked as required with asterisk
    expect(screen.getByText(/first name/i)).toBeInTheDocument();
  });

  it('should use initial data when provided', () => {
    render(
      <VCardForm
        onDataChange={mockOnDataChange}
        initialData={{
          firstName: 'Jane',
          lastName: 'Smith',
          organization: 'Tech Corp',
          email: 'jane@tech.com',
        }}
      />
    );

    expect(screen.getByLabelText(/first name/i)).toHaveValue('Jane');
    expect(screen.getByLabelText(/last name/i)).toHaveValue('Smith');
    expect(screen.getByLabelText(/organization/i)).toHaveValue('Tech Corp');
    expect(screen.getByLabelText(/email/i)).toHaveValue('jane@tech.com');
  });

  it('should show section headers', () => {
    render(<VCardForm onDataChange={mockOnDataChange} />);

    expect(screen.getByText('Personal Information')).toBeInTheDocument();
    expect(screen.getByText('Contact Information')).toBeInTheDocument();
    // Address header exists but so does "Street Address" label, so use exact match
    expect(screen.getByRole('heading', { level: 4, name: 'Address' })).toBeInTheDocument();
  });
});
