import HeroSection from "@components/pages/ContactUs/HeroSection";
import ContactInfo from "@components/pages/ContactUs/ContactInfo";
import ContactForm from "@components/pages/ContactUs/ContactForm";
import LocationMap from "@components/pages/ContactUs/LocationMap";
import OfficeHours from "@components/pages/ContactUs/OfficeHours";
import BreadcrumbNav from "@components/pages/shared/BreadcrumbNav";

export default function ContactUsPage() {
    return (
        <main className="min-h-screen bg-white dark:bg-gray-900">
            {/* Breadcrumb Navigation */}
            {/* <BreadcrumbNav
                items={[
                    { label: "Home", href: "/" },
                    { label: "Contact Us", href: "/contact-us", current: true },
                ]}
                variant="light"
            /> */}

            {/* Hero Section */}
            <HeroSection />

            {/* Contact Information */}
            <ContactInfo />

            {/* Contact Form */}
            <ContactForm />

            {/* Location Map */}
            <LocationMap />

            {/* Office Hours */}
            <OfficeHours />
        </main>
    );
}
