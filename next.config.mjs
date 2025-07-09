/** @type {import('next').NextConfig} */
const nextConfig = {
    // devIndicators: false,
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "avatar.iran.liara.run",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/uploads/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "3000",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "5000",
                pathname: "/uploads/**",
            },
            {
                protocol: "http",
                hostname: "10.0.0.185",
                port: "5000",
                pathname: "/uploads/**",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
                pathname: "/**",
            },
        ],
    },
    experimental: {
        serverActions: {
            bodySizeLimit: "2mb",
        },
        // nodeMiddleware: true,
    },

    // env: {
    //     host: "http://localhost:3000",
    //     SESSION_PASSWORD: "this-is-a-very-long-super-secret-password-123",
    //     NEXTAUTH_URL: "http://localhost:3000",
    //     NEXTAUTH_SECRET: "this-is-a-very-long-super-secret-password-123",
    //     DB_PASSWORD: "root",
    //     AUTH_SECRET: "aw3UOdK3jUmLJGgbx3lMIczkKnOVFS/06Sk84l5+N2k=",
    // },
    // productionBrowserSourceMaps: true,
    // compiler: {
    //     removeConsole: false,
    // },
    // typescript: {
    //     ignoreBuildErrors: true,
    // },
    // eslint: {
    //     ignoreDuringBuilds: true,
    // },
    // webpack: (config, { isServer }) => {
    //     if (!isServer) {
    //         config.resolve.fallback = {
    //             fs: false,
    //             net: false,
    //             tls: false,
    //             mysql2: false,
    //         };
    //     }
    //     return config;
    // },
    // experimental: {
    //     turbo: false,
    // },
};

export default nextConfig;
