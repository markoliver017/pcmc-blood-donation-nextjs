"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { MapPin, Navigation, Clock, Car, Bus, Train } from "lucide-react";

export default function LocationMap() {
    const locationInfo = {
        address:
            "PCMC Pediatric Blood Center, Quezon Avenue, Quezon City, Philippines",
        coordinates: "14.6091° N, 121.0223° E",
        building: "PCMC Main Building, 3rd Floor",
    };

    const directions = [
        {
            method: "By Car",
            icon: Car,
            description:
                "Parking available on-site. Enter from Quezon Avenue main gate.",
            details: "Free parking for donors and visitors",
        },
        {
            method: "By Public Transport",
            icon: Bus,
            description:
                "Multiple bus routes serve the area. Get off at PCMC stop.",
            details: "Routes: 1, 3, 5, 7, 9, 11, 13, 15",
        },
        {
            method: "By Train",
            icon: Train,
            description:
                "Nearest MRT station is Quezon Avenue Station (1.2 km away).",
            details: "Take a short taxi ride or walk 15 minutes",
        },
    ];

    const nearbyLandmarks = [
        {
            name: "Quezon City Hall",
            distance: "0.5 km",
            direction: "North",
        },
        {
            name: "Quezon Memorial Circle",
            distance: "1.0 km",
            direction: "North",
        },
        {
            name: "SM North EDSA",
            distance: "2.5 km",
            direction: "North",
        },
        {
            name: "UP Diliman",
            distance: "3.0 km",
            direction: "East",
        },
    ];

    return (
        <section className="py-16 bg-gray-50 dark:bg-gray-800">
            <div className="max-w-6xl mx-auto px-4">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Find Us
                    </h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                        Located in the heart of Quezon City, our facility is
                        easily accessible by public transport and private
                        vehicles.
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Map Section */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="space-y-6"
                    >
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
                            {/* Map Placeholder */}
                            <div className="relative h-80 bg-gradient-to-br from-blue-100 to-teal-100 dark:from-gray-700 dark:to-gray-600">
                                <Image
                                    src="/pcmc-building.png"
                                    alt="PCMC Pediatric Blood Center Location"
                                    fill
                                    className="object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                                {/* Location Marker */}
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                                    <div className="w-8 h-8 bg-red-500 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                                        <MapPin className="w-4 h-4 text-white" />
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                                    PCMC Pediatric Blood Center
                                </h3>

                                <div className="space-y-3">
                                    <div className="flex items-start space-x-3">
                                        <MapPin className="w-5 h-5 text-blue-500 mt-1" />
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                {locationInfo.address}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {locationInfo.building}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start space-x-3">
                                        <Navigation className="w-5 h-5 text-green-500 mt-1" />
                                        <div>
                                            <p className="text-gray-900 dark:text-white font-medium">
                                                Coordinates
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {locationInfo.coordinates}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Directions and Information */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="space-y-8"
                    >
                        {/* Getting Here */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Getting Here
                            </h3>

                            <div className="space-y-4">
                                {directions.map((direction, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 10 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.6 + index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className="flex items-start space-x-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div className="flex-shrink-0">
                                            <direction.icon className="w-6 h-6 text-blue-500" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                {direction.method}
                                            </h4>
                                            <p className="text-gray-600 dark:text-gray-300 mb-1">
                                                {direction.description}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {direction.details}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        {/* Nearby Landmarks */}
                        <div className="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                                Nearby Landmarks
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {nearbyLandmarks.map((landmark, index) => (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        transition={{
                                            duration: 0.6,
                                            delay: 0.8 + index * 0.1,
                                        }}
                                        viewport={{ once: true }}
                                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                                    >
                                        <div>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {landmark.name}
                                            </p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {landmark.direction}
                                            </p>
                                        </div>
                                        <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                                            {landmark.distance}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Call to Action */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    viewport={{ once: true }}
                    className="text-center mt-12"
                >
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
                        <h3 className="text-2xl font-bold mb-4">
                            Ready to Visit?
                        </h3>
                        <p className="text-lg mb-6 max-w-2xl mx-auto opacity-90">
                            Plan your visit to our blood center. We recommend
                            calling ahead to confirm operating hours and any
                            special requirements.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <a
                                href="tel:+639284795154"
                                className="btn btn-white btn-lg px-8 py-3 text-lg font-semibold text-blue-600 hover:bg-gray-100"
                            >
                                Call to Confirm
                            </a>
                            <a
                                href="#contact-form"
                                className="btn btn-outline btn-lg px-8 py-3 text-lg font-semibold border-white text-white hover:bg-white hover:text-blue-600"
                            >
                                Schedule Visit
                            </a>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
