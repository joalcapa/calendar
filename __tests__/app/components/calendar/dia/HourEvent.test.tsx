import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import  HourEvent from "../../../../../app/components/calendar/dia/HourEvent";
import '@testing-library/jest-dom';
import { mockEvents } from '../../../../../__mocks__/eventData';

const mockEvent = mockEvents[0]

describe('HourEvent Component', () => {
    const onClick = jest.fn();

    const setup = (props = {}) => {
        const initialProps = {
            onMouseEnter: jest.fn(),
            onMouseLeave: jest.fn(),
            onClick: onClick,
            isHours: true,
            eventStart: 50,
            event: mockEvent,
            height: 40,
            hourLabel: '10:00 AM',
            leftPosition: '20px',
            isHovered: false,
            isDragging: false,
            isSmallHour: false,
            ...props,
        };

        return render(<HourEvent {...initialProps} />);
    };

    test('renders the HourEvent component', () => {
        const { getByText } = setup();
        expect(getByText('Test title')).toBeInTheDocument();
        expect(getByText('10:00 AM')).toBeInTheDocument();
    });

    test('calls onClick when clicked', () => {
        const { getByTestId } = setup();

        fireEvent.click(getByTestId('event'));
        expect(onClick).toHaveBeenCalled();
    });

    test('applies correct styles based on props', () => {
        const { container } = setup({ height: 30 });
        expect(container.firstChild).toHaveStyle('height: 30px');
    });
});
