import { ChevronDown } from 'lucide-react';

const FilterPill = ({ label, showChevron }) => (
  <div className="flex justify-center items-center gap-3 border border-[#E3E8E6] bg-white py-2.5 px-4 rounded-2xl cursor-pointer min-w-fit hover:border-green-300 transition-all">
    <span className="font-bold text-xs uppercase tracking-tight text-[#3B4540]">{label}</span>
    {showChevron && <ChevronDown size={14} />}
  </div>
);

export default FilterPill;