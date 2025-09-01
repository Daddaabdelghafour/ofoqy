import MessageCard from '@/components/MessageCard';
import DashboardLayout from '@/layouts/Dashboard-layout';
import { ChevronDown, ChevronRightIcon,ChevronLeftIcon, MessageSquare, ArrowUp, Trash2, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Notification from '@/components/Notification';


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


const menu = [
        { name: 'Acceuil', link: '/dashboard/acceuil' },
        { name: 'Universités', link: '/dashboard/universities' },
        { name: 'Filières et métiers', link: '/dashboard/filieres-metiers' },
        { name: 'Favorites', link: '/dashboard/favorites' },
        { name: 'Postulations', link: '/dashboard/postulations' },
    ];

const Chatbot = ({ student,mbtiType }: DashboardLayoutProps) => {
    const [history, setHistory] = useState<{ today: any[]; yesterday: any[]; last7days: any[] }>({
    today: [],
    yesterday: [],
    last7days: [],
});

useEffect(() => {
    fetch('/chatbot/history')
        .then(res => res.json())
        .then(data => setHistory(data));
}, []);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    type Message = {
        message: string;
        time: string;
        isUser: boolean;
    };
    const [showToday, setShowToday] = useState(true);
    const [showYesterday, setShowYesterday] = useState(true);
    const [showLast7, setShowLast7] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [notification, setNotification] = useState({
      show: false,
      type: 'success' as 'success' | 'error' | 'warning',
      title: '',
      message: ''
    });
    const [isnewchatloading,setIsnewchatloading]=useState(false);
    
    const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

   
    setMessages([...messages, { message: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isUser: true }]);
    setInput("");
    setIsLoading(true);
    const res = await fetch('/chatbot/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
         },
        body: JSON.stringify({ message: input, mbtiType: mbtiType })
    });
    
    const data = await res.json();
    setIsLoading(false);
    setMessages(msgs => [
      ...msgs,
      { message: data.reply, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), isUser: false }
    ]);
    }

    useEffect(() => {
        const handleUnload = () => {
            if (messages.length > 0) {
                fetch("/chatbot/session-messages", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                    },
                    body: JSON.stringify({ messages })
                });
            }
        };
        window.addEventListener("beforeunload", handleUnload);
        return () => window.removeEventListener("beforeunload", handleUnload);
    }, [messages]);

    // Shared handler for loading conversation by title
    const handleLoadConversation = async (title: string) => {
        const res = await fetch(`/chatbot/conversation/${encodeURIComponent(title)}`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
    };

    return (
        <div className="relative flex flex-col md:flex-row min-h-screen min-w-full justify-start">
            <div
                className={`relative z-10 flex flex-row md:flex-col min-h-[70px] md:min-h-full w-full md:w-max items-center bg-primary-1000 py-2 pt-4 md:pt-8 md:relative md:translate-x-0 ${isMobileMenuOpen ? 'w-max' : 'md:w-[100px]'} transition-all duration-300`}
            >
                <button
                    className="absolute right-[-18px] top-[290px] -translate-y-1/2 rounded-full w-8 h-8 flex items-center justify-center shadow bg-[#259daa] z-20  "
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    aria-label="Toggle menu"
                    >
                       {isMobileMenuOpen?<ChevronRightIcon className='text-white'/>:<ChevronLeftIcon className='text-white'/>}
                    </button>
                <img className="mb-2 md:mb-4 w-[120px] md:w-[180px] p-2 md:p-5" src="/images/login-logo.png" alt="Logo" />
                <div
                    onClick={() => {
                        window.location.href = '/profile';
                    }}
                    className="relative duration-900 flex w-full cursor-pointer flex-col items-center border-l-[8px] border-transparent py-2 md:py-4 transition-all ease-in-out hover:border-white hover:bg-[#ffffff4d]"
                >
                        
                    <img
                        className="my-2 md:my-4 w-[50px] md:w-[70px] h-[50px] md:h-[70px] rounded-full bg-primary-50 object-cover"
                        src={student.profile_photo_path ? student.profile_photo_path : '/images/SpaceMan.png'}
                        alt="User"
                    />
                    <span className="mb-1 text-[15px] md:text-[19px] font-medium text-white text-center">{student.nom_complet}</span>
                    <span className="text-[10px] md:text-[11px] font-medium text-[#ffffff95]">{student.filiere}</span>
                </div>
                <div className="flex w-full md:w-max flex-row md:flex-col items-center py-2 md:py-4 gap-2 md:gap-0">
                    {menu.map((item, index) => (
                        <div
                            key={index}
                            onClick={() => {
                                window.location.href = `${item.link}`;
                            }}
                            className={`align-center duration-900 my-2 md:my-3 h-[40px] md:h-[50px] cursor-pointer border-l-[5px] border-transparent pt-2 md:pt-3 transition-all ease-in-out ${!isMobileMenuOpen ? 'flex w-full hover:border-white hover:bg-[#ffffff4d] md:ml-20 md:pl-5' :'bg-[#228995] w-auto rounded-[3px] shadow hover:shadow-2xl hover:shadow-black'}`}
                        >
                            <img className="mx-2 md:mx-5 h-[16px] md:h-[20px] " src={'/images/menu' + index + '.png'} alt={item.name} />
                            {!isMobileMenuOpen && (
                                <span className="whitespace-nowrap text-[12px] md:text-[15px] font-medium text-white">{item.name}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex flex-col md:flex-row min-h-screen w-full">
                <div className="w-full md:w-auto">
                    <div className="flex pl-2 md:pl-5 pt-2 md:pt-3 items-center justify-start gap-2 md:gap-4 pb-2 md:pb-3 border bg-white ">
                    <img src="/images/chatbotAssistant.png" alt="Chatbot" className="h-10 w-10 rounded-full" />
                    <span className="text-[22px] font-bold text-primary-900">Chatbot</span>
                    </div>
                {/* Left side: History */}
                <div className="w-full md:w-[320px] border-r border-gray-200 bg-white p-2 md:p-4 min-h-[70px] md:min-h-screen">
                    {/* Aujourd'hui */}
                    <div className="flex cursor-pointer items-center justify-between gap-3" onClick={() => setShowToday(!showToday)}>
                        <h2 className="mb-4 text-lg font-semibold text-primary-900">Aujourd'hui</h2>
                        <div className="flex items-center gap-3">
                            {history.today.length > 0 && <p className="text-[#6B7280]">{history.today.length} Total</p>}
                            <ChevronDown className={`transition-transform ${showToday ? '' : 'rotate-180'}`} />
                        </div>
                    </div>
                    {showToday && (
                        <ul className="mb-4 space-y-2">
                            {history.today.map((d) => ( 
                                <li key={d.id} className="flex cursor-pointer justify-between rounded p-2 hover:bg-primary-50 group">
                            <span onClick={() => handleLoadConversation(d.title)}>
                                {d.title}
                            </span>
                            <span className="flex items-center gap-2">
                        <span className="text-xs text-gray-400">{d.time}</span>
                        <Trash2
                        className="w-4 h-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                        onClick={async (e) => {
                            e.stopPropagation();
                            setNotification({
                            show: true,
                            type: 'warning',
                            title: 'Suppression',
                            message: 'La conversation est en cours de suppression...'
                            });
                            const res = await fetch(`/chatbot/delete-conversation/${encodeURIComponent(d.title)}`);
                            if (res.ok) {
                            setMessages([]);
                            setNotification({
                                show: true,
                                type: 'success',
                                title: 'Supprimé',
                                message: 'La conversation a été supprimée.'
                            });
                            setHistory((prev) => ({
                                ...prev,
                                today: prev.today.filter(item => item.id !== d.id),
                                yesterday: prev.yesterday.filter(item => item.id !== d.id),
                                last7days: prev.last7days.filter(item => item.id !== d.id),
                            }));
                            } else {
                            setNotification({
                                show: true,
                                type: 'error',
                                title: 'Erreur',
                                message: 'La suppression a échoué.'
                            });
                            }
                            setTimeout(() => setNotification(n => ({ ...n, show: false })), 2000);
                        }}
                                />
                            </span>
                        </li>
                            ))}
                            </ul>
                                )}

                    {/* Hier */}
                    <div className="flex cursor-pointer items-center justify-between gap-3" onClick={() => setShowYesterday(!showYesterday)}>
                        <h2 className="mb-4 text-lg font-semibold text-primary-900">Hier</h2>
                        <div className="flex items-center gap-3">
                           {history.yesterday.length>0 && <p className="text-[#6B7280]">{history.yesterday.length} Total</p>}
                            <ChevronDown className={`transition-transform ${showYesterday ? '' : 'rotate-180'}`} />
                        </div>
                    </div>
                    {showYesterday && (
                        <ul className="mb-4 space-y-2">
                            {history.yesterday.map((d) => (
                                <li key={d.id} className="flex cursor-pointer justify-between rounded p-2 hover:bg-primary-50 group">
                                    <span onClick={() => handleLoadConversation(d.title)}>{d.title}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{d.time}</span>
                                        <Trash2
                                            className="w-4 h-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                setNotification({
                                                    show: true,
                                                    type: 'warning',
                                                    title: 'Suppression',
                                                    message: 'La conversation est en cours de suppression...'
                                                });
                                                const res = await fetch(`/chatbot/delete-conversation/${encodeURIComponent(d.title)}`);
                                                if (res.ok) {
                                                    setNotification({
                                                        show: true,
                                                        type: 'success',
                                                        title: 'Supprimé',
                                                        message: 'La conversation a été supprimée.'
                                                    });
                                                    setHistory((prev) => ({
                                                        ...prev,
                                                        today: prev.today.filter(item => item.id !== d.id),
                                                        yesterday: prev.yesterday.filter(item => item.id !== d.id),
                                                        last7days: prev.last7days.filter(item => item.id !== d.id),
                                                    }));
                                                } else {
                                                    setNotification({
                                                        show: true,
                                                        type: 'error',
                                                        title: 'Erreur',
                                                        message: 'La suppression a échoué.'
                                                    });
                                                }
                                                setTimeout(() => setNotification(n => ({ ...n, show: false })), 2000);
                                            }}
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {/* 7 jours précédents */}
                    <div className="flex cursor-pointer items-center justify-between gap-3" onClick={() => setShowLast7(!showLast7)}>
                        <h2 className="mb-4 text-lg font-semibold text-primary-900">7 jours précédents</h2>
                        <div className="flex items-center gap-3">
                            {history.last7days.length > 0 && <p className="text-[#6B7280]">{history.last7days.length} Total</p>}
                            <ChevronDown className={`transition-transform ${showLast7 ? '' : 'rotate-180'}`} />
                        </div>
                    </div>
                    {showLast7 && (
                        <ul className="mb-4 space-y-2">
                            {history.last7days.map((d) => (
                                <li key={d.id} className="flex cursor-pointer justify-between rounded p-2 hover:bg-primary-50 group">
                                    <span onClick={() => handleLoadConversation(d.title)}>{d.title}</span>
                                    <span className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400">{d.time}</span>
                                        <Trash2
                                            className="w-4 h-4 text-gray-400 cursor-pointer opacity-0 group-hover:opacity-100 transition"
                                            onClick={async (e) => {
                                                e.stopPropagation();
                                                setNotification({
                                                    show: true,
                                                    type: 'warning',
                                                    title: 'Suppression',
                                                    message: 'La conversation est en cours de suppression...'
                                                });
                                                const res = await fetch(`/chatbot/delete-conversation/${encodeURIComponent(d.title)}`);
                                                if (res.ok) {
                                                    setNotification({
                                                        show: true,
                                                        type: 'success',
                                                        title: 'Supprimé',
                                                        message: 'La conversation a été supprimée.'
                                                    });
                                                    setHistory((prev) => ({
                                                        ...prev,
                                                        today: prev.today.filter(item => item.id !== d.id),
                                                        yesterday: prev.yesterday.filter(item => item.id !== d.id),
                                                        last7days: prev.last7days.filter(item => item.id !== d.id),
                                                    }));
                                                } else {
                                                    setNotification({
                                                        show: true,
                                                        type: 'error',
                                                        title: 'Erreur',
                                                        message: 'La suppression a échoué.'
                                                    });
                                                }
                                                setTimeout(() => setNotification(n => ({ ...n, show: false })), 2000);
                                            }}
                                        />
                                    </span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                </div>
                {/* Right side: Chat */}
                <div className='w-full min-h-[300px] md:min-h-full flex flex-col'> 
                    <Notification notification={notification} />
                    <div className="flex flex-col md:flex-row pl-2 md:pl-5 pb-2 md:pb-3 items-center justify-between pr-2 md:pr-3">
                        <div className='flex flex-start gap-2 md:gap-4 items-center mt-2 md:mt-3 '>
                            <img src="/images/chatbotAssistant.png" alt="Chatbot" className="h-8 md:h-10 w-8 md:w-10 rounded-full" />
                            <span className="text-[16px] md:text-[22px] font-bold text-primary-900">Chatbot</span>
                        </div>
                        <div className='flex justify-end items-center gap-4 md:gap-10'>
                            <button
                                    type="submit"
                                    className="flex mt-2 md:mt-5 items-center gap-2 md:gap-3 rounded-md border border-b-2 border-[#1D7A85] bg-white px-2 md:px-4 py-2 md:py-3 text-xs md:text-sm font-medium text-[#1D7A85] hover:bg-[#ffffff4d]"
                                    onClick={async() => {
                                        setIsnewchatloading(true);
                                        const response= await fetch('/chatbot/session-messages', {
                                            method: 'POST',
                                            headers: { 
                                                'Content-Type': 'application/json',
                                                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
                                            },
                                            body: JSON.stringify({ messages })
                                        });
                                      
                                        const data=await response.json();
                                        if(data.success) {
                                            setIsnewchatloading(false);
                                            setMessages([]);
                                            fetch('/chatbot/history')
                                            .then(res => res.json())
                                            .then(data => setHistory(data));
                          
                                        }

                                    }}
                                >
                                    { isnewchatloading?<Loader2 className="animate-spin w-5 h-5 text-[#1D7A85]" />:<MessageSquare className='pt-[2px]'/>}
                                    <span className='text-[12px] md:text-[15px]'>Nouveau Chat </span>
                            </button>
                            <X onClick={() => {window.location.href = '/profile';}} className='cursor-pointer mt-2 md:mt-3 hover:bg-[#3b3b3b24] rounded-full'/>
                        </div>    
                    </div>  
                    <div className="flex flex-1 flex-col bg-white p-2 md:p-6">
                        <div className="mb-4 flex-1 overflow-y-auto">
                            <MessageCard message="Bonjour, comment puis-je vous aider ?" time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} isUser={false} />
                            {messages.map((msg, index) => (
                                <MessageCard
                                    key={index}
                                    message={msg.message}
                                    time={msg.time}
                                    isUser={msg.isUser}
                                    profilePhoto={msg.isUser ? student.profile_photo_path || '/images/SpaceMan.png' : '/images/chatbotAssistant.png'}
                                />
                            ))}
                            {isLoading && < MessageCard message="Réponse en cours ..." time={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} isUser={false} />}
                           
                            
                        </div>
                        <form className="flex flex-row justify-between border-[#1D7A8547] border-2 rounded p-1 md:p-2 shadow"  onSubmit={handleSend}>
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                className="flex-1 focus:outline-none px-2 md:px-3 py-1 md:py-2 text-xs md:text-base"
                                placeholder="Écrivez votre message..."
                            />
                            <button type="submit" className="btn btn-primary rounded-full ml-1 md:ml-2">
                                <ArrowUp/>
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chatbot;
