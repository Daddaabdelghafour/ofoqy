import React from 'react';
import { questions_CT } from '../../questions';

interface CTProps {
  current: number;
  selectedAnswers: { [index: number]: string };
  setSelectedAnswers: React.Dispatch<React.SetStateAction<{ [index: number]: string }>>;
}

function CT({ current, selectedAnswers, setSelectedAnswers }: CTProps) {
  const questionPairs = [];

  for (let i = 0; i < questions_CT.length; i += 2) {
    questionPairs.push(
      <div
        key={i}
        style={{ display: current === i ? 'block' : 'none' }}
        className="bg-white px-15 flex flex-col items-center justify-center rounded-[3px] py-10 w-full transition-all duration-500"
      >
        {/* Question 1 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-10">
            {questions_CT[i].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i]: 'C' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'C'
                &&'bg-white border-primary-1000 border-l-4'
                
            }`}
          >
            {questions_CT[i].options.C}
          </button>
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i]: 'T' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'T'
                &&'bg-white border-primary-1000 border-l-4'
                
            }`}
          >
            {questions_CT[i].options.T}
          </button>
        </div>

        {/* Question 2 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-14">
            {questions_CT[i + 1].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'C' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'C'
                &&'bg-white border-primary-1000 border-l-4'
                
            }`}
          >
            {questions_CT[i + 1].options.C}
          </button>
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'T' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'T'
                &&'bg-white border-primary-1000 border-l-4'
                
            }`}
          >
            {questions_CT[i + 1].options.T}
          </button>
        </div>
      </div>
    );
  }

  return <div>{questionPairs}</div>;
}

export default CT;
