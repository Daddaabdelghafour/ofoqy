import React from 'react';
import NavBar from './Sections/Navbar';
import AboutUs from './Sections/AboutUs';
import Orientation from './Sections/Orientation';
import Testimonials from './Sections/Testimonials';


function LandingPage() {
    return (
        <div>
            <NavBar />
            <AboutUs />
            <Orientation />
            <Testimonials />
           
        </div>
    );
}

export default LandingPage;