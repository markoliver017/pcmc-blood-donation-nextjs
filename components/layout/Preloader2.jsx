"use client";
import { motion } from "framer-motion";

export default function Preloader2({ caption, isLoading }) {
    // const [isLoading, setIsLoading] = useState(true);

    // useEffect(() => {
    //     const timeout = setTimeout(() => {
    //         setIsLoading(false);
    //     }, 1000);

    //     return () => clearTimeout(timeout);
    // }, []);

    return (
        <>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoading ? 1 : 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    {/* Linear Gradient Background */}
                    <div
                        className="bg-white"
                        style={{
                            position: "absolute",
                            width: "100%",
                            height: "100%",
                        }}
                    />

                    {/* Animated Loading Text */}
                    <motion.div
                        className="text-2xl font-semibold text-gray-700 relative"
                        initial={{ color: "#4b5563" }} // Tailwind's text-gray-700
                        animate={{ color: ["#4b5563", "#facc15", "#4b5563"] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        {caption}
                    </motion.div>
                </motion.div>
            )}
        </>
    );
}
