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
    const [openRegister, setOpenRegister] = useState(false);

    var settings = {
        dots: true,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true, // Add this line
        autoplaySpeed: 15000,
    };
    return (
        <>
            <div className="relative">
                <Slider className="h-full" {...settings}>
                    <div className="h-140 relative">
                        <Image
                            src="/slide-main.jpg"
                            className="h-full w-full object-cover"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                        <p className="absolute top-10 left-10 z-50 bg-white/70 p-4 rounded w-120 dark:text-slate-600">
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
                        </p>
                    </div>
                    <div className="h-140 relative">
                        <Image
                            src="/slide-main-1.jpg"
                            className="h-full w-full object-fit"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                    </div>
                    <div className="h-140 relative">
                        <Image
                            src="/slide-main-3.png"
                            className="h-full w-full object-fit"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                    </div>
                    <div className="h-140 relative">
                        <Image
                            src="/slide-main-4.png"
                            className="h-full w-full object-fit"
                            width={1500}
                            height={1000}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
                    </div>

                    <div className="h-140 relative">
                        <Image
                            src="/slide-main-2.png"
                            className="h-full w-full object-fit"
                            width={1920}
                            height={654}
                            alt="Philippine Children's Medical Center"
                            title="Philippine Children's Medical Center"
                        />
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
                    </div>
                </Slider>
                <div className="absolute bottom-10 left-30 flex gap-5">
                    <button
                        type="button"
                        className="cursor-pointer btn-blue-500 flex-items-center justify-center min-w-48 text-blue-900 bg-[rgba(255,255,255,0.9)] rounded-2xl p-5 border shadow-[5px_5px_0px_0px_rgba(0,_0,_0,_0.5),inset_6px_6px_1px_1px_rgba(0,_0,_0,_0.3)] shadow-blue-800 hover:ring-1 hover:font-semibold"
                        onClick={() => setOpenRegister(true)}
                    >
                        <Handshake className="h-10 w-10" /> Join Us
                    </button>
                    <button
                        type="button"
                        className="cursor-pointer flex-items-center text-blue-900 bg-[rgba(255,255,255,0.9)] rounded-2xl p-5 border shadow-[5px_5px_0px_0px_rgba(0,_0,_0,_0.5),inset_6px_6px_1px_1px_rgba(0,_0,_0,_0.3)] shadow-blue-800 hover:ring-1 hover:font-semibold"
                    >
                        <GiCycle className="h-10 w-10" /> Donation Process
                    </button>
                </div>
            </div>

            <SelectRegisterDrawer
                open={openRegister}
                setOpen={setOpenRegister}
            />
        </>
    );
}
