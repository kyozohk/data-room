/**
 * Next.js config — currently just rewrites for unlisted static reports.
 * Static HTML files live under public/reports/<slug>.html, but we expose
 * them at the clean path /reports/<slug> (no extension) via these rewrites.
 */
const nextConfig = {
  async rewrites() {
    return [
      // Clean URL for the CTO report — /reports/cto serves public/reports/cto.html
      {
        source: '/reports/cto',
        destination: '/reports/cto.html',
      },
      // Clean URL for the Vision report — /reports/vision serves public/reports/vision.html
      {
        source: '/reports/vision',
        destination: '/reports/vision.html',
      },
    ];
  },
};

export default nextConfig;
