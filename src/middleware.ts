import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  return createMiddleware(routing)(request);
}

export const config = {
  // Соответствие только для интернационализированных путей, исключая API и ассеты
  matcher: [
    "/",
    "/((?!api|_next/static|_next/image|favicon.ico|apple-touch-icon.png|favicon.svg|images/books|icons|manifest).*)",
    "/(ru|en|kz)/:path*",
  ],
};
