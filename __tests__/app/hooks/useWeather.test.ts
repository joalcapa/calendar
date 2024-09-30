import { renderHook, act, waitFor } from '@testing-library/react';
import useWeather from '@/app/hooks/useWeather';
import useApi from '@/app/hooks/useApi';
import { AxiosResponse } from 'axios';

type UseApiMock = {
  fetch: jest.Mock<Promise<AxiosResponse<any, any>> | null>;
};

jest.mock('@/app/hooks/useApi');

describe('useWeather', () => {
  it('should fetch weather data and update state', async () => {
    const mockedFetch = jest.fn();

    (useApi as jest.Mock).mockReturnValue({ fetch: mockedFetch } as UseApiMock);

    const weather = {
      temperature: 20,
      condition: 'Sunny',
      icon: 'http://icons.io/icons/ico.png',
    };

    mockedFetch.mockResolvedValue({ data: weather });

    const { result } = renderHook(() => useWeather());
    expect(result.current.weather).toBe(null);

    await act(async () => {
      await result.current.getWeather({ location: 'Bogotá', datetime: '2024-09-29' });
    });

    await waitFor(() => {
      expect(result.current.weather).toEqual(weather);
    });
  });
});