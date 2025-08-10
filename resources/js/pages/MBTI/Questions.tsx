import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { X } from 'lucide-react';
import SI from '@/components/SI';
import CT from '@/components/CT';
import LH from '@/components/LH';
import JP from '@/components/JP';

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

  const next =  async() => {
    let selectedAnswers;
    if (currentSection === 0) selectedAnswers = selectedAnswersSI;
    else if (currentSection === 1) selectedAnswers = selectedAnswersCT;
    else if (currentSection === 2) selectedAnswers = selectedAnswersLH;
    else selectedAnswers = selectedAnswersJP;

    const q1 = current * 2;
    const q2 = current * 2 + 1;

    if (!selectedAnswers[q1] || !selectedAnswers[q2]) {
      alert('Veuillez répondre aux deux questions');
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
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');

    try {
      const response = await fetch('/api/mbti-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json',
          'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || ''
         },
        body: JSON.stringify({ result }),
      });
      const data = await response.json();
      if (response.ok && data.success) {
          console.log('Success:', data.message);
      }
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      // You can add navigation or UI update here after success
    } catch (error) {
      console.error('Error:', error);
      alert('Erreur lors de l\'envoi des résultats.');
    }
    }
  };

  // Create progress bars dynamically based on current section slide count
  const sectionKey = Object.keys(countsInSlides)[currentSection];
  const progressBars = Array(countsInSlides[sectionKey]).fill(0);

  return (
    <div className="w-full p-8 min-h-screen">
      <div className="flex justify-between mb-10">
        <a href="/MBTI" className="hover:after:w-0">
          <ArrowLeft className="w-[20px] h-[20px]" />
        </a>
        <a href="/MBTI" className="hover:after:w-0">
          <X className="w-5 h-5 text-gray-700" />
        </a>
      </div>

      <div className="flex justify-between my-10">
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

      {currentSection === 0 && (
        <SI current={current * 2} selectedAnswers={selectedAnswersSI} setSelectedAnswers={setSelectedAnswersSI} />
      )}
      {currentSection === 1 && (
        <CT current={current * 2} selectedAnswers={selectedAnswersCT} setSelectedAnswers={setSelectedAnswersCT} />
      )}
      {currentSection === 2 && (
        <LH current={current * 2} selectedAnswers={selectedAnswersLH} setSelectedAnswers={setSelectedAnswersLH} />
      )}
      {currentSection === 3 && (
        <JP current={current * 2} selectedAnswers={selectedAnswersJP} setSelectedAnswers={setSelectedAnswersJP} />
      )}

      <div className="flex justify-end m-10">
        <button
          onClick={next}
          className="btn btn-primary px-8 py-3 flex justify-center mt-4 md:mt-0 hover:bg-white hover:text-primary-1000 border-primary-600 font-medium text-[16px] leading-[19.95px] tracking-[0.8px]"
        >
          Suivant
          <ArrowRight className="pt-1 pb-1 ml-1" />
        </button>
      </div>
    </div>
  );
}

export default Questions;
