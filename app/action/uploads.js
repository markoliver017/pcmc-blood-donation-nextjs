"use client";

// export async function uploadPicture(file) {
//     const formData = new FormData();
//     formData.append("file", file);
//     const res = await fetch("http://10.0.0.185:5000/api/uploads", {
//         method: "POST",
//         body: formData,
//     });

//     return await res.json();
// }

export async function uploadPicture(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("http://10.0.0.185:5000/api/uploads", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!res.ok) {
            // Handle HTTP errors
            throw new Error(data.message || "File upload failed");
        }

        return data;
    } catch (err) {
        // Handle fetch errors (network, CORS, etc.)
        console.error("Upload error:", err);
        if (
            err.message === "NetworkError when attempting to fetch resource." ||
            err.message === "Failed to fetch"
        ) {
            return {
                success: false,
                message:
                    "File Server Error: Cannot connect to file server. Please try again later.",
            };
        }
        return {
            success: false,
            message: err.message || "Something went wrong during upload",
        };
    }
}

export async function uploadPdfFile(file) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch("http://10.0.0.185:5000/api/upload-pdf", {
            method: "POST",
            body: formData,
        });

        const data = await res.json();
        await new Promise((resolve) => setTimeout(resolve, 1000));

        if (!res.ok) {
            // Handle HTTP errors
            throw new Error(data.message || "File upload failed");
        }

        return data;
    } catch (err) {
        // Handle fetch errors (network, CORS, etc.)
        console.error("Upload error:", err);
        if (
            err.message === "NetworkError when attempting to fetch resource." ||
            err.message === "Failed to fetch"
        ) {
            return {
                success: false,
                message:
                    "File Server Error: Cannot connect to file server. Please try again later.",
            };
        }
        return {
            success: false,
            message: err.message || "Something went wrong during upload",
        };
    }
}
