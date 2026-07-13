/** @type {import('next').NextConfig} */

const API_BASE = process.env.NEXT_PUBLIC_ENVIRONMENT === 'develop'
    ? (process.env.NEXT_PUBLIC_LOCAL_API_URL || 'http://localhost:3000')
    : process.env.NEXT_PUBLIC_API_RAW_URL
 
const nextConfig = {
    async rewrites() {
        return [{
            source: '/api/:path*',
            destination: `${API_BASE}/api/:path*`
        }]
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

module.exports = nextConfig
