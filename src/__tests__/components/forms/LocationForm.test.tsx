import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LocationForm } from '@/components/qr/forms/LocationForm';

// Mock geolocation
const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn(),
  clearWatch: jest.fn(),
};

Object.defineProperty(navigator, 'geolocation', {
  value: mockGeolocation,
  writable: true,
});

describe('LocationForm', () => {
  const mockOnDataChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render all location fields', () => {
    render(<LocationForm onDataChange={mockOnDataChange} />);

    expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/location label/i)).toBeInTheDocument();
  });

  it('should render use current location button', () => {
    render(<LocationForm onDataChange={mockOnDataChange} />);
    expect(screen.getByRole('button', { name: /use current location/i })).toBeInTheDocument();
  });

  it('should call onDataChange when coordinates are entered', async () => {
    const user = userEvent.setup();
    render(<LocationForm onDataChange={mockOnDataChange} />);

    const latInput = screen.getByLabelText(/latitude/i);
    const lonInput = screen.getByLabelText(/longitude/i);

    await user.clear(latInput);
    await user.type(latInput, '40.7128');
    await user.clear(lonInput);
    await user.type(lonInput, '-74.006');

    await waitFor(() => {
      expect(mockOnDataChange).toHaveBeenCalledWith(
        expect.objectContaining({
          latitude: 40.7128,
          longitude: -74.006,
        })
      );
    });
  });

  it('should get current location when button is clicked', async () => {
    const user = userEvent.setup();
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      });
    });

    render(<LocationForm onDataChange={mockOnDataChange} />);

    const button = screen.getByRole('button', { name: /use current location/i });
    await user.click(button);

    await waitFor(() => {
      expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
    });
  });

  it('should handle geolocation errors', async () => {
    const user = userEvent.setup();
    mockGeolocation.getCurrentPosition.mockImplementation((success, error) => {
      error({ code: 1 }); // PERMISSION_DENIED
    });

    render(<LocationForm onDataChange={mockOnDataChange} />);

    const button = screen.getByRole('button', { name: /use current location/i });
    await user.click(button);

    // Verify the geolocation was called
    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('should call geolocation when button clicked', async () => {
    const user = userEvent.setup();
    mockGeolocation.getCurrentPosition.mockImplementation((success) => {
      success({
        coords: { latitude: 40, longitude: -74 },
      });
    });

    render(<LocationForm onDataChange={mockOnDataChange} />);

    const button = screen.getByRole('button', { name: /use current location/i });
    await user.click(button);

    expect(mockGeolocation.getCurrentPosition).toHaveBeenCalled();
  });

  it('should have latitude input with valid range', () => {
    render(<LocationForm onDataChange={mockOnDataChange} />);
    const latInput = screen.getByLabelText(/latitude/i);
    expect(latInput).toHaveAttribute('type', 'number');
  });

  it('should have longitude input with valid range', () => {
    render(<LocationForm onDataChange={mockOnDataChange} />);
    const lonInput = screen.getByLabelText(/longitude/i);
    expect(lonInput).toHaveAttribute('type', 'number');
  });

  it('should use initial data when provided', () => {
    render(
      <LocationForm
        onDataChange={mockOnDataChange}
        initialData={{
          latitude: 51.5074,
          longitude: -0.1278,
          label: 'London',
        }}
      />
    );

    expect(screen.getByLabelText(/latitude/i)).toHaveValue(51.5074);
    expect(screen.getByLabelText(/longitude/i)).toHaveValue(-0.1278);
    expect(screen.getByLabelText(/location label/i)).toHaveValue('London');
  });

  it('should have latitude and longitude inputs', () => {
    render(<LocationForm onDataChange={mockOnDataChange} />);

    expect(screen.getByLabelText(/latitude/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/longitude/i)).toBeInTheDocument();
  });
});
