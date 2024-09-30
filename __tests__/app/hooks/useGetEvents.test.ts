import { renderHook, act, waitFor } from '@testing-library/react';
import useGetEvents from '@/app/hooks/useGetEvents';
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
    mockedFetch.mockResolvedValue({ data: mockEvents });

    const { result } = renderHook(() => useGetEvents());
    expect(result.current.events.length).toBe(0);

    await act(async () => {
      await result.current.getEvents();
    });

    await waitFor(() => {
      expect(result.current.events.length).toEqual(mockEvents.length);
    });
  });
});