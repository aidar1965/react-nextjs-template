// next.config.mjs
import createNextIntlPlugin from "next-intl/plugin";
const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Включает Strict Mode в React
  swcMinify: true, // Включает SWC для минификации кода
};

export default withNextIntl(nextConfig);
