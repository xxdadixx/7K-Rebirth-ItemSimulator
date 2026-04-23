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
        <div className={`relative group flex justify-between items-center ${textSize} p-3 mb-2 bg-(--card-bg) backdrop-blur-xl border border-(--border-color) shadow-[inset_0_1px_1px_var(--glass-inner)] rounded-2xl transition-all duration-300 ${isFlashing ? 'ring-2 ring-green-500 scale-[1.02] z-10' : 'hover:-translate-y-0.5 hover:shadow-md hover:z-50'}`}>
            {/* เพิ่ม flex และ gap เพื่อจัดวางไอคอนคู่กับข้อความ */}
            <span className={`${item.color} font-bold tracking-wide flex items-center gap-2`}>
                {item.icon && <span className="opacity-90">{item.icon}</span>}
                {item.label}
            </span>

            <div className="flex items-center gap-2">
                <span className={`font-semibold transition-colors duration-300 ${isFlashing ? 'text-green-500 scale-110' : 'text-(--text-main)'}`}>
                    {fmt(total)}
                </span>
                {stat.totalChar > 0 && <span className="text-(--color-char) text-[11px] font-semibold">(+{fmt(stat.totalChar)})</span>}
                {stat.totalEquip > 0 && <span className="text-(--color-equip) text-[11px] font-semibold">(+{fmt(stat.totalEquip)})</span>}
            </div>

            {stat.details.length > 0 && (
                <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-64 bg-(--tooltip-bg) backdrop-blur-3xl border border-(--border-color) rounded-2xl shadow-2xl p-4 pointer-events-none z-100">
                    <div className="text-xs font-semibold text-(--text-main) border-b border-(--border-color) pb-2 mb-3 flex justify-between items-center">
                        <span className="uppercase tracking-wider">{item.label}</span>
                        <span className="text-(--text-muted) bg-(--input-bg) px-2 py-1 rounded-full border border-(--border-color)">Base: {fmt(stat.base)}</span>
                    </div>
                    <div className="space-y-2">
                        {stat.details.map((d, i) => (
                            <div key={i} className={`flex justify-between text-[11px] font-medium ${d.color || 'text-(--text-main)'} leading-tight`}>
                                <span>{d.label}</span>
                                <span className="font-semibold">+{fmt(d.value)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};