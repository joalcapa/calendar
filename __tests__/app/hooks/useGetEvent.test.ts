import { renderHook, act, waitFor } from '@testing-library/react';
import useGetEvent from '@/app/hooks/useGetEvent';
import useApi from '@/app/hooks/useApi';
import { mockEvents } from '../../../__mocks__/eventData';
import { AxiosResponse } from 'axios';

type UseApiMock = {
  fetch: jest.Mock<Promise<AxiosResponse<any, any>> | null>;
};

jest.mock('@/app/hooks/useApi');

describe('useGetEvent', () => {
  const mockedFetch = jest.fn();
  (useApi as jest.Mock).mockReturnValue({ fetch: mockedFetch } as UseApiMock);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch event data and update state', async () => {
    mockedFetch.mockResolvedValue({ data: mockEvents[0] });

    const { result } = renderHook(() => useGetEvent());
    expect(result.current.event).toBe(null);

    await act(async () => {
      await result.current.getEvent(1);
    });

    await waitFor(() => {
      expect(result.current.event).toEqual(mockEvents[0]);
    });
  });

  it('should delete event', async () => {
    mockedFetch.mockResolvedValue({ data: { message: 'ok' } });

    const { result } = renderHook(() => useGetEvent());
    expect(result.current.event).toBe(null);

    await act(async () => {
      await result.current.deleteEvent(mockEvents[0].id);
    });

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalled();
    });
  });

  it('should update event', async () => {
    const newEvent = { ...mockEvents[0] };
    newEvent.title = "New title";

    mockedFetch.mockResolvedValue({ data: newEvent });

    const { result } = renderHook(() => useGetEvent());
    expect(result.current.event).toBe(null);

    await act(async () => {
      await result.current.updateEvent(mockEvents[0].id, newEvent);
    });

    await waitFor(() => {
      expect(mockedFetch).toHaveBeenCalled();
      expect(result.current.event?.title).toBe(newEvent.title)
    });
  });
});