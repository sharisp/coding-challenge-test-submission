// __tests__/ErrorMsg.test.tsx
import { render, screen } from '@testing-library/react';
import ErrorMessage from '@/components/ErrorMsg/ErrorMsg';

describe('ErrorMessage component', () => {
  it('renders nothing when message is undefined', () => {
    render(<ErrorMessage message={undefined} />);
    // 检查 DOM 中没有 error 元素
    const errorDiv = screen.queryByText(/./); 
    expect(errorDiv).toBeNull();
  });

  it('renders the message when provided', () => {
    const testMessage = 'This is an error';
    render(<ErrorMessage message={testMessage} />);
    const errorDiv = screen.getByText(testMessage);
    expect(errorDiv).toBeInTheDocument();
    expect(errorDiv).toHaveClass('error'); // 检查 CSS class
  });
});
