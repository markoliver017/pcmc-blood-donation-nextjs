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
                "relative rounded-4xl mx-auto shadow-xl overflow-hidden",
                className
            )}
            onClick={whenClick}
        >
            <Image
                src={avatar}
                alt="Avatar"
                fill
                style={{ objectFit: "cover" }}
            />
        </div>
    );
}
