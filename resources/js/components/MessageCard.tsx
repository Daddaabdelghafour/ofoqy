type MessageCardProps = {
    message: string;
    time?: string;
    isUser?: boolean;
    profilePhoto?: string; // <-- Ajout de la prop
};

const MessageCard: React.FC<MessageCardProps> = ({ message, time, isUser, profilePhoto }) => (
    <div className={`mb-4 flex items-end ${isUser ? 'justify-end' : 'justify-start'}`}>
        {!isUser && <img src="/images/chatbotAssistant.png" alt="Profil" className="mr-2 h-8 w-8 rounded-full object-cover" />}
        <div className={`rounded-lg px-4 py-2 shadow-sm ${isUser ? 'bg-primary-1000 text-white' : 'bg-gray-100 text-gray-900'}`}>
            <div>{message}</div>
            {time && <div className="mt-1 text-xs text-gray-400">{time}</div>}
        </div>
        {isUser && profilePhoto && <img src={profilePhoto} alt="Profil" className="ml-2 h-8 w-8 rounded-full object-cover" />}
    </div>
);

export default MessageCard;
