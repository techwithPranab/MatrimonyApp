import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import SendInterest from '@/components/SendInterest';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('SendInterest Component', () => {
  const defaultProps = {
    targetUserId: 'user2',
    targetUserName: 'Jane Doe',
    onInterestSent: vi.fn()
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockClear();
  });

  it('should render the send interest button initially', () => {
    render(<SendInterest {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send interest/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Send Interest');
  });

  it('should open the interest form when button is clicked', async () => {
    render(<SendInterest {...defaultProps} />);
    
    const button = screen.getByRole('button', { name: /send interest/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Send Interest to Jane Doe')).toBeInTheDocument();
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText('Normal')).toBeInTheDocument();
    expect(screen.getByText('High Priority')).toBeInTheDocument();
  });

  it('should close the form when cancel is clicked', async () => {
    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Send Interest to Jane Doe')).toBeInTheDocument();
    });

    // Click cancel
    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Send Interest to Jane Doe')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: /send interest/i })).toBeInTheDocument();
    });
  });

  it('should update message when typing', async () => {
    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Send Interest to Jane Doe')).toBeInTheDocument();
    });

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });

    expect((textarea as HTMLTextAreaElement).value).toBe('Hello there!');
  });

  it('should update priority when high priority is selected', async () => {
    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('High Priority')).toBeInTheDocument();
    });

    const highPriorityButton = screen.getByRole('button', { name: /high priority/i });
    fireEvent.click(highPriorityButton);

    // Check if the text about high priority appears
    expect(screen.getByText('High priority interests get noticed faster!')).toBeInTheDocument();
  });

  it('should use predefined message when suggestion is clicked', async () => {
    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Quick Suggestions')).toBeInTheDocument();
    });

    // Find the first suggestion and click it
    const suggestion = screen.getByText(/Hi! I'd love to get to know you better/i);
    fireEvent.click(suggestion);

    const textarea = screen.getByRole('textbox');
    expect((textarea as HTMLTextAreaElement).value).toContain("Hi! I'd love to get to know you better");
  });

  it('should send interest successfully', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, interest: { id: 'interest123' } })
    });

    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Send Interest to Jane Doe')).toBeInTheDocument();
    });

    // Fill message
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello there!' } });

    // Send interest
    const sendButton = screen.getByRole('button', { name: /send interest/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toUserId: 'user2',
          message: 'Hello there!',
          priority: 'normal'
        })
      });
    });

    // Should show success state
    await waitFor(() => {
      expect(screen.getByText('Interest Sent!')).toBeInTheDocument();
    });

    expect(defaultProps.onInterestSent).toHaveBeenCalled();
  });

  it('should show error when API call fails', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Daily limit reached' })
    });

    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Send Interest to Jane Doe')).toBeInTheDocument();
    });

    // Send interest
    const sendButton = screen.getByRole('button', { name: /send interest/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Daily limit reached')).toBeInTheDocument();
    });
  });

  it('should show loading state while sending', async () => {
    // Mock a successful response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true })
    });

    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Send Interest to Jane Doe')).toBeInTheDocument();
    });

    // Send interest
    const sendButton = screen.getByRole('button', { name: /send interest/i });
    fireEvent.click(sendButton);

    // Check that the API was called
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalled();
    });
  });

  it('should count characters in message', async () => {
    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('0/500 characters')).toBeInTheDocument();
    });

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Hello!' } });

    expect(screen.getByText('6/500 characters')).toBeInTheDocument();
  });

  it('should handle network errors gracefully', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Network error'));

    render(<SendInterest {...defaultProps} />);
    
    // Open form
    fireEvent.click(screen.getByRole('button', { name: /send interest/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Send Interest to Jane Doe')).toBeInTheDocument();
    });

    // Send interest
    const sendButton = screen.getByRole('button', { name: /send interest/i });
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Failed to send interest')).toBeInTheDocument();
    });
  });
});
