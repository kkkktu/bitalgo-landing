import type { NextConfig } from "next";

// Set by the GitHub Pages workflow (e.g. "/bitalgo-landing"); empty for local dev.
const basePath = process.env.PAGES_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
