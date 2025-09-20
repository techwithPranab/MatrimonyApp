import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from 'jose';

export async function middleware(request: NextRequest) {
  // Skip middleware for static files and API routes
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.startsWith('/api/') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return NextResponse.next();
  }

    // Allow bypass for seed route with ?bypass=1
    if (request.nextUrl.pathname === '/api/admin/seed' && request.nextUrl.searchParams.get('bypass') === '1') {
      return NextResponse.next();
    }

    // Allow admin auth routes (login, verify) without token check
    if (request.nextUrl.pathname.startsWith('/api/admin/auth/')) {
      return NextResponse.next();
    }

    // Check if the request is for admin routes
    if (request.nextUrl.pathname.startsWith('/admin')) {
    const token = request.cookies.get('admin-token')?.value;

    // Allow login page without token
    if (request.nextUrl.pathname === '/admin/login') {
      // Redirect to dashboard if already logged in
      if (token) {
        try {
          await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));
          return NextResponse.redirect(new URL('/admin/dashboard', request.url));
        } catch {
          // Invalid token, continue to login
        }
      }
      return NextResponse.next();
    }

    // For all other admin routes, require valid token
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      // Add admin info to headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-id', payload.adminId as string);
      requestHeaders.set('x-admin-role', payload.role as string);
      requestHeaders.set('x-admin-permissions', JSON.stringify(payload.permissions || []));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      // Invalid token
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Check if the request is for protected admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin/') &&
      !request.nextUrl.pathname.startsWith('/api/admin/auth/') &&
      request.nextUrl.pathname !== '/api/admin/seed') {

    const token = request.cookies.get('admin-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    try {
      const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

      // Add admin info to headers for downstream use
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set('x-admin-id', payload.adminId as string);
      requestHeaders.set('x-admin-role', payload.role as string);
      requestHeaders.set('x-admin-permissions', JSON.stringify(payload.permissions || []));

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  // For all other public routes, apply internationalization
  // return intlMiddleware(request);
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Admin routes
    '/admin/:path*',
    '/api/admin/:path*',
    // Internationalized pathnames - Match all non-API routes except root
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|^\\/$).*)',
  ]
};