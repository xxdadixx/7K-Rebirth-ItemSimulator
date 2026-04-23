import React, { useState, useRef, useEffect } from 'react';

export const GlassSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  icon, 
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // ปิดเมนูเมื่อคลิกข้างนอก
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      {/* ส่วนปุ่มที่แสดงค่าที่เลือก */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-(--input-bg) text-(--text-main) border border-(--input-border) rounded-2xl outline-none p-3.5 pr-10 focus:ring-2 focus:ring-(--accent) transition-all text-sm cursor-pointer font-semibold shadow-[inset_0_1px_1px_var(--glass-inner)] flex items-center gap-2"
      >
        {icon && <span className="opacity-80">{icon}</span>}
        <span className="flex-1 truncate">
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="m19 9-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {/* รายการ Dropdown สไตล์กระจก (Glassmorphism) */}
      {isOpen && (
        <div className="glass-dropdown-menu w-full left-0">
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`dropdown-item-hover px-4 py-3 text-sm font-semibold flex items-center justify-between
                  ${value === opt.value ? 'bg-(--accent)/10 text-(--accent)' : 'text-(--text-main)'}
                `}
              >
                <span className="flex items-center gap-2">
                   {opt.icon && opt.icon}
                   {opt.label}
                </span>
                {value === opt.value && (
                  <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};