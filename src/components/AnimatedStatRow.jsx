import React, { useState, useEffect, useRef } from 'react';

export const AnimatedStatRow = ({ item, stat, isPercent, textSize = "text-sm" }) => {
    const total = stat ? (stat.base + (stat.totalChar || 0) + (stat.totalEquip || 0)) : 0;

    const [isFlashing, setIsFlashing] = useState(false);
    const prevTotal = useRef(total);

    useEffect(() => {
        if (prevTotal.current !== total) {
            prevTotal.current = total;
            setIsFlashing(true);
        }
    }, [total]);

    useEffect(() => {
        if (isFlashing) {
            const timer = setTimeout(() => setIsFlashing(false), 500);
            return () => clearTimeout(timer);
        }
    }, [isFlashing]);

    if (!stat) return null;

    const fmt = (val) => isPercent ? `${val}%` : val.toLocaleString();

    return (
        <div className={`relative group flex justify-between items-center ${textSize} p-2 sm:p-3 mb-2 bg-(--card-bg) backdrop-blur-xl border border-(--border-color) shadow-[inset_0_1px_1px_var(--glass-inner)] rounded-2xl transition-all duration-300 ${isFlashing ? 'ring-2 ring-emerald-500 scale-[1.02] z-10' : 'hover:-translate-y-0.5 hover:shadow-lg hover:z-50'}`}>
            
            {/* ฝั่งซ้าย: คืนค่า item.color และ item.icon กลับมา พร้อมกับระบบตัดคำแบบ Responsive */}
            <div className={`flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 transition-colors ${isFlashing ? 'text-emerald-400' : (item.color || 'text-(--text-main)')}`}>
                {item.icon && <span className="text-lg sm:text-xl opacity-90 shrink-0">{item.icon}</span>}
                <span className="font-bold tracking-wide truncate w-full block">
                    {item.label}
                </span>
            </div>

            {/* ฝั่งขวา: ตู้ LED และข้อมูลโบนัส (ใช้โครงสร้าง Responsive และสีที่แก้ล่าสุด) */}
            <div className="flex items-center gap-1 sm:gap-3 shrink-0">
                
                <div className="flex flex-col items-end justify-center mr-1">
                    {stat.totalChar > 0 && <span className="text-(--color-char) text-[9px] sm:text-[11px] font-semibold leading-tight">(+{fmt(stat.totalChar)})</span>}
                    {stat.totalEquip > 0 && <span className="text-(--color-equip) text-[9px] sm:text-[11px] font-semibold leading-tight">(+{fmt(stat.totalEquip)})</span>}
                </div>

                <div className={`arcade-led-final ${isFlashing ? 'ring-1 ring-emerald-400' : ''}`}>
                    <span 
                        className={`arcade-value-final text-[10px] sm:text-[11px] md:text-xs ${isFlashing ? 'arcade-flash-final' : ''}`}
                        style={{ lineHeight: '1.2' }}
                    >
                        {fmt(total)}
                    </span>
                </div>

            </div>

            {/* ส่วน Tooltip */}
            {stat.details.length > 0 && (
                <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-64 bg-(--tooltip-bg) backdrop-blur-3xl border border-(--border-color) rounded-2xl shadow-2xl p-4 pointer-events-none z-100">
                    <div className="text-xs font-semibold text-(--text-main) border-b border-(--border-color) pb-2 mb-3 flex justify-between items-center">
                        <span className="uppercase tracking-wider truncate mr-2">{item.label}</span>
                        <span className="text-(--text-muted) bg-(--input-bg) px-2 py-1 rounded-full border border-(--border-color) shrink-0">Base: {fmt(stat.base)}</span>
                    </div>
                    <div className="space-y-2">
                        {stat.details.map((d, i) => (
                            <div key={i} className={`flex justify-between text-[11px] font-medium ${d.color || 'text-(--text-main)'} leading-tight`}>
                                <span className="truncate mr-2">{d.label}</span>
                                <span className="font-semibold shrink-0">+{fmt(d.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};