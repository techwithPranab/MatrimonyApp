import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

// Local bypass: allow seeding if NODE_ENV is 'development' or if ?bypass=1 is set
function isLocalBypass(request: Request) {
  if (process.env.NODE_ENV === 'development') return true;
  try {
    const url = new URL(request.url);
    return url.searchParams.get('bypass') === '1';
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!isLocalBypass(request)) {
    return NextResponse.json({ success: false, error: 'Unauthorized (no local bypass)' }, { status: 401 });
  }
  const execAsync = promisify(exec);
  try {
    const { stdout } = await execAsync('npx tsx seedAll.ts', { cwd: process.cwd() });
    return NextResponse.json({ success: true, output: stdout }, { status: 200 });
  } catch (error: unknown) {
    let errorMsg = 'Unknown error';
    let errorStderr = '';
    if (typeof error === 'object' && error !== null) {
      if ('stderr' in error && typeof (error as { stderr?: unknown }).stderr === 'string') {
        errorStderr = (error as { stderr: string }).stderr;
      }
      if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
        errorMsg = (error as { message: string }).message;
      }
    }
    return NextResponse.json({ success: false, error: errorStderr || errorMsg }, { status: 500 });
  }
}
