import { ArrowRight } from 'lucide-react';

function Boutton() {
    return (
        <button className="btn btn-primary hover:text-primary-1000 mt-4 flex justify-center border-primary-600 px-6 text-[13.97px] font-normal leading-[19.95px] tracking-[0.8px] hover:bg-white md:mt-0">
            Commencer
            <ArrowRight className="ml-1 pb-1 pt-1" />
        </button>
    );
}
export default Boutton;
