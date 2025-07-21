import { ArrowRight } from 'lucide-react';

function Hero() {
    return (
        <div className="container-custom section-padding flex flex-col items-center gap-8 lg:flex-row lg:items-start lg:gap-20">
            <div className="flex w-full flex-col gap-5 text-center lg:w-[500px] lg:gap-6 lg:text-left">
                <div className="relative">
                    <svg
                        className="absolute left-1/2 top-[35px] -translate-x-1/2 transform sm:top-[40px] lg:left-0 lg:top-[45px] lg:translate-x-0"
                        width="140"
                        height="25"
                        viewBox="0 0 160 30"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        role="presentation"
                        aria-hidden="true"
                    >
                        <path
                            d="M5 20 C40 10, 110 10, 145 20 
           C120 30, 70 15, 90 50"
                            stroke="#3E8A9E"
                            strokeWidth="3"
                            strokeLinecap="round"
                            fill="none"
                        />
                    </svg>

                    <h1 className="text-3xl font-bold text-secondary-800 sm:text-4xl lg:text-5xl xl:text-6xl">Ton Avenir commence ici.</h1>
                </div>

                <p className="text-sm leading-relaxed text-gray-600 sm:text-base lg:text-lg">
                    Découvre les formations et métiers qui te correspondent grâce à <span className="font-semibold text-primary-500">OFOQY</span>, la
                    plateforme d'orientation intelligente pour les bacheliers marocains
                </p>

                <div className="mt-4">
                    <button className="btn btn-primary border-primay-600 mx-auto flex w-full items-center justify-center gap-2 rounded-sm border bg-primary-600 px-6 py-3 transition-all duration-200 hover:scale-105 hover:border-primary-700 hover:bg-white hover:text-primary-700 active:scale-95 sm:w-[200px] lg:mx-0">
                        <span className="text-lg font-medium">Commencer</span>
                        <ArrowRight className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="relative order-first h-[300px] w-full sm:h-[400px] lg:order-last lg:h-[500px] lg:w-[50%]">
                {/* Chat Bubbles - Questions des étudiants */}
                <div className="animate-fade-in-up absolute right-[60%] top-[30px] w-fit sm:right-[55%] sm:top-[40px] lg:right-[33%] lg:top-[50px]">
                    <div className="chat-bubble w-[110px] rounded-lg bg-neutral-900 p-2 text-xs text-white shadow-lg sm:w-[130px] sm:p-3 sm:text-sm">
                        Je suis perdu...
                    </div>
                </div>

                <div
                    className="animate-fade-in-up absolute right-[55%] top-[80px] w-fit sm:right-[50%] sm:top-[100px] lg:right-[38%] lg:top-[120px]"
                    style={{ animationDelay: '0.2s' }}
                >
                    <div className="chat-bubble w-[140px] rounded-lg bg-neutral-900 p-2 text-xs text-white shadow-lg sm:w-[170px] sm:p-3 sm:text-sm">
                        Je veux bosser vite.
                    </div>
                </div>

                {/* Chat Bubbles - Réponses OFOQY */}
                <div
                    className="animate-fade-in-up absolute right-[45%] top-[180px] w-fit sm:right-[42%] sm:top-[230px] lg:right-[30%] lg:top-[280px]"
                    style={{ animationDelay: '0.4s' }}
                >
                    <div className="chat-bubble rounded-lg bg-primary-500 p-2 text-xs text-white shadow-lg sm:p-3 sm:text-sm">Pas grave&#128522;</div>
                </div>

                <div
                    className="animate-fade-in-up absolute right-[35%] top-[230px] w-fit sm:right-[32%] sm:top-[280px] lg:right-[30%] lg:top-[380px]"
                    style={{ animationDelay: '0.6s' }}
                >
                    <div className="chat-bubble rounded-lg bg-primary-500 p-2 text-xs text-white shadow-lg sm:p-3 sm:text-sm">Formation Rapide</div>
                </div>

                {/* Blob Images */}
                <div className="animate-fade-in-up absolute right-0 top-0" style={{ animationDelay: '0.8s' }}>
                    <svg
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[200px] w-[200px] sm:h-[250px] sm:w-[250px] lg:h-[300px] lg:w-[300px]"
                        role="img"
                        aria-label="Étudiant"
                    >
                        <defs>
                            <clipPath id="blobClipTop">
                                <path
                                    d="M59.7,-20.6C67.3,4.1,56.6,33.5,33.8,51.1C11.1,68.6,-23.5,74.3,-40,60.9C-56.5,47.5,-54.9,15.1,-45.3,-12.4C-35.6,-40,-17.8,-62.6,4.1,-63.9C26,-65.3,52.1,-45.3,59.7,-20.6Z"
                                    transform="translate(100 100)"
                                />
                            </clipPath>
                        </defs>

                        <image href="/student.jpg" width="100%" height="100%" clipPath="url(#blobClipTop)" preserveAspectRatio="xMidYMid slice" />
                    </svg>
                </div>

                <div className="animate-fade-in-up absolute bottom-0 left-0 lg:left-auto" style={{ animationDelay: '1s' }}>
                    <svg
                        viewBox="0 0 200 200"
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-[150px] w-[150px] sm:h-[200px] sm:w-[200px] lg:h-[300px] lg:w-[300px]"
                        role="img"
                        aria-label="Formation professionnelle"
                    >
                        <defs>
                            <clipPath id="blobClipBottom">
                                <path
                                    d="M44.7,-76.4C58.8,-69.2,71.8,-59.3,79.6,-45.8C87.4,-32.4,90,-15.4,87.1,0.8C84.2,17,75.8,34,64.7,46.8C53.6,59.6,39.8,68.2,24.6,73.8C9.4,79.4,-7.2,82,-22.4,78.8C-37.6,75.6,-51.4,66.6,-61.8,54.2C-72.2,41.8,-79.2,26,-81.4,9.4C-83.6,-7.2,-81,-24.6,-74.6,-39.4C-68.2,-54.2,-57.9,-66.4,-45.2,-74.2C-32.5,-82,-17.2,-85.4,-1.4,-83.4C14.4,-81.4,28.8,-74,44.7,-76.4Z"
                                    transform="translate(100 100)"
                                />
                            </clipPath>
                        </defs>

                        <image href="/pic.jpg" width="100%" height="100%" clipPath="url(#blobClipBottom)" preserveAspectRatio="xMidYMid slice" />
                    </svg>
                </div>
            </div>
        </div>
    );
}

export default Hero;
