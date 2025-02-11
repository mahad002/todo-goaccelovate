import { render, screen, fireEvent, act } from '@testing-library/react';
import SignIn from '../app/auth/signin/page';
import Register from '../app/auth/register/page';
import Dashboard from '../app/dashboard/page';
import '@testing-library/jest-dom';

// Mock UI components
jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, type = 'button', disabled }: any) => (
    <button onClick={onClick} type={type} disabled={disabled}>{children}</button>
  ),
}));

jest.mock('@/components/ui/form', () => ({
  Form: ({ children }: any) => children,
  FormField: ({ render }: any) => {
    const field = {
      value: '',
      onChange: (e: any) => {
        field.value = e.target.value;
        return field.value;
      },
      name: '',
    };
    return render({ field });
  },
  FormItem: ({ children }: any) => <div>{children}</div>,
  FormLabel: ({ children }: any) => <label>{children}</label>,
  FormControl: ({ children }: any) => children,
  FormMessage: () => null,
}));

jest.mock('@/components/ui/input', () => ({
  Input: ({ placeholder, type, onChange, value, ...props }: any) => {
    const handleChange = (e: any) => {
      if (onChange) {
        onChange(e);
      }
    };

    return (
      <input 
        data-testid={`input-${placeholder || type}`} 
        placeholder={placeholder}
        type={type}
        onChange={handleChange}
        value={value || ''}
        {...props}
      />
    );
  },
}));

jest.mock('@/components/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardHeader: ({ children }: any) => <div>{children}</div>,
  CardTitle: ({ children }: any) => <h2>{children}</h2>,
  CardContent: ({ children }: any) => <div>{children}</div>,
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

// Mock sonner toast
jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
  Toaster: () => null,
}));

// Mock fetch
global.fetch = jest.fn(() => 
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([])
  })
) as jest.Mock;

describe('Basic App Tests', () => {
  beforeEach(() => {
    (global.fetch as jest.Mock).mockClear();
  });

  describe('Sign In', () => {
    it('renders sign in form', () => {
      render(<SignIn />);
      expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });

    it('allows email input', async () => {
      render(<SignIn />);
      const emailInput = screen.getByTestId('input-email@example.com');
      
      await act(async () => {
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
      });

      await act(async () => {
        expect(emailInput).toHaveAttribute('value', 'test@example.com');
      });
    });
  });

  describe('Register', () => {
    it('renders register form', () => {
      render(<Register />);
      expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    });

    it('allows input fields to be filled', async () => {
      render(<Register />);
      
      const usernameInput = screen.getByTestId('input-johndoe123');
      const emailInput = screen.getByTestId('input-email@example.com');
      const passwordInput = screen.getByTestId('input-password');
      
      await act(async () => {
        fireEvent.change(usernameInput, { target: { value: 'testuser' } });
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
      });

      await act(async () => {
        expect(usernameInput).toHaveAttribute('value', 'testuser');
        expect(emailInput).toHaveAttribute('value', 'test@example.com');
        expect(passwordInput).toHaveAttribute('value', 'password123');
      });
    });
  });

  describe('Dashboard', () => {
    beforeEach(() => {
      // Mock successful todos fetch
      (global.fetch as jest.Mock).mockImplementation(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve([])
        })
      );
    });

    it('renders dashboard', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      expect(screen.getByRole('heading', { name: /my tasks/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
    });

    it('shows add task input', async () => {
      await act(async () => {
        render(<Dashboard />);
      });
      const input = screen.getByTestId('input-Add a new task...');
      
      await act(async () => {
        fireEvent.change(input, { target: { value: 'New Task' } });
      });

      await act(async () => {
        expect(input).toHaveAttribute('value', 'New Task');
      });
    });
  });
});