import React from 'react';
import { SearchIcon } from 'lucide-react';

function DashboardLayout({ children }: { children: React.ReactNode }){
    const menu=[
     "Acceuil",
     "Universités",
     "Filières et métiers",
     "Favorites",
     "Postulations"
    ];
    return (
        <div className='flex justify-start min-w-full min-h-full'>
            <div className='min-h-full bg-primary-1000 flex flex-col w-[400px] items-center py-2 pt-8 '>
                <img  className='p-5 mb-4 w-[180px]' src="/images/login-logo.png"></img>
                <div className='py-4 flex flex-col items-center w-full hover:bg-[#ffffff4d] hover:border-white cursor-pointer transition-all duration-900 ease-in-out border-l-[8px] border-transparent'>
                    <img className='rounded w-[70px] my-4' src="images/userpic.png"></img>
                    <span className='text-white text-[19px] font-medium mb-1'>Amine</span>
                    <span className='text-[#ffffff95] text-[11px] font-medium'>Bac Sc Math</span>
                </div>
                <div className='py-4 flex flex-col items-center w-full'>
                        {
                            menu.map((item, index) => (
                                  <div key={index} className=' flex align-center w-full my-3 h-[50px] ml-20 pl-5 hover:bg-[#ffffff4d] hover:border-white cursor-pointer transition-all duration-900 ease-in-out border-l-[5px] border-transparent pt-3'>
                                       <img className='mx-5 w-[20px] h-[20px]' src={'/images/menu'+(index)+'.png'} alt={item} />
                                       <span className='text-white text-[15px] font-medium'>
                                           {item}
                                       </span> 
                                  </div>
                             ))
                        }
                    
                </div>
            </div>
            <div className='p-10 pt-12 flex flex-col items-center w-full'>
               <div className='flex justify-around w-full'>
                    <div className='flex justify-start bg-white h-[60px] w-[750px] pt-5 p-4 rounded-[3px] '>
                        <SearchIcon className='w-[20px] h-[20px]' />
                        <input type="text" className='text-[16px] h-full font-medium text-black ml-6 focus:outline-none focus:ring-0 focus:ring-offset-0' placeholder='Search...' />
                    </div>  
                    <div className='rounded-[3px] py-4 px-6  h-[60px] bg-primary-1000 flex justify-around hover:cursor-pointer'>
                        <img src="/images/chatpic.png"></img>
                        <span className=' ml-3 text-[16px] font-semibold text-white'>Chatbot IA </span>
                    </div>
                    <div className='rounded-[3px] p-4  h-[60px] bg-primary-1000 flex justify-around hover:cursor-pointer'>
                        <img src="/images/ring.png"></img>
                    </div>
                </div> 
                {children}            
            </div>
        </div>  
    );
}
export default DashboardLayout;