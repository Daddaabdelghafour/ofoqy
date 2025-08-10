import React from 'react';
import { questions_JP } from '../../questions';

interface JPProps {
  current: number;
  selectedAnswers: { [index: number]: string };
  setSelectedAnswers: React.Dispatch<React.SetStateAction<{ [index: number]: string }>>;
}

function JP({ current, selectedAnswers, setSelectedAnswers }: JPProps) {
  const questionPairs = [];

  for (let i = 0; i < questions_JP.length; i += 2) {
    questionPairs.push(
      <div
        key={i}
        style={{ display: current === i ? 'block' : 'none' }}
        className="bg-white px-15 flex flex-col items-center justify-center rounded-[3px] py-10 w-full transition-all duration-500"
      >
        {/* Question 1 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-10">
            {questions_JP[i].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i]: 'J' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'J'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_JP[i].options.J}
          </button>
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i]: 'P' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i] === 'P'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_JP[i].options.P}
          </button>
        </div>

        {/* Question 2 */}
        <div className="flex justify-center">
          <span className="font-semibold text-[32px] leading-[100%] text-primary-1000 my-14">
            {questions_JP[i + 1].question}
          </span>
        </div>
        <div className="flex justify-center gap-20 text-[20px] font-medium leading-[100%] w-full mb-10">
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'J' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'J'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_JP[i + 1].options.J}
          </button>
          <button
            onClick={() => setSelectedAnswers((prev) => ({ ...prev, [i + 1]: 'P' }))}
            className={`w-[450px] rounded-[3px] hover:bg-white hover:border-primary-1000 hover:border-l-4 px-6 mx-4 py-6 border transition-all duration-200 ${
              selectedAnswers[i + 1] === 'P'
                &&'bg-white border-primary-1000 border-l-4'
            }`}
          >
            {questions_JP[i + 1].options.P}
          </button>
        </div>
      </div>
    );
  }

  return <div>{questionPairs}</div>;
}

export default JP;
