import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from '../app/dashboard/page';

// Mock the router
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      refresh: jest.fn(),
    };
  },
}));

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve([
      { id: '1', title: 'Test Todo', completed: false },
    ]),
  })
) as jest.Mock;

describe('Dashboard', () => {
  it('renders todo list', async () => {
    render(<Dashboard />);
    
    // Check if the title is rendered
    expect(screen.getByText('My Todos')).toBeInTheDocument();
    
    // Check if the input field is rendered
    expect(screen.getByPlaceholderText('Add a new todo...')).toBeInTheDocument();
    
    // Wait for todos to load
    const todoItem = await screen.findByText('Test Todo');
    expect(todoItem).toBeInTheDocument();
  });

  it('adds new todo', async () => {
    render(<Dashboard />);
    
    const input = screen.getByPlaceholderText('Add a new todo...');
    const addButton = screen.getByText('Add Todo');
    
    fireEvent.change(input, { target: { value: 'New Todo' } });
    fireEvent.click(addButton);
    
    // Check if fetch was called with correct data
    expect(fetch).toHaveBeenCalledWith('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Todo' }),
    });
  });
});