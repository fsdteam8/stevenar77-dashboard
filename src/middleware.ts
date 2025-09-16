import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = req.nextUrl;

  // Public paths that don't require authentication
  const isPublicPath = pathname === "/login";

  // If user is authenticated and tries to access public paths
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is not authenticated and tries to access protected paths
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|images|public|favicon.ico).*)"],
};