import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VirtualOfficeAccess } from '../VirtualOfficeAccess';

describe('VirtualOfficeAccess', () => {
  it('renders virtual office card', () => {
    render(<VirtualOfficeAccess />);

    expect(screen.getByText('Virtual Office')).toBeInTheDocument();
    expect(screen.getByText(/navigate your departments/i)).toBeInTheDocument();
  });

  it('shows 6 department icon cards', () => {
    const { container } = render(<VirtualOfficeAccess />);

    // Should have 6 department cards (divs with icons)
    const deptCards = container.querySelectorAll('[class*="p-4"][class*="rounded-xl"]');
    expect(deptCards.length).toBe(6);
  });

  it('renders enter office button', () => {
    render(<VirtualOfficeAccess />);

    expect(screen.getByText(/enter office/i)).toBeInTheDocument();
  });

  it('has link to virtual office', () => {
    render(<VirtualOfficeAccess />);

    const link = screen.getByRole('link', { name: /enter office/i });
    expect(link).toHaveAttribute('href', '/virtual-office');
  });
});
