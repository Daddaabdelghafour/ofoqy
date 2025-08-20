import CT from '@/components/CT';
import JP from '@/components/JP';
import LH from '@/components/LH';
import Notification from '@/components/Notification';
import SI from '@/components/SI';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const countsInSlides: { [key: string]: number } = {
    SI: 3,
    CT: 3,
    LH: 3,
    JP: 3,
};

function Questions() {
    const [current, setCurrent] = useState(0);
    const [currentSection, setCurrentSection] = useState(0);
    const [progressIndex, setProgressIndex] = useState(0);
    const [notification, setNotification] = useState<{
        show: boolean;
        type: 'success' | 'error' | 'warning';
        title: string;
        message: string;
    }>({ show: false, type: 'success', title: '', message: '' });

    const showNotification = (type: 'success' | 'error' | 'warning', title: string, message: string) => {
        setNotification({ show: true, type, title, message });
        setTimeout(() => setNotification((prev) => ({ ...prev, show: false })), 5000);
    };

    const [scores, setScores] = useState<{ [key: string]: number }>({
        S: 0,
        I: 0,
        C: 0,
        T: 0,
        J: 0,
        P: 0,
        L: 0,
        H: 0,
    });

    const [selectedAnswersSI, setSelectedAnswersSI] = useState<{ [index: number]: string }>({});
    const [selectedAnswersCT, setSelectedAnswersCT] = useState<{ [index: number]: string }>({});
    const [selectedAnswersLH, setSelectedAnswersLH] = useState<{ [index: number]: string }>({});
    const [selectedAnswersJP, setSelectedAnswersJP] = useState<{ [index: number]: string }>({});

    useEffect(() => {
        console.log('Updated scores:', scores);
    }, [scores]);

    const next = async () => {
        let selectedAnswers;
        if (currentSection === 0) selectedAnswers = selectedAnswersSI;
        else if (currentSection === 1) selectedAnswers = selectedAnswersCT;
        else if (currentSection === 2) selectedAnswers = selectedAnswersLH;
        else selectedAnswers = selectedAnswersJP;

        const q1 = current * 2;
        const q2 = current * 2 + 1;

        if (!selectedAnswers[q1] || !selectedAnswers[q2]) {
            showNotification('warning', 'Questions manquantes', 'Veuillez répondre aux deux questions');
            return;
        }

        setScores((prevScores) => {
            const newScores = { ...prevScores };
            const cat1 = selectedAnswers[q1];
            if (cat1 && cat1 in newScores) newScores[cat1] = (newScores[cat1] || 0) + 1;
            const cat2 = selectedAnswers[q2];
            if (cat2 && cat2 in newScores) newScores[cat2] = (newScores[cat2] || 0) + 1;
            return newScores;
        });

        // Progress bar and navigation logic based on local current and currentSection
        const sectionKey = Object.keys(countsInSlides)[currentSection];
        if (current + 1 < countsInSlides[sectionKey]) {
            setCurrent(current + 1);
            setProgressIndex((prev) => (prev + 1) % countsInSlides[sectionKey]);
        } else if (currentSection + 1 < 4) {
            setCurrentSection(currentSection + 1);
            setCurrent(0);
            setProgressIndex(0);
        } else {
            const result =
                (scores.S >= scores.I ? 'S' : 'I') +
                (scores.C >= scores.T ? 'C' : 'T') +
                (scores.J >= scores.P ? 'J' : 'P') +
                (scores.L >= scores.H ? 'L' : 'H');

            const totalAnswers = Object.values(scores).reduce((sum, val) => sum + val, 0);
            const percentages: { [key: string]: number } = {};
            Object.keys(scores).forEach((letter) => {
                percentages[letter] = totalAnswers > 0 ? Math.round((scores[letter] / totalAnswers) * 100) : 0;
            });

            try {
                const response = await fetch('/mbti-result', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || '',
                    },
                    body: JSON.stringify({ result, percentages }),
                });
                if (!response.ok) {
                    // Check if it's an authentication error
                    if (response.status === 401) {
                        showNotification('error', 'Non autorisé', 'Vous devez être connecté. Redirection...');
                        setTimeout(() => {
                            window.location.href = '/login';
                        }, 2000);
                    }
                }

                const data = await response.json();
                if (data.success) {
                    console.log('Success:', data.message);
                    console.log('MBTI Type saved:', data.mbti_type);
                    console.log('MBTI personality message:', data.personalized_message);
                    showNotification('success', 'Résultat enregistré', 'Votre type MBTI a été enregistré avec succès.');
                    setTimeout(() => {
                        window.location.href = '/profile';
                    }, 2000);
                } else {
                    console.error('Error:', data.message);
                    window.location.href = '/questions';
                }

                // You can add navigation or UI update here after success
            } catch (error) {
                console.error('Error:', error);
                showNotification('error', 'Erreur', "Erreur lors de l'envoi des résultats.Veuillez rafraîchir la page");
            }
        }
    };

    // Create progress bars dynamically based on current section slide count
    const sectionKey = Object.keys(countsInSlides)[currentSection];
    const progressBars = Array(countsInSlides[sectionKey]).fill(0);

    return (
        <div className="min-h-screen w-full p-8">
            {/* Use the reusable Notification component */}
            <Notification notification={notification} />

            <div className="mb-10 flex justify-between">
                <a href="/MBTI" className="hover:after:w-0">
                    <ArrowLeft className="h-[20px] w-[20px]" />
                </a>
                <a href="/MBTI" className="hover:after:w-0">
                    <X className="h-5 w-5 text-gray-700" />
                </a>
            </div>

            <div className="my-10 flex justify-between">
                {progressBars.map((_, idx) => (
                    <span
                        key={idx}
                        style={{
                            backgroundColor: progressIndex === idx ? '#1D7A85' : '#DDDDDD',
                            transition: 'background-color 0.5s ease',
                        }}
                        className="h-[11px] w-[450px]"
                    />
                ))}
            </div>

            {currentSection === 0 && <SI current={current * 2} selectedAnswers={selectedAnswersSI} setSelectedAnswers={setSelectedAnswersSI} />}
            {currentSection === 1 && <CT current={current * 2} selectedAnswers={selectedAnswersCT} setSelectedAnswers={setSelectedAnswersCT} />}
            {currentSection === 2 && <LH current={current * 2} selectedAnswers={selectedAnswersLH} setSelectedAnswers={setSelectedAnswersLH} />}
            {currentSection === 3 && <JP current={current * 2} selectedAnswers={selectedAnswersJP} setSelectedAnswers={setSelectedAnswersJP} />}

            <div className="m-10 flex justify-end">
                <button
                    onClick={next}
                    className="btn btn-primary mt-4 flex justify-center border-primary-600 px-8 py-3 text-[16px] font-medium leading-[19.95px] tracking-[0.8px] hover:bg-white hover:text-primary-1000 md:mt-0"
                >
                    Suivant
                    <ArrowRight className="ml-1 pb-1 pt-1" />
                </button>
            </div>
        </div>
    );
}

export default Questions;
