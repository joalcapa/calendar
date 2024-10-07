const useEvents = () => (
    {
        onCreate: jest.fn().mockResolvedValueOnce(77) as jest.Mock<Promise<void>>,
        deleteEvent: jest.fn() as jest.Mock<Promise<void>>,
        updateEvent: jest.fn() as jest.Mock<Promise<void>>,
        isCreating: false,
    }
);

export default useEvents;