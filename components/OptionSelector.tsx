
import React from 'react';
import type { OptionItem } from '../types';

interface OptionSelectorProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: OptionItem[];
}

const OptionSelector: React.FC<OptionSelectorProps> = ({ label, value, onChange, options }) => {
  const id = `selector-${label.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-400 mb-1">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-gray-700 border border-gray-600 rounded-md p-2 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default OptionSelector;
