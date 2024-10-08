/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['cdn.weatherapi.com'],
    },
    typescript: {
        ignoreBuildErrors: true,
    },
};

export default nextConfig;
