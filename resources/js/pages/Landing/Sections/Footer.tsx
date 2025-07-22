import Boutton from '@/components/Boutton';

function Footer() {
    const images = [
        { icon: '/images/email.png', alt: 'Facebook' },
        { icon: '/images/linkedin.png', alt: 'Email' },
        { icon: '/images/instagram.png', alt: 'LinkedIn' },
        { icon: '/images/facebook.png', alt: 'Instagram' },
    ];

    const liens = [
        { link: 'Acceuil', href: '/services' },
        { link: 'Nos services', href: '/services' },
        { link: 'A propos', href: '/about' },
        { link: "Comment s'orienter?", href: '/guide' },
        { link: 'Témoignage', href: '/testimonials' },
    ];

    return (
        <div className="w-full bg-[#181818]">
            <div className="container-custom px-4 py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
                    {/* Company Info Section */}
                    <div className="flex w-full flex-col lg:w-1/3">
                        <div className="mb-6">
                            <img src="/images/logo.png" alt="OFOQY Logo" className="h-auto max-h-12 w-auto" />
                        </div>
                        <div className="mb-6">
                            <p className="text-sm font-normal leading-relaxed text-white/90 sm:text-base">
                                OFOQY est une plateforme web et mobile qui guide les bacheliers marocains dans leur orientation grâce à une approche
                                interactive et personnalisée.
                            </p>
                        </div>
                        <div className="mb-6 flex gap-4">
                            {images.map((image, index) => (
                                <img
                                    key={index}
                                    src={image.icon}
                                    alt={image.alt}
                                    className="h-6 w-6 cursor-pointer transition-opacity hover:opacity-80 sm:h-8 sm:w-8"
                                />
                            ))}
                        </div>
                        <div className="font-medium text-white">
                            <p className="text-xs text-[#BBBBBB] sm:text-sm">© 2025 OFOQY. Tous droits réservés.</p>
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="w-full lg:w-1/3">
                        <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">Liens utiles</h3>
                        <ul className="space-y-5">
                            {liens.map((link, index) => (
                                <li key={index}>
                                    <a
                                        className="text-sm font-medium text-white transition-colors duration-200 hover:text-primary-400 sm:text-base"
                                        href={link.href}
                                    >
                                        {link.link}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Section */}
                    <div className="w-full lg:w-1/2">
                        <h3 className="mb-6 text-xl font-bold text-white sm:text-2xl">Contactez Nous</h3>
                        <div className="flex flex-col items-stretch gap-3 rounded-lg bg-white p-3 sm:flex-row">
                            <div className="flex flex-1 items-center gap-3">
                                <img src="/images/email.png" alt="Email Icon" className="h-6 w-6 flex-shrink-0" />
                                <input
                                    type="email"
                                    placeholder="name@email.com"
                                    className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-500 outline-none sm:text-base"
                                />
                            </div>
                            <Boutton></Boutton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;
