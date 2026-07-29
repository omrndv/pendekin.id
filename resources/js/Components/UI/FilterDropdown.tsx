import { Filter } from 'lucide-react';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterDropdownProps {
    options: FilterOption[];
    selected: string;
    onChange: (val: string) => void;
    label?: string;
}

export default function FilterDropdown({ options, selected, onChange, label }: FilterDropdownProps) {
    return (
        <div className="relative inline-flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-gray-400">
                <Filter size={14} />
            </div>
            <select
                value={selected}
                onChange={(e) => onChange(e.target.value)}
                className="pl-8 pr-8 py-2.5 bg-white border border-gray-200/90 rounded-2xl text-xs text-gray-700 font-semibold focus:outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all appearance-none cursor-pointer"
            >
                {label && <option value="">{label}</option>}
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
}
