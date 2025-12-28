import React from 'react';

interface CellProps {
  value: 'X' | 'O' | null;
  onClick: () => void;
  disabled: boolean;
}

export const Cell: React.FC<CellProps> = ({ value, onClick, disabled }) => {
  return (
    <div 
      className={`cell ${value ? value.toLowerCase() : ''}`} 
      onClick={!disabled ? onClick : undefined}
    >
      {value && <span>{value}</span>}
    </div>
  );
};
