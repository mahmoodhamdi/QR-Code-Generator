import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TextForm } from '@/components/qr/forms/TextForm';

describe('TextForm', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render text input field', () => {
    render(<TextForm onDataChange={mockOnDataChange} />);
    // With i18n mock, label shows translation key
    expect(screen.getByLabelText('label')).toBeInTheDocument();
  });

  it('should show character count', () => {
    render(<TextForm onDataChange={mockOnDataChange} />);
    expect(screen.getByText('0 / 4000')).toBeInTheDocument();
  });

  it('should call onDataChange when text is entered', async () => {
    const user = userEvent.setup();
    render(<TextForm onDataChange={mockOnDataChange} />);

    const input = screen.getByLabelText('label');
    await user.type(input, 'Hello World');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith({ text: 'Hello World' });
    });
  });

  it('should update character count as user types', async () => {
    const user = userEvent.setup();
    render(<TextForm onDataChange={mockOnDataChange} />);

    const input = screen.getByLabelText('label');
    await user.type(input, 'Test');

    expect(screen.getByText('4 / 4000')).toBeInTheDocument();
  });

  it('should use initial data when provided', () => {
    render(
      <TextForm
        onDataChange={mockOnDataChange}
        initialData={{ text: 'Initial Text' }}
      />
    );

    expect(screen.getByLabelText('label')).toHaveValue('Initial Text');
  });

  it('should have empty text area by default', () => {
    render(<TextForm onDataChange={mockOnDataChange} />);

    const input = screen.getByLabelText('label');
    expect(input).toHaveValue('');
  });
});
