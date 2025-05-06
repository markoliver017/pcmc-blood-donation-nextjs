import { generate_pdf } from "@lib/generate.utils";
import { NextResponse } from "next/server";


export async function POST(request) {
    const body = await request.json();
    const { html } = body;

    if (!html) {
        return NextResponse.json(
            { message: "HTML content required" },
            { status: 400 }
        );
    }

    try {
        const pdfBuffer = await generate_pdf(html);

        return new NextResponse(pdfBuffer, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": 'attachment; filename="file.pdf"',
            },
        });

    } catch (err) {
        console.error("PDF generation error:", err);
        return NextResponse.json(
            { message: "PDF generation failed" },
            { status: 500 }
        );
    }
}
