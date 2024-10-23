import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { NextRequest, NextResponse } from "next/server";

export default function middleware(request: NextRequest) {
  // Проверяем, является ли текущий путь корневым
  if (request.nextUrl.pathname === "/") {
    // Редирект на /dashboard с сохранением текущей локали
    const locale = request.nextUrl.locale || routing.defaultLocale;
    return NextResponse.redirect(new URL(`/${locale}/dashboard`, request.url));
  }

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
