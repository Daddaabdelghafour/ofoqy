import { ArrowRight } from 'lucide-react';

function Boutton() {
    return (
        <button onClick={()=>window.location.href='/register'} className="btn btn-primary px-6 flex justify-center mt-4 md:mt-0 hover:bg-white hover:text-primary-1000 border-primary-600 font-normal text-[13.97px] leading-[19.95px] tracking-[0.8px]">
            Commencer
            <ArrowRight className="pt-1 pb-1 ml-1" />
         </button>
    );
};
export default Boutton;
