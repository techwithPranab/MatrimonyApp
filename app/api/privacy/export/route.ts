import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { DataExportService } from '@/lib/privacy/data-export';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const format = (searchParams.get('format') as 'json' | 'csv') || 'json';

    const exportData = await DataExportService.generateDataExportFile(
      session.user.id,
      format
    );

    const contentType = format === 'json' 
      ? 'application/json' 
      : 'text/csv';
    
    const filename = `user-data-export.${format}`;

    return new Response(new Uint8Array(exportData), {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
      },
    });
  } catch (error) {
    console.error('Data export error:', error);
    return NextResponse.json(
      { error: 'Failed to export user data' },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userData = await DataExportService.exportUserData(session.user.id);

    return NextResponse.json({
      success: true,
      data: userData,
      exportedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Data export preview error:', error);
    return NextResponse.json(
      { error: 'Failed to generate data preview' },
      { status: 500 }
    );
  }
}
