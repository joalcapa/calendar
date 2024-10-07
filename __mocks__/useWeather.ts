const useWeather = () => ({
    getWeather: jest.fn().mockResolvedValue({
        condition: "Soleado",
        icon: "images.com/i.png",
        temperature: 30
    }) as jest.Mock<Promise<{ condition: string, icon: string, temperature: number }>>,
});

export default useWeather;
