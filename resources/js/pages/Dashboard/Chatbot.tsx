import MessageCard from '@/components/MessageCard';
import DashboardLayout from '@/layouts/Dashboard-layout';
import { ChevronDown, ChevronRightIcon,ChevronLeftIcon, MessageSquare } from 'lucide-react';
import { useState } from 'react';
import { X } from 'lucide-react';
import { useMobileNavigation } from '../../hooks/use-mobile-navigation';


interface DashboardLayoutProps {
    student: {
        id: number;
        nom_complet: string;
        email: string;
        ville: string;
        age: number;
        niveau_etude: string;
        filiere: string;
        moyenne_general_bac: number;
        profile_photo_path: string | null;
    };
    mbtiType: string ;
}

const mockHistory = {
    today: [
        { id: 1, title: 'Orientation scolaire', time: '10:15' },
        { id: 2, title: 'Métiers recommandés', time: '11:02' },
        { id: 3, title: "Conseils d'études", time: '14:30' },
        { id: 8, title: 'Choix de filière', time: '15:10' },
        { id: 9, title: 'Préparation entretien', time: '16:45' },
    ],
    yesterday: [
        { id: 4, title: 'Universités privées', time: '09:45' },
        { id: 5, title: 'Filières scientifiques', time: '16:10' },
        { id: 10, title: 'Méthodes de révision', time: '13:20' },
        { id: 11, title: "Stages d'été", time: '17:05' },
        { id: 12, title: 'Parcours international', time: '19:30' },
    ],
    last7days: [
        { id: 6, title: 'Bourses disponibles', time: 'Lundi' },
        { id: 7, title: 'Préparation concours', time: 'Dimanche' },
        { id: 13, title: 'Échanges universitaires', time: 'Samedi' },
        { id: 14, title: 'Vie associative', time: 'Vendredi' },
        { id: 15, title: 'Logement étudiant', time: 'Jeudi' },
    ],
};
const menu = [
        { name: 'Acceuil', link: '/dashboard/acceuil' },
        { name: 'Universités', link: '/dashboard/universities' },
        { name: 'Filières et métiers', link: '/dashboard/filieres-metiers' },
        { name: 'Favorites', link: '/dashboard/favorites' },
        { name: 'Postulations', link: '/dashboard/postulations' },
    ];

