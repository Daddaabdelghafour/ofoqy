import React, { useState } from 'react';
import { SearchIcon, Menu, X,Bell,MessageSquare} from 'lucide-react';
interface DashboardLayoutProps {
    children: React.ReactNode;
    name: string;
    level: string;
  
}
function DashboardLayout({ children, name, level }: DashboardLayoutProps){
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    const menu=[
     "Acceuil",
     "Universités",
     "Filières et métiers",
     "Favorites",
     "Postulations"
    ];
    
    return (
        <div className='flex justify-start min-w-full min-h-full relative'>
            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 bg-white  z-40 md:hidden transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} 
                 onClick={() => setIsMobileMenuOpen(false)}></div>
            
            {/* Sidebar */}
            <div className={`min-h-full w-max bg-primary-1000 flex flex-col items-center py-2 pt-8 fixed md:relative z-50 transition-transform duration-300 md:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                <img className='p-5 mb-4 w-[180px]' src="/images/login-logo.png" alt="Logo" />
                <div onClick={() => { window.location.href = '/profile' }} className='py-4 flex flex-col items-center w-full hover:bg-[#ffffff4d] hover:border-white cursor-pointer transition-all duration-900 ease-in-out border-l-[8px] border-transparent'>
                    <img className='rounded-[100%] w-[70px] my-4 bg-primary-50' src='/images/SpaceMan.png' alt="User" />
                    <span className='text-white text-[19px] font-medium mb-1'>{name}</span>
                    <span className='text-[#ffffff95] text-[11px] font-medium'>{level}</span>
                </div>
                <div className='py-4 flex flex-col items-center w-max'>
                    {menu.map((item, index) => (
                        <div key={index} onClick={() => { window.location.href = `/${item.toLowerCase()}` }} className='flex align-center w-full my-3 h-[50px] ml-20 pl-5 hover:bg-[#ffffff4d] hover:border-white cursor-pointer transition-all duration-900 ease-in-out border-l-[5px] border-transparent pt-3'>
                            <img className='mx-5 w-[20px] h-[20px]' src={'/images/menu'+(index)+'.png'} alt={item} />
                            <span className='text-white text-[15px] font-medium whitespace-nowrap'>
                                {item}
                            </span> 
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Main Content Area */}
            <div className='flex-1 md:ml-0 w-full'>
                {/* Mobile Menu Button */}
                <div className='md:hidden flex items-center justify-between p-4 bg-white border-b'>
                    <button 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className='p-2 rounded-md text-gray-600 hover:text-gray-900'
                    >
                        {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
                    </button>
                    <span className='text-lg font-semibold text-gray-800'>Dashboard</span>
                    <div></div>
                </div>
                
                {/* Top Section with Search and Actions */}
                <div className='p-4 md:p-10 pt-6 md:pt-12 flex flex-col items-center w-full'>
                   <div className='flex flex-col md:flex-row md:justify-between w-full max-w-6xl'>
                        <div className='flex justify-start bg-white h-[60px] w-full md:w-[800px] pt-5 p-4 rounded-[3px] shadow-sm border'>
                            <SearchIcon className='w-[20px] h-[20px] text-gray-400' />
                            <input type="text" className='text-[16px] h-full font-medium text-black ml-6 focus:outline-none focus:ring-0 focus:ring-offset-0 w-full' placeholder='Search...' />
                        </div>  
                        <div className='flex gap-10 items-center'>
                            <div className='rounded-[3px] py-4 px-6 h-[60px] bg-primary-1000 flex items-center justify-center hover:cursor-pointer whitespace-nowrap'>
                                <MessageSquare className='w-6 h-6 text-white' />
                                <span className='ml-3 text-[16px] font-semibold text-white hidden sm:inline'>Chatbot IA</span>
                            </div>
                            <div className='rounded-[3px] p-4 h-[60px] bg-primary-1000 flex items-center justify-center hover:cursor-pointer'>
                                <Bell className='w-6 h-6 text-white'  />
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