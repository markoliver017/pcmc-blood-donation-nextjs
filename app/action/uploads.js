"use client";

export async function uploadPicture(file) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("http://10.0.0.185:5000/api/uploads", {
        method: "POST",
        body: formData,
    });

    return await res.json();
}
