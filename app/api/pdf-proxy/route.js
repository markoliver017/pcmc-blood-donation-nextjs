import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const pdfUrl = searchParams.get('url');
        
        if (!pdfUrl) {
            return NextResponse.json({ error: 'PDF URL is required' }, { status: 400 });
        }

        // Validate that the URL is from your trusted backend
        const allowedHosts = ['localhost:4000', '10.0.0.185:5000', 'localhost:5000'];
        const urlObj = new URL(pdfUrl);
        const isAllowedHost = allowedHosts.some(host => urlObj.host === host);
        
        if (!isAllowedHost) {
            return NextResponse.json({ error: 'Unauthorized PDF source' }, { status: 403 });
        }

        // Fetch the PDF from your backend
        const response = await fetch(pdfUrl);
        
        if (!response.ok) {
            return NextResponse.json({ error: 'Failed to fetch PDF' }, { status: response.status });
        }

        const pdfBuffer = await response.arrayBuffer();
        
        // Return the PDF with proper headers
        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': 'inline',
                'Cache-Control': 'public, max-age=3600',
            },
        });
    } catch (error) {
        console.error('PDF proxy error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
