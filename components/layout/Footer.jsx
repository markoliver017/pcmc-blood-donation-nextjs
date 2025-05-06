import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="flex-none py-2 shadow-[1px_-7px_5px_-2px_rgba(0,_0,_0,_0.1)] text-slate-700 dark:text-slate-100">
            <div className="container mx-auto text-center">
                <p>
                    &copy; {new Date().getFullYear()} Philippine Children's
                    Medical Center. All rights reserved.
                </p>
                {/* <p className="text-sm">Follow us on social media</p> */}
                <div className="flex justify-center space-x-4 mt-2">
                    <a
                        href="#"
                        className="flex-items-center text-gray-400 hover:text-blue-600"
                    >
                        <FaFacebook /> Facebook
                    </a>
                    <a
                        href="#"
                        className="flex-items-center text-gray-400 hover:text-blue-600"
                    >
                        <FaTwitter /> Twitter
                    </a>
                    <a
                        href="#"
                        className="flex-items-center text-gray-400 hover:text-blue-600"
                    >
                        <FaInstagram /> Instagram
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
