import React, { useEffect } from 'react';
import Splide from '@splidejs/splide';
import { AutoScroll } from '@splidejs/splide-extension-auto-scroll';
import agoda from "../../assets/Agoda.png";
import airbnb from "../../assets/airbnb.jpeg";
import booking from "../../assets/Booking-Logo.png";
import expedia from "../../assets/Expedia-Logo.png";
import trivago from "../../assets/Trivago.png";
import '@splidejs/splide/dist/css/splide.min.css';

export const Partners = () => {
    const logos = [
        { name: 'Agoda', logo: agoda },
        { name: 'Airbnb', logo: airbnb },
        { name: 'Booking', logo: booking },
        { name: 'Expedia', logo: expedia },
        { name: 'Trivago', logo: trivago },
    ];

    useEffect(() => {
        const splide = new Splide('.splide', {
            type: 'loop',
            drag: 'free',
            perPage: 5,
            focus: 'center',
            autoScroll: {
                speed: 1,
            },
            gap: '20px',
            arrows: false,
            pagination: false,
        });

        splide.mount({ AutoScroll });
    }, []);

    return (
        <section className="py-10 text-center bg-transparent overflow-x-hidden">
            <h2 className="text-3xl font-bold mb-10">
                Our Trusted Partners
            </h2>

            <div className="splide max-w-screen-xl mx-auto overflow-hidden">
                <div className="splide__track">
                    <ul className="splide__list">
                        {logos.map((partner, index) => (
                            <li key={index} className="splide__slide">
                                <img
                                    src={partner.logo}
                                    alt={partner.name}
                                    className="mx-auto max-w-[150px] max-h-[50px] object-contain"
                                />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
};
