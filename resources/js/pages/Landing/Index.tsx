import React from 'react';
import Navbar from './Sections/Navbar';
import Hero from './Sections/Hero';
import Services from "./Sections/Services";
import Orientation from "./Sections/Orientation"
import WhyOfoqy from "./Sections/WhyOfoqy";
import Packs from "./Sections/Packs";
import Testimonials from "./Sections/Testimonials";
import AboutUs from "./Sections/AboutUs";
import Footer from "./Sections/Footer";


function Index(){
    return(
        <div>
            <Navbar />
            <Hero />
            <Services />
            <AboutUs />
            <Orientation />
            <WhyOfoqy />
            <Packs />
            <Testimonials />
            <Footer />

        </div>
       
    );
};
export default Index;