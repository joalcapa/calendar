import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CreateEvent } from '../../../../../../app/components/calendar/events/create/createEvent';

describe('CreateEvent Component', () => {
    const defaultProps = {
        isLoading: false,
        weather: '',
        weatherUrl: '',
        error: '',
        title: '',
        description: '',
        city: '',
        startDate: '',
        isAllDay: false,
        finishDate: '',
        onClose: jest.fn(),
        changeTitle: jest.fn(),
        changeDescription: jest.fn(),
        changeCity: jest.fn(),
        changeStartDate: jest.fn(),
        changeAllDay: jest.fn(),
        changeFinishDate: jest.fn(),
        onSend: jest.fn(),
        operationLabel: 'Crear Evento',
        buttonLabel: '¡Crear ahora!',
        isValidForm: false,
        isDelete: false,
        onDelete: jest.fn(),
        isCreating: false,
    };

    it('should render without crashing', () => {
        render(<CreateEvent {...defaultProps} />);
        expect(screen.getByText('Crear Evento')).toBeInTheDocument();
        expect(screen.getByText('¡Crear ahora!')).toBeInTheDocument();
    });

    it('should display the weather or default message', () => {
        render(<CreateEvent {...defaultProps} city="Bogotá" />);
        expect(screen.getByText('Cargando clima...')).toBeInTheDocument();
    });

    it('should trigger changeTitle when typing in the title input', () => {
        render(<CreateEvent {...defaultProps} />);
        const titleInput = screen.getByTestId('title');
        fireEvent.change(titleInput, { target: { value: 'Nuevo evento' } });
        expect(defaultProps.changeTitle).toHaveBeenCalled();
    });

    it('should disable inputs and button while creating', () => {
        render(<CreateEvent {...defaultProps} isCreating={true} />);
        const titleInput = screen.getAllByTestId('title');
        const sendButton = screen.getByText('¡Crear ahora!');
        expect(titleInput[0]).toBeDisabled();
        expect(sendButton).toBeDisabled();
    });

    it('should show error message if error prop is provided', () => {
        render(<CreateEvent {...defaultProps} error="Error de validación" />);
        expect(screen.getByText('Error de validación')).toBeInTheDocument();
    });

    it('should display delete button if isDelete is true', () => {
        render(<CreateEvent {...defaultProps} isDelete={true} />);
        expect(screen.getByText('Borrar')).toBeInTheDocument();
    });

    it('should trigger onSend when the button is clicked', () => {
        render(<CreateEvent {...defaultProps} isValidForm={true} />);
        const sendButton = screen.getByText('¡Crear ahora!');
        fireEvent.click(sendButton);
        expect(defaultProps.onSend).toHaveBeenCalled();
    });

    it('should trigger onClose when cancel button is clicked', () => {
        render(<CreateEvent {...defaultProps} />);
        const cancelButton = screen.getByText('Cancelar');
        fireEvent.click(cancelButton);
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should not display finish date input if isAllDay is checked', () => {
        render(<CreateEvent {...defaultProps} isAllDay={true} />);
        expect(screen.queryByLabelText('Fecha de Finalización:')).not.toBeInTheDocument();
    });

    it('renders correctly when not loading', () => {
        const { asFragment } = render(<CreateEvent {...defaultProps} title="Evento de prueba" isLoading={false} onSend={jest.fn()} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders correctly when loading', () => {
        const { asFragment } = render(<CreateEvent {...defaultProps} title="Evento de prueba" isLoading={true} onSend={jest.fn()} />);
        expect(asFragment()).toMatchSnapshot();
    });

    it('renders error message when error occurs', () => {
        const { asFragment } = render(<CreateEvent {...defaultProps} title="Evento de prueba" isLoading={false} error="Error de validación" onSend={jest.fn()} />);
        expect(asFragment()).toMatchSnapshot();
    });
});
