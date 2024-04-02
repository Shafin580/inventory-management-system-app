/** @type {import('next').NextConfig} */

const path = require("path")
const isProd = process.env.NODE_ENV === "production"
const apiURL = String(process.env.API_URL)

const nextConfig = {
  experimental: {
    esmExternals: "loose",
    // proxyTimeout: 5000000,
  },
  // - images configuration
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: process.env.PROTOCOL,
        hostname: process.env.HOST_NAME,
        port: process.env.PORT ?? "",
        pathname: "/wp-content/**",
      },
    ],
    // unoptimized: true,
  },
  // - webpack custom configuration
  webpack: (config, { webpack }) => {
    // Enable the topLevelAwait experimental feature
    config.experiments = { layers: true, topLevelAwait: true }

    // Disable warning
    config.module.rules.push({
      test: /@mui\/material/,
      type: "javascript/auto",
    })
    return config
  },
  // - enables sass support in development
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  compiler: {
    // - removes the console.log from production build
    removeConsole: isProd,
  },
  // - dev indicator for build activity in development environment
  devIndicators: {
    buildActivity: true,
    buildActivityPosition: "bottom-left",
  },
  // - allows production builds even if project has ESLint errors
  eslint: {
    // + toggle this to `true` if your deadline is tomorrow 😂
    ignoreDuringBuilds: false,
  },
  // - dangerously allow production builds even if project has type errors
  typescript: {
    // + toggle this to `true` if your boss is nearby during build 😂
    ignoreBuildErrors: false,
  },
  /**
   * React's Strict Mode is a development mode only feature for
   * highlighting potential problems in an application. It helps
   * to identify unsafe lifecycles, legacy API usage, and a
   * number of other features.
   */
  reactStrictMode: true,
  /**
   * Rewrites allow you to map an incoming request path to a different
   * destination path. Rewrites act as a URL proxy and mask the destination
   * path, making it appear the user hasn't changed their location
   * on the site. In contrast, redirects will reroute to a new page
   * and show the URL changes.
   */
  async rewrites() {
    // https://nextjs.org/docs/app/api-reference/next-config-js/rewrites
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        {
          source: "/index",
          destination: "/",
        },
        {
          source: "/index.html",
          destination: "/",
        },
        {
          source: "/index.php",
          destination: "/",
        },
      ],
      afterFiles: [
        // These rewrites are checked after pages/public files
        // are checked but before dynamic routes
        {
          source: "/non-existent",
          destination: "/somewhere-else",
        },
      ],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: "/external/:path*",
          destination: `${apiURL}/:path*`,
        },
      ],
    }
  },
}

module.exports = nextConfig
