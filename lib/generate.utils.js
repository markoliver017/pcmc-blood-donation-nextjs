import puppeteer from "puppeteer";

/**
 * Generates a PDF from the given HTML content.
 *
 * @param {string} html - The HTML content to generate the PDF from.
 * @returns {Promise<Buffer>} A promise that resolves with the generated PDF buffer.
 */
export async function generate_pdf(html) {
    const browser = await puppeteer.launch({
        headless: "new",
        args: [
            "--no-sandbox",
            "--disable-setuid-sandbox",
            "--disable-web-security",
            "--disable-features=VizDisplayCompositor",
        ],
        // Removed margins as it's not a valid option for puppeteer.launch
    });

    const page = await browser.newPage();

    // Allow external resources
    await page.setRequestInterception(true);
    page.on("request", (request) => {
        console.log(">> Request:", request.method(), request.url());
        request.continue();
    });

    page.on("requestfailed", (request) => {
        console.log(
            `>> Request failed: ${request.method()} ${request.url()} (${
                request.failure().errorText
            })`
        );
    });

    await page.setContent(html, {
        waitUntil: ["networkidle0", "load"],
        timeout: 30000,
    });

    // Wait a bit more for images to load
    // await page.waitForTimeout(2000);

    const pdfBuffer = await page.pdf({
        path: "report.pdf",
        format: "Legal",
        landscape: true,
        margin: {
            top: "10mm",
            bottom: "10mm",
            left: "5mm",
            right: "5mm",
        },
        printBackground: true,
        displayHeaderFooter: true,
        footerTemplate: `
                <div style="width: 100%; font-size: 10px; text-align: center; color: #999;">
                    Page <span class="pageNumber"></span> of <span class="totalPages"></span>
                </div>
            `,
        headerTemplate: `<div></div>`,
    });

    await browser.close();

    return pdfBuffer;
}
