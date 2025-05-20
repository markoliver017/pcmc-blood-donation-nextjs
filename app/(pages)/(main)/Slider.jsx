"use client"
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React from "react";
import Slider from "react-slick";
import Image from "next/image";

export default function MainSlider() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };
    return (
        <Slider className="h-full " {...settings}>
            <div className="h-96">
                <Image
                    src="/slide3.jpeg"
                    className="h-full w-full"
                    width={1500}
                    height={1000}
                    alt="Integrated National Medication Reporting System"
                    title="Integrated National Medication Reporting System"
                />
            </div>
            <div className="h-96">
                <Image
                    src="/slide3.jpeg"
                    className="h-full w-full"
                    width={1500}
                    height={1000}
                    alt="Integrated National Medication Reporting System"
                    title="Integrated National Medication Reporting System"
                />
            </div>
            <div className="h-96">
                <Image
                    src="/slide3.jpeg"
                    className="h-full w-full"
                    width={1500}
                    height={1000}
                    alt="Integrated National Medication Reporting System"
                    title="Integrated National Medication Reporting System"
                />
            </div>
            <div className="h-96">
                <Image
                    src="/slide3.jpeg"
                    className="h-full w-full"
                    width={1500}
                    height={1000}
                    alt="Integrated National Medication Reporting System"
                    title="Integrated National Medication Reporting System"
                />
            </div>
            <div className="h-96">
                <Image
                    src="/slide3.jpeg"
                    className="h-full w-full"
                    width={1500}
                    height={1000}
                    alt="Integrated National Medication Reporting System"
                    title="Integrated National Medication Reporting System"
                />
            </div>
            <div className="h-96">
                <Image
                    src="/slide3.jpeg"
                    className="h-full w-full"
                    width={1500}
                    height={1000}
                    alt="Integrated National Medication Reporting System"
                    title="Integrated National Medication Reporting System"
                />
            </div>
        </Slider>
    );
}