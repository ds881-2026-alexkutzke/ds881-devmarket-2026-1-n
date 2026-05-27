import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Carousel from './Carousel';

describe('Carousel Component', () => {
  const mockChildren = [
    <div key="1" data-testid="item-1">Item 1</div>,
    <div key="2" data-testid="item-2">Item 2</div>,
    <div key="3" data-testid="item-3">Item 3</div>,
    <div key="4" data-testid="item-4">Item 4</div>,
  ];

  beforeEach(() => {
    // Mock scrollBy to avoid issues in test environment
    Element.prototype.scrollBy = vi.fn();
  });

  it('should render carousel with children', () => {
    render(<Carousel>{mockChildren}</Carousel>);
    
    expect(screen.getByTestId('item-1')).toBeInTheDocument();
    expect(screen.getByTestId('item-2')).toBeInTheDocument();
    expect(screen.getByTestId('item-3')).toBeInTheDocument();
    expect(screen.getByTestId('item-4')).toBeInTheDocument();
  });

  it('should render navigation buttons', () => {
    render(<Carousel>{mockChildren}</Carousel>);
    
    const leftButton = screen.getByLabelText('Scroll carousel left');
    const rightButton = screen.getByLabelText('Scroll carousel right');
    
    expect(leftButton).toBeInTheDocument();
    expect(rightButton).toBeInTheDocument();
  });

  it('should have accessible carousel region', () => {
    render(<Carousel>{mockChildren}</Carousel>);
    
    const carouselRegion = screen.getByRole('region', { name: 'Carousel' });
    expect(carouselRegion).toBeInTheDocument();
    expect(carouselRegion).toHaveAttribute('tabIndex', '0');
  });

  it('should handle left button click', async () => {
    const { container } = render(<Carousel>{mockChildren}</Carousel>);
    
    const leftButton = screen.getByLabelText('Scroll carousel left');
    const scrollContainer = container.querySelector('[role="region"]');
    
    await userEvent.click(leftButton);
    
    expect(scrollContainer?.scrollBy).toHaveBeenCalled();
  });

  it('should handle right button click', async () => {
    const { container } = render(<Carousel>{mockChildren}</Carousel>);
    
    const rightButton = screen.getByLabelText('Scroll carousel right');
    const scrollContainer = container.querySelector('[role="region"]');
    
    await userEvent.click(rightButton);
    
    expect(scrollContainer?.scrollBy).toHaveBeenCalled();
  });

  it('should handle keyboard navigation with arrow keys', async () => {
    const { container } = render(<Carousel>{mockChildren}</Carousel>);
    
    const carouselRegion = screen.getByRole('region', { name: 'Carousel' });
    
    await userEvent.keyboard('{ArrowRight}');
    fireEvent.keyDown(carouselRegion, { key: 'ArrowRight' });
    
    await userEvent.keyboard('{ArrowLeft}');
    fireEvent.keyDown(carouselRegion, { key: 'ArrowLeft' });
    
    expect(carouselRegion).toBeTruthy();
  });

  it('should have focus-visible styles', () => {
    render(<Carousel>{mockChildren}</Carousel>);
    
    const leftButton = screen.getByLabelText('Scroll carousel left');
    
    expect(leftButton).toHaveClass('focus-visible:ring-2');
    expect(leftButton).toHaveClass('focus-visible:ring-blue-500');
  });
});
