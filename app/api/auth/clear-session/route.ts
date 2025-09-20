import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const error = searchParams.get('error');
  
  // Handle JWT decryption errors by clearing session cookies
  if (error === 'JWTDecryptionFailed' || error === 'JWEDecryptionFailed') {
    const response = NextResponse.redirect(new URL('/sign-in?message=session-expired', request.url));
    
    // Clear NextAuth cookies
    response.cookies.set('next-auth.session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire immediately
    });
    
    response.cookies.set('next-auth.csrf-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    
    response.cookies.set('__Secure-next-auth.session-token', '', {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    });
    
    return response;
  }
  
  // For other errors, redirect to sign-in with error message
  return NextResponse.redirect(new URL(`/sign-in?error=${error}`, request.url));
}
