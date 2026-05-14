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
    ];
  },
};

export default nextConfig;
