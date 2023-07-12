'use client';
import {TextBg} from "@/components/textBg/TextBg";
import ElevatingText from "@/components/title/ElevatingText";
import React, {useEffect, useState} from "react";
import {SliderComponentMain} from "@/components/sliderComponent/SliderComponentMain";
import {BottomConect} from "@/pagese/abautPages/buttomConnect/BottomConect";
import {TextAbout} from "@/components/aboutSection/TextAbout";
import {ImagesAbout} from "@/components/aboutSection/ImagesAbout";
import {Build} from "@/components/aboutSection/Build";

export function Contacts (){
    const [showText, setShowText] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollPosition = window.pageYOffset;
            const triggerPosition = 2000;
            const triggerPositionBottom = 3000;


            if (scrollPosition > triggerPosition && scrollPosition < triggerPositionBottom) {
                setShowText(true);
            } else {
                setShowText(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="relative container py-16">
            <div className="fixed bottom-0 inset-x-0">
                <div
                    className={`fixed bottom-0 inset-x-0 transition-opacity transition-height duration-[600ms] ${
                        showText ? 'opacity-200 h-auto' : 'opacity-0 h-0'
                    }`}
                >
                    <TextBg text={"C O N T A C T"} />
                </div>
            </div>
            <div className="z-0 container overflow-hidden text-center">
                <div className="relative ">
                    <div className=" gap-6 relative">
                        <div className=" z-10 p-5 flex order-2 lg:order-1   items-center justify-center px-10 md:px-10  transition-transform duration-300">
                            <h3 className="text-center relative z-20">
                                <ElevatingText mainText={"Start Your Service Today  "} subText={"Today"} />
                                <p className="leading-9 py-7 text-[16px] text-center mb-2  rounded-full " style={{color: '#616161',display: 'inline-block', width: '100%', textAlign: 'center' }}>
                                    Please fill out the required information below and we will reach out to help schedule your service. If you have any questions or would like to get started sooner, please call.

                                </p>
                                <BottomConect />
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
