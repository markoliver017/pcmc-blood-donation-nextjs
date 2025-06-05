import clsx from "clsx";
import Image from "next/image";
import React from "react";

export default function CustomAvatar({
    avatar,
    whenClick = () => {},
    className,
}) {
    return (
        <div
            className={clsx(
                "relative rounded-4xl mx-auto shadow-xl overflow-hidden cursor-pointer",
                className
            )}
            onClick={whenClick}
        >
            <Image
                src={avatar}
                alt="Avatar"
                fill
                style={{ objectFit: "cover" }}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
        </div>
    );
}
