import Boutton from '@/components/Boutton';

function Hero() {
    return (
        <div
            className="container-custom section-padding flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-20"
            data-aos="fade-right"
            data-aos-duration="800"
            data-aos-delay="100"
        >
            <div className="flex w-full flex-col gap-5 text-center lg:w-[500px] lg:gap-6 lg:text-left">
                <div className="relative">
                    <img
                        src="/images/line.png"
                        className="absolute left-1/2 top-[35px] -translate-x-1/2 transform sm:top-[40px] lg:left-0 lg:top-[55px] lg:translate-x-0"
                        alt=""
                    />

                    <h1 className="text-gradient text-xl font-medium text-secondary-800 sm:text-4xl lg:text-5xl xl:text-6xl">
                        Ton Avenir commence ici.
                    </h1>
                </div>

                <p className="text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                    Découvre les formations et métiers qui te correspondent grâce à <span className="font-semibold text-primary-1000">OFOQY</span>, la
                    plateforme d'orientation intelligente pour les bacheliers marocains
                </p>

                <div className="mt-4 flex w-full justify-center lg:justify-start">
                    <div className="w-full sm:w-auto">
                        <Boutton />
                    </div>
                </div>
            </div>

            {/* Hero Image Section */}
            <div className="relative order-first w-full lg:order-last lg:w-[50%]">
                <div className="animate-fade-in-up flex justify-center lg:justify-end">
                    <img
                        src="/images/hero.png"
                        alt="OFOQY - Plateforme d'orientation pour bacheliers marocains"
                        className="h-auto w-full max-w-md rounded-lg shadow-lg sm:max-w-lg lg:max-w-xl"
                    />
                </div>
            </div>
        </div>
    );
}

export default Hero;
