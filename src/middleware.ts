import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Only check admin role for /create routes
    if (path.startsWith("/create") && token?.role !== "admin") {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
    },
  }
);

export const config = {
  matcher: [
    // Protect /create routes
    "/create/:path*",
    "/create/:path*/edit",
    // Allow all other routes to pass through
    "/((?!api|_next/static|_next/image|favicon.ico|auth/signin).*)",
  ],
};
