import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { URLForm } from '@/components/qr/forms/URLForm';

describe('URLForm', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render URL input field', () => {
    render(<URLForm onDataChange={mockOnDataChange} />);
    // With i18n mock, label shows translation key
    expect(screen.getByLabelText('label')).toBeInTheDocument();
  });

  it('should show URL placeholder', () => {
    render(<URLForm onDataChange={mockOnDataChange} />);
    // Placeholder shows translation key
    expect(screen.getByPlaceholderText('placeholder')).toBeInTheDocument();
  });

  it('should call onDataChange when valid URL is entered', async () => {
    const user = userEvent.setup();
    render(<URLForm onDataChange={mockOnDataChange} />);

    const input = screen.getByLabelText('label');
    await user.type(input, 'https://example.com');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith({ url: 'https://example.com' });
    });
  });

  it('should use initial data when provided', () => {
    render(
      <URLForm
        onDataChange={mockOnDataChange}
        initialData={{ url: 'https://initial.com' }}
      />
    );

    expect(screen.getByLabelText('label')).toHaveValue('https://initial.com');
  });

  it('should accept URLs without protocol', async () => {
    const user = userEvent.setup();
    render(<URLForm onDataChange={mockOnDataChange} />);

    const input = screen.getByLabelText('label');
    await user.type(input, 'example.com');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalled();
    });
  });
});
