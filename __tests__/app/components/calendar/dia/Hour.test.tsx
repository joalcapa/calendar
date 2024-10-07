import React from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom';
import  { Hour } from "../../../../../app/components/calendar/dia/Hour";

jest.mock('../../../../../app/utils/utils', () => ({
    getHourLabel: jest.fn().mockImplementation((hour) => `${hour}:00`),
}));

jest.mock("../../../../../app/components/dnd/EventDrop", (children) => (<>{children}</>));

describe('Hour Component', () => {
    const mockOnHour = jest.fn();

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should render the hour label when isHours is true', () => {
        const hour = new Date(2023, 9, 7, 12);
        render(<Hour onHour={mockOnHour} isHours={true} hour={hour} />);

        expect(screen.getByText(/12:00/i)).toBeInTheDocument();
    });

    it('should not render the hour label when isHours is false', () => {
        const hour = new Date(2023, 9, 7, 12);
        render(<Hour onHour={mockOnHour} isHours={false} hour={hour} />);

        expect(screen.queryByText(/12:00/i)).toBeNull();
    });

    it('should call onHour when clicked', () => {
        const hour = new Date(2023, 9, 7, 12);
        render(<Hour onHour={mockOnHour} isHours={true} hour={hour} />);

        fireEvent.click(screen.getByTestId('hour'));
        expect(mockOnHour).toHaveBeenCalledTimes(1);
    });

    it('should have the correct classes based on isSmallHour', () => {
        const hour = new Date(2023, 9, 7, 12);
        const { rerender } = render(<Hour onHour={mockOnHour} isHours={true} hour={hour} isSmallHour={false} />);

        expect(screen.getByText(/12:00/i)).toHaveClass('absolute left-2 top-0 text-xs');

        rerender(<Hour onHour={mockOnHour} isHours={true} hour={hour} isSmallHour={true} />);
        expect(screen.getByText(/12:00/i)).toHaveClass('relative float-left -left-12 text-[0.7rem] pr-2');
    });
});
