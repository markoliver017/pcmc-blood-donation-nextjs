"use client";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import React, { useState } from "react";
import Slider from "react-slick";
import Image from "next/image";

import { Handshake } from "lucide-react";
import { GiCycle } from "react-icons/gi";
import SelectRegisterDrawer from "./SelectRegisterDrawer";

export default function MainSlider() {
    var settings = {
        dots: true,
        infinite: true,
        speed: 2000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Add this line
        autoplaySpeed: 10000,
    };
    return (
        <>
            <div className="relative z-10">
                <Slider className="h-full" {...settings}>
                    <div className="h-180 relative group transition-all duration-700 hover:cursor-pointer">
                        <Image
                            src="/slide-main.jpg"
                            className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                        {/* <p className="absolute top-10 left-10 z-50 bg-white/70 p-4 rounded w-120 dark:text-slate-600 transform transition-transform duration-700 group-hover:-translate-x-2 group-hover:scale-[1.01]">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Odit temporibus laborum cum inventore
                            molestiae nisi tempora nostrum rem praesentium ea
                            quam dolores aliquam ad, voluptas vel corporis vero
                            eaque laudantium est, hic facilis! Magnam reiciendis
                            ipsam aperiam nihil facere eius voluptas, eaque
                            natus libero, labore distinctio. Quaerat doloribus,
                            saepe nam veniam harum tempora quis enim voluptas
                            officiis neque minima ducimus exercitationem id
                            animi odio officia quia labore adipisci hic atque
                            temporibus aperiam tenetur. Atque officia beatae est
                            nostrum tempora non itaque velit voluptatum rem quam
                            vel eius veniam quisquam ex totam repellat, facilis
                            dolorum ipsam, impedit soluta obcaecati nesciunt
                            quibusdam!
                        </p> */}
                    </div>
                    <div className="h-180 relative group  transition-all duration-700 hover:cursor-pointer">
                        <Image
                            src="/bg-image-new-1.png"
                            className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                    </div>
                    <div className="h-180 relative group  transition-all duration-700 hover:cursor-pointer">
                        <Image
                            src="/slider-main-2.png"
                            className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                    </div>
                    {/* <div className="h-180 relative group  transition-all duration-700 hover:cursor-pointer">
                        <Image
                            src="/loader_main.gif"
                            className="h-full w-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                    </div> */}

                    {/* <div className="h-180 relative group  transition-all duration-700 hover:cursor-pointer"> */}
                    {/* <Image
                            src="/slide-main-2.png"
                            className="h-full w-full object-fill rounded-2xl group-hover:scale-105 transition-transform duration-700"
                            width={1920}
                            height={654}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        /> */}
                    {/* <p className="absolute top-3 right-20 z-50 bg-white/70 p-4 rounded w-140">
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Odit temporibus laborum cum inventore
                            molestiae nisi tempora nostrum rem praesentium ea
                            quam dolores aliquam ad, voluptas vel corporis vero
                            eaque laudantium est, hic facilis! Magnam reiciendis
                            ipsam aperiam nihil facere eius voluptas, eaque
                            natus libero, labore distinctio. Quaerat doloribus,
                            saepe nam veniam harum tempora quis enim voluptas
                            officiis neque minima ducimus exercitationem id
                            animi odio officia quia labore adipisci hic atque
                            temporibus aperiam tenetur. Atque officia beatae est
                            nostrum tempora non itaque velit voluptatum rem quam
                            vel eius veniam quisquam ex totam repellat, facilis
                            dolorum ipsam, impedit soluta obcaecati nesciunt
                            quibusdam!
                        </p> */}
                    {/* </div> */}
                </Slider>
                {/* <div className="absolute bottom-10 left-30 flex gap-5">

                </div> */}
            </div>
        </>
    );
}
