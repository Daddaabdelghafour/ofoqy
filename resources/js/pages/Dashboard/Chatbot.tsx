import MessageCard from '@/components/MessageCard';
import DashboardLayout from '@/layouts/Dashboard-layout';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';
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

const Chatbot = ({ student }) => {
    const [showToday, setShowToday] = useState(true);
    const [showYesterday, setShowYesterday] = useState(true);
    const [showLast7, setShowLast7] = useState(true);

    return (
        <DashboardLayout profile_picture_path={student.profile_photo_path} name="Abdelghafour" level="Sciences Physiques">
            <div className="flex min-h-screen w-full">
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
                {/* Right side: Chat */}
                <div className="flex flex-1 flex-col bg-white p-6">
                    <h2 className="mb-4 text-lg font-semibold text-primary-900">Chat</h2>
                    <div className="mb-4 flex-1 overflow-y-auto">
                        <MessageCard message="Bonjour, comment puis-je vous aider ?" time="10:15" />
                        <MessageCard message="Je cherche une orientation scolaire." profilePhoto={student.profile_photo_path} time="10:16" isUser />
                    </div>
                    <form className="flex gap-2">
                        <input type="text" className="flex-1 rounded border px-3 py-2" placeholder="Écrivez votre message..." />
                        <button type="submit" className="btn btn-primary px-6">
                            Envoyer
                        </button>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Chatbot;
