interface PackCardProps {
    icon: string;
    packName: string;
    description: string;
    price: string;
    features: string[];
    bgColor?: string;
    className?: string;
    textColorClass?: string;
    isSpecial?: boolean;
    bgIcon?: string;
    isPremium?: boolean;
}

function PackCard({
    icon,
    isSpecial,
    packName,
    description,
    price,
    features,
    bgColor = 'bg-white',
    className = '',
    textColorClass = '',
    bgIcon = '',
    isPremium,
}: PackCardProps) {
    return (
        <div
            className={`card relative flex min-h-[500px] w-full max-w-[320px] flex-col rounded-lg sm:min-h-[550px] sm:max-w-[350px] lg:min-h-[600px] lg:max-w-[370px] ${bgColor} ${className}`}
        >
            {isPremium && (
                <div className="absolute right-3 top-3 mt-auto flex h-[35px] w-[35px] flex-col items-center justify-center rounded-lg bg-[#1D7A852E] sm:right-5 sm:top-5 sm:h-[40px] sm:w-[40px] lg:h-[45px] lg:w-[45px]">
                    <img
                        src="/images/diamond.png"
                        width={20}
                        height={20}
                        className="object-contain sm:h-[22px] sm:w-[22px] lg:h-[25px] lg:w-[25px]"
                        alt=""
                    />
                </div>
            )}
            <div className="flex gap-2 p-6 sm:gap-3 sm:p-8 lg:p-10">
                <div className={`flex h-16 w-16 items-center justify-center rounded-lg sm:h-18 sm:w-18 lg:h-20 lg:w-20 ${bgIcon} relative`}>
                    {packName === 'Découverte' ? (
                        // Composite icon for first card (eclipse halves)
                        <div className="relative h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10">
                            <img
                                src="/images/right-eclipse.png"
                                alt=""
                                className="absolute left-0 top-0 h-8 w-4 object-contain sm:h-9 sm:w-[18px] lg:h-10 lg:w-5"
                            />
                            <img
                                src="/images/left-eclipse.png"
                                alt=""
                                className="absolute right-0 top-0 h-8 w-4 object-contain sm:h-9 sm:w-[18px] lg:h-10 lg:w-5"
                            />
                        </div>
                    ) : (
                        <img src={icon} alt={`${packName} pack icon`} className="h-8 w-8 object-contain sm:h-9 sm:w-9 lg:h-10 lg:w-10" />
                    )}
                </div>
                <div className="flex flex-col">
                    <div>
                        <p className={`text-sm font-semibold sm:text-base ${textColorClass || 'text-[#75979A]'}`}>Pack</p>
                        <h3 className={`text-lg font-semibold sm:text-xl lg:text-[22.28px] ${textColorClass || 'text-gray-900'}`}>{packName}</h3>
                    </div>
                </div>
            </div>
            <div className="mb-4 px-4 text-center sm:mb-5 sm:px-6">
                <p className={`text-sm font-semibold leading-relaxed sm:text-base ${textColorClass || 'text-[#77999D]'}`}>{description}</p>
            </div>
            <div className="flex gap-2 px-6 sm:px-8">
                <h1 className={`text-3xl sm:text-4xl lg:text-5xl ${textColorClass || 'text-[#104A51]'}`}>{price}</h1>
                <p className={`py-2 text-sm sm:py-3 sm:text-base ${textColorClass || 'text-[#77999D]'}`}>/mois</p>
            </div>
            <div className="mt-2 px-6 sm:mt-3 sm:px-8">
                <p className={`mb-2 text-sm font-semibold sm:mb-3 sm:text-[16px] ${textColorClass || 'text-[#0A444A]'}`}>Ce qui est inclus</p>
            </div>
            <div className="flex flex-grow flex-col gap-2 sm:gap-3">
                {features.map((feature, index) => (
                    <div key={index} className="flex gap-2 px-7 sm:px-9">
                        <img
                            src={isSpecial ? '/images/checkCircleWhite.png' : '/images/checkCircle.png'}
                            alt="Check mark"
                            className="mt-0.5 h-4 w-4 flex-shrink-0 object-contain sm:h-5 sm:w-5"
                        />
                        <p className={`text-sm sm:text-base ${textColorClass || 'text-gray-900'}`}>{feature}</p>
                    </div>
                ))}
            </div>
            <div className="mt-auto flex justify-center p-6 sm:p-8">
                {isSpecial ? (
                    <button className="btn btn-primary border-primay-600 mx-auto flex w-full items-center justify-center gap-2 rounded-sm border border-primary-600 bg-white px-4 py-2.5 text-primary-700 transition-all duration-200 hover:scale-105 hover:border-primary-700 hover:bg-white hover:text-primary-700 active:scale-95 sm:w-[180px] sm:px-6 sm:py-3 lg:mx-0 lg:w-[200px]">
                        <span className="text-sm font-medium sm:text-base lg:text-lg">Get Started</span>
                    </button>
                ) : (
                    <button className="btn btn-primary border-primay-600 mx-auto flex w-full items-center justify-center gap-2 rounded-sm border border-primary-600 bg-[#1D7A85] px-4 py-2.5 text-white transition-all duration-200 hover:scale-105 hover:border-primary-700 hover:bg-white hover:text-primary-700 active:scale-95 sm:w-[180px] sm:px-6 sm:py-3 lg:mx-0 lg:w-[200px]">
                        <span className="text-sm font-medium sm:text-base lg:text-lg">Get Started</span>
                    </button>
                )}
            </div>
        </div>
    );
}

export default PackCard;
