import React from 'react';
import { questions_SI } from '../../questions';

interface SIProps {
  current: number;
  selectedAnswers: { [index: number]: string };
  setSelectedAnswers: React.Dispatch<React.SetStateAction<{ [index: number]: string }>>;
}

function SI({ current, selectedAnswers, setSelectedAnswers }: SIProps) {
  const questionPairs = [];

  for (let i = 0; i < questions_SI.length; i += 2) {
    questionPairs.push(
      <div
        key={i}
        style={{ display: current === i? 'block' : 'none' }}
        className="bg-white px-15 flexer rounded-[3px] py-10 w-full transition-all duration-500"
      >
        {/* Question 1 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-10">
            {questions_SI[i].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() =>
              setSelectedAnswers((prev) => ({ ...prev, [i]: 'S' }))
            }
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'S'
                && 'bg-white border-primary-1000 border-l-4'
                
            }`}
          >
            {questions_SI[i].options.S}
          </button>
          <button
            onClick={() =>
              setSelectedAnswers((prev) => ({ ...prev, [i]: 'I' }))
            }
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'I'
                && 'bg-white border-primary-1000 border-l-4'
                
            }`}
          >
            {questions_SI[i].options.I}
          </button>
        </div>

        {/* Question 2 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-14">
            {questions_SI[i + 1].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() =>
              setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'S' }))
            }
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'S'
                && 'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_SI[i + 1].options.S}
          </button>
          <button
            onClick={() =>
              setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'I' }))
            }
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'I'
                && 'bg-white border-primary-1000 border-l-4'
                
            }`}
          >
            {questions_SI[i + 1].options.I}
          </button>
        </div>
      </div>
    );
  }

  return <div>{questionPairs}</div>;
}

export default SI;