const Chatbot = ({ student,mbtiType }: DashboardLayoutProps) => {
    const [showToday, setShowToday] = useState(true);
    const [showYesterday, setShowYesterday] = useState(true);
    const [showLast7, setShowLast7] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [messages, setMessages] = useState([
    { message: "Bonjour, comment puis-je vous aider ?", time: "10:15", isUser: false }
    ]);
    const [input, setInput] = useState("");
    
    const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setMessages([...messages, { message: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isUser: true }]);
    setInput("");
    
    const res = await fetch('/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
         },
        body: JSON.stringify({ message: input, mbtiType: mbtiType })
    });
    const data = await res.json();
    setMessages(msgs => [...msgs, { message: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isUser: false }]);
    }

    return (
        <div className="relative flex min-h-full min-w-full justify-start">
            <div
                className={`relative z-10 flex min-h-full w-max flex-col items-center bg-primary-1000 py-2 pt-8 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'w-max' : 'w-[100px]'} transition-all duration-300`}
            >
                <button
                    className="absolute right-[-18px] top-[290px] -translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center shadow bg-[#259daa] z-20  "
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                    >
                       {isMobileMenuOpen?<ChevronRightIcon className='text-white'/>:<ChevronLeftIcon className='text-white'/>}
                    </button>
                <img className="mb-4 w-[180px] p-5" src="/images/login-logo.png" alt="Logo" />
                <div
                    onClick={() => {
                        window.location.href = '/profile';
                    }}
                    className="relative duration-900 flex w-full cursor-pointer flex-col items-center border-l-[8px] border-transparent py-4 transition-all ease-in-out hover:border-white hover:bg-[#ffffff4d]"
                >
                        
                    <img
                        className="my-4 w-[70px] h-[70px] rounded-full bg-primary-50 object-cover"
                        src={student.profile_photo_path ? '/storage/' + student.profile_photo_path : '/images/SpaceMan.png'}
                        alt="User"
                    />
                    <span className="mb-1 text-[19px] font-medium text-white">{student.nom_complet}</span>
                    <span className="text-[11px] font-medium text-[#ffffff95]">{student.filiere}</span>
                </div>
                <div className="flex w-max flex-col items-center py-4">
                    {menu.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                window.location.href = `${item.link}`;
                            }}
                            className={`align-center duration-900 my-3 h-[50px]  cursor-pointer border-l-[5px] border-transparent pt-3 transition-all ease-in-out ${!isMobileMenuOpen ? 'flex w-full hover:border-white hover:bg-[#ffffff4d] ml-20 pl-5' :'bg-[#228995] w-auto rounded-[3px] shadow hover:shadow-2xl hover:shadow-black'}`}
                        >
                            <img className="mx-5 h-[20px] " src={'/images/menu' + index + '.png'} alt={item.name} />
                            {!isMobileMenuOpen && (
                                <span className="whitespace-nowrap text-[15px] font-medium text-white">{item.name}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex min-h-screen w-full">
                <div>
                    <div className="flex pl-5 pt-3 items-center justify-start gap-4 pb-3 border bg-white ">
                    <img src="/images/chatbotAssistant.png" alt="Chatbot" className="h-10 w-10 rounded-full" />
                    <span className="text-[22px] font-bold text-primary-900">Chatbot</span>
                    </div>
                {/* Left side: History */}
                <div className="w-[320px] border-r border-gray-200 bg-white p-4">
                    {/* Aujourd'hui */}
                    <div className="flex cursor-pointer items-center justify-between gap-3" onClick={() => setShowToday(!showToday)}>
                        <h2 className="mb-4 text-lg font-semibold text-primary-900">Aujourd'hui</h2>
                        <div className="flex items-center gap-3">
                            <p className="text-[#6B7280]">{mockHistory.today.length} Total</p>
                            <ChevronDown className={`transition-transform ${showToday ? '' : 'rotate-180'}`} />
                        </div>
                    </div>
                    {showToday && (
                        <ul className="mb-4 space-y-2">
                            {mockHistory.today.map((d) => (
                                <li key={d.id} className="flex cursor-pointer justify-between rounded p-2 hover:bg-primary-50">
                                    <span>{d.title}</span>
                                    <span className="text-xs text-gray-400">{d.time}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* Hier */}
                    <div className="flex cursor-pointer items-center justify-between gap-3" onClick={() => setShowYesterday(!showYesterday)}>
                        <h2 className="mb-4 text-lg font-semibold text-primary-900">Hier</h2>
                        <div className="flex items-center gap-3">
                            <p className="text-[#6B7280]">{mockHistory.yesterday.length} Total</p>
                            <ChevronDown className={`transition-transform ${showYesterday ? '' : 'rotate-180'}`} />
                        </div>
                    </div>
                    {showYesterday && (
                        <ul className="mb-4 space-y-2">
                            {mockHistory.yesterday.map((d) => (
                                <li key={d.id} className="flex cursor-pointer justify-between rounded p-2 hover:bg-primary-50">
                                    <span>{d.title}</span>
                                    <span className="text-xs text-gray-400">{d.time}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* 7 jours précédents */}
                    <div className="flex cursor-pointer items-center justify-between gap-3" onClick={() => setShowLast7(!showLast7)}>
                        <h2 className="mb-4 text-lg font-semibold text-primary-900">7 jours précédents</h2>
                        <div className="flex items-center gap-3">
                            <p className="text-[#6B7280]">{mockHistory.last7days.length} Total</p>
                            <ChevronDown className={`transition-transform ${showLast7 ? '' : 'rotate-180'}`} />
                        </div>
                    </div>
                    {showLast7 && (
                        <ul className="mb-4 space-y-2">
                            {mockHistory.last7days.map((d) => (
                                <li key={d.id} className="flex cursor-pointer justify-between rounded p-2 hover:bg-primary-50">
                                    <span>{d.title}</span>
                                    <span className="text-xs text-gray-400">{d.time}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                </div>
                {/* Right side: Chat */}
                <div className='w-full min-h-full flex flex-col'> 
                    <div className="flex pl-5 pb-3 items-center justify-between pr-3">
                        <div className='flex flex-start gap-4 items-center mt-3 '>
                            <img src="/images/chatbotAssistant.png" alt="Chatbot" className="h-10 w-10 rounded-full" />
                            <span className="text-[22px] font-bold text-primary-900">Chatbot</span>
                        </div>
                        <div className='flex justify-end items-center gap-10'>
                            <button
                                    type="submit"
                                    className="flex mt-5 items-center gap-3 rounded-md border border-b-2 border-[#1D7A85] bg-white px-4 py-3 text-sm font-medium text-[#1D7A85] hover:bg-[#ffffff4d]"
                                    onClick={() => {
                                        window.location.href = '/MBTI';
                                    }}
                                >
                                    <MessageSquare className='pt-[2px]'/>
                                    <span className='text-[15px]'>Nouveau Chat </span>
                            </button>
                            <X onClick={() => {window.location.href = '/profile';}} className='cursor-pointer mt-3 hover:bg-[#3b3b3b24] rounded-full'/>
                        </div>    
                    </div>  
                    <div className="flex flex-1 flex-col bg-white p-6">
                        <div className="mb-4 flex-1 overflow-y-auto">
                            {messages.map((msg, index) => (
                                <MessageCard
                                    key={index}
                                    message={msg.message}
                                    time={msg.time}
                                    isUser={msg.isUser}
                                    profilePhoto={msg.isUser ? student.profile_photo_path || '/images/SpaceMan.png' : '/images/chatbotAssistant.png'}
                                />
                            ))}
                            
                        </div>
                        <form className="flex gap-2" onSubmit={handleSend}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 rounded border px-3 py-2"
                                placeholder="Écrivez votre message..."
                            />
                            <button type="submit" className="btn btn-primary px-6">
                                Envoyer
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
