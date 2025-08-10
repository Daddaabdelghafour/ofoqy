import React from 'react';
import { questions_LH } from '../../questions';

interface LHProps {
  current: number;
  selectedAnswers: { [index: number]: string };
  setSelectedAnswers: React.Dispatch<React.SetStateAction<{ [index: number]: string }>>;
}

function LH({ current, selectedAnswers, setSelectedAnswers }: LHProps) {
  const questionPairs = [];

  for (let i = 0; i < questions_LH.length; i += 2) {
    questionPairs.push(
      <div
        key={i}
        style={{ display: current === i ? 'block' : 'none' }}
        className="bg-white px-15 flex flex-col items-center justify-center rounded-[3px] py-10 w-full transition-all duration-500"
      >
        {/* Question 1 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-10">
            {questions_LH[i].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i]: 'L' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'L'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_LH[i].options.L}
          </button>
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i]: 'H' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'H'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_LH[i].options.H}
          </button>
        </div>

        {/* Question 2 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-14">
            {questions_LH[i + 1].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'L' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'L'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_LH[i + 1].options.L}
          </button>
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'H' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'H'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_LH[i + 1].options.H}
          </button>
        </div>
      </div>
    );
  }

  return <div>{questionPairs}</div>;
}

export default LH;
