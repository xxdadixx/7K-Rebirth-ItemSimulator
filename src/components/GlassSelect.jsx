import React, { useState, useRef, useEffect } from 'react';

export const GlassSelect = ({ 
  value, 
  onChange, 
  options, 
  placeholder = "Select...", 
  icon, 
  className = "",
  compact = false,
  centered = false // รองรับการจัดกึ่งกลาง
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // แก้ไขตรงนี้: ใช้ String() ครอบเพื่อให้เปรียบเทียบกันได้แม้ประเภทข้อมูลต่างกัน
  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full bg-(--input-bg) text-(--text-main) border border-(--input-border) rounded-2xl outline-none transition-all cursor-pointer font-semibold shadow-[inset_0_1px_1px_var(--glass-inner)] flex items-center gap-2 ${compact ? 'p-2 text-xs' : 'p-3.5 text-sm'} ${centered ? 'justify-center' : 'pr-10'}`}
      >
        {icon && <span className="opacity-80">{icon}</span>}
        
        {/* เพิ่ม selectedOption?.className เพื่อให้สีฟอนต์แสดงที่ปุ่มด้วย */}
        <span className={`truncate ${centered ? 'text-center' : ''} ${selectedOption?.className || ''}`}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>

        <div className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${centered ? '' : 'absolute right-3'}`}>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
            <path d="m19 9-7 7-7-7"/>
          </svg>
        </div>
      </div>

      {isOpen && (
        <div className="glass-dropdown-menu w-full left-0 z-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar py-1">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`dropdown-item-hover px-4 py-3 text-sm font-semibold flex items-center
                  ${String(value) === String(opt.value) ? 'bg-(--accent)/10 text-(--accent)' : 'text-(--text-main)'}
                  ${opt.disabled ? 'opacity-40 cursor-not-allowed' : ''}
                  ${compact ? 'py-2 px-3 text-xs' : ''}
                  ${centered ? 'justify-center text-center' : 'justify-between'}
                `}
              >
                {/* ใส่ opt.className ตรงนี้เพื่อให้สีใน List เปลี่ยนตามเงื่อนไข */}
                <span className={`flex items-center gap-2 ${opt.className || ''}`}>
                   {opt.icon && opt.icon}
                   {opt.label}
                </span>
                
                {!centered && String(value) === String(opt.value) && (
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