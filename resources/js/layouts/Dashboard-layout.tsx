import { Bell, Menu, MessageSquare, SearchIcon, X } from 'lucide-react';
import React, { useState } from 'react';

interface DashboardLayoutProps {
    children: React.ReactNode;
    name: string;
    level: string;
    profile_picture_path: string;
}
function DashboardLayout({ children, name, level, profile_picture_path }: DashboardLayoutProps) {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const menu = [
        { name: 'Acceuil', link: '/dashboard/acceuil' },
        { name: 'Universités', link: '/dashboard/universities' },
        { name: 'Filières et métiers', link: '/dashboard/filieres-metiers' },
        { name: 'Favorites', link: '/dashboard/favorites' },
        { name: 'Postulations', link: '/dashboard/postulations' },
    ];

    return (
        <div className="relative flex min-h-full min-w-full justify-start">
            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 z-40 bg-white transition-opacity duration-300 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Sidebar */}
            <div
                className={`fixed z-50 flex min-h-full w-max flex-col items-center bg-primary-1000 py-2 pt-8 transition-transform duration-300 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
            >
                <img className="mb-4 w-[180px] p-5" src="/images/login-logo.png" alt="Logo" />
                <div
                    onClick={() => {
                        window.location.href = '/profile';
                    }}
                    className="duration-900 flex w-full cursor-pointer flex-col items-center border-l-[8px] border-transparent py-4 transition-all ease-in-out hover:border-white hover:bg-[#ffffff4d]"
                >
                    <img
                        className="my-4 w-[70px] h-[70px] rounded-full bg-primary-50 object-cover"
                        src={profile_picture_path ?  profile_picture_path : '/images/SpaceMan.png'}
                        alt="User"
                    />
                    <span className="mb-1 text-[19px] font-medium text-white">{name}</span>
                    <span className="text-[11px] font-medium text-[#ffffff95]">{level}</span>
                </div>
                <div className="flex w-max flex-col items-center py-4">
                    {menu.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                window.location.href = `${item.link}`;
                            }}
                            className="align-center duration-900 my-3 ml-20 flex h-[50px] w-full cursor-pointer border-l-[5px] border-transparent pl-5 pt-3 transition-all ease-in-out hover:border-white hover:bg-[#ffffff4d]"
                        >
                            <img className="mx-5 h-[20px] w-[20px]" src={'/images/menu' + index + '.png'} alt={item.name} />
                            <span className="whitespace-nowrap text-[15px] font-medium text-white">{item.name}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full flex-1 md:ml-0">
                {/* Mobile Menu Button */}
                <div className="flex items-center justify-between border-b bg-white p-4 md:hidden">
                    <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="rounded-md p-2 text-gray-600 hover:text-gray-900">
                        {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                    <span className="text-lg font-semibold text-gray-800">Dashboard</span>
                    <div></div>
                </div>

                {/* Top Section with Search and Actions */}
                <div className="flex w-full flex-col items-center p-4 pt-6 md:p-10 md:pt-12">
                    <div className="flex w-full max-w-6xl flex-col md:flex-row md:justify-between">
                        <div className="flex h-[60px] w-full justify-start rounded-[3px] border bg-white p-4 pt-5 shadow-sm md:w-[800px]">
                            <SearchIcon className="h-[20px] w-[20px] text-gray-400" />
                            <input
                                type="text"
                                className="ml-6 h-full w-full text-[16px] font-medium text-black focus:outline-none focus:ring-0 focus:ring-offset-0"
                                placeholder="Search..."
                            />
                        </div>
                        <div className="flex items-center gap-10">
                            <div onClick={() => {
                                        window.location.href = '/chatbot';
                                    }} className="flex h-[60px] items-center justify-center whitespace-nowrap rounded-[3px] bg-primary-1000 px-6 py-4 hover:cursor-pointer hover:shadow-md hover:shadow-black">
                                <MessageSquare className="h-6 w-6 text-white" />
                                <span  className="ml-3 hidden text-[16px] font-semibold text-white sm:inline ">Chatbot IA</span>
                            </div>
                            <div className="flex h-[60px] items-center justify-center rounded-[3px] bg-primary-1000 p-4 hover:cursor-pointer">
                                <Bell className="h-6 w-6 text-white" />
                            </div>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
export default DashboardLayout;
