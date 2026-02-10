import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { VirtualOffice } from '../VirtualOffice';

describe('VirtualOffice', () => {
  it('renders all 6 department cards', () => {
    render(<VirtualOffice />);

    expect(screen.getByText('Human Resources')).toBeInTheDocument();
    expect(screen.getByText('Operations')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText('Marketing')).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
    expect(screen.getByText('Innovation')).toBeInTheDocument();
  });

  it('shows efficiency percentages for all departments', () => {
    render(<VirtualOffice />);

    // Should show efficiency for each department (6 departments)
    const percentages = screen.getAllByText(/\d+%/);
    expect(percentages.length).toBeGreaterThanOrEqual(6);
  });

  it('displays department descriptions', () => {
    render(<VirtualOffice />);

    expect(screen.getByText(/manage team members/i)).toBeInTheDocument();
    expect(screen.getByText(/streamline workflows/i)).toBeInTheDocument();
    expect(screen.getByText(/budget, accounting/i)).toBeInTheDocument();
  });

  it('shows virtual office header', () => {
    render(<VirtualOffice />);

    expect(screen.getByText('Virtual Office')).toBeInTheDocument();
  });

  it('displays active member counts', () => {
    render(<VirtualOffice />);

    // Should show member counts for departments
    const counts = screen.getAllByText(/\d{1,2}/);
    expect(counts.length).toBeGreaterThan(0);
  });
});
