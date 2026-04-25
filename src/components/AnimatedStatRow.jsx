import React, { useState, useEffect } from 'react';

// เพิ่ม props: snapStat เพื่อรับค่าที่ถูกบันทึกไว้มาคำนวณเปรียบเทียบ
export const AnimatedStatRow = ({ item, stat, isPercent, textSize = "text-sm", snapStat }) => {
    const [isFlashing, setIsFlashing] = useState(false);
    const [prevValue, setPrevValue] = useState(stat.total);

    if (stat.total !== prevValue) {
        setPrevValue(stat.total);
        setIsFlashing(true);
    }

    useEffect(() => {
        if (isFlashing) {
            const timer = setTimeout(() => setIsFlashing(false), 400);
            return () => clearTimeout(timer); // Clean up timer ป้องกัน Memory Leak
        }
    }, [isFlashing]);

    const fmt = (v) => isPercent ? `${(v || 0).toFixed(1)}%` : Math.round(v || 0).toLocaleString();

    // คำนวณส่วนต่าง (Difference) ระหว่างค่าปัจจุบัน กับ ค่าที่ Snap ไว้
    let diff = 0;
    let hasDiff = false;
    let diffStr = '';
    
    if (snapStat) {
        diff = stat.total - snapStat.total;
        hasDiff = Math.abs(diff) > 0.01; // ป้องกันบักทศนิยมเล็กๆ
        if (hasDiff) {
            diffStr = isPercent 
                ? `${diff > 0 ? '+' : ''}${diff.toFixed(1)}%` 
                : `${diff > 0 ? '+' : ''}${Math.round(diff).toLocaleString()}`;
        }
    }

    return (
        <div className={`relative group flex justify-between items-center ${textSize} p-2 sm:p-3 mb-2 bg-(--card-bg) backdrop-blur-xl border border-(--border-color) shadow-[inset_0_1px_1px_var(--glass-inner)] rounded-2xl transition-all duration-300 ${isFlashing ? 'ring-2 ring-emerald-500 scale-[1.02] z-10' : 'hover:-translate-y-0.5 hover:shadow-lg hover:z-50'}`}>
            
            {/* ฝั่งซ้าย: ไอคอนและชื่อสเตตัส */}
            <div className={`flex items-center gap-2 sm:gap-3 min-w-0 flex-1 mr-2 transition-colors ${isFlashing ? 'text-emerald-400' : (item.color || 'text-(--text-main)')}`}>
                {item.icon && <span className="text-lg sm:text-xl opacity-90 shrink-0">{item.icon}</span>}
                <span className="font-bold tracking-wide truncate w-full block">
                    {item.label}
                </span>
            </div>

            {/* ฝั่งขวา: ตัวเลขสเตตัส และ ตัวเลขเปรียบเทียบ (Compare) */}
            <div className="flex flex-col items-end justify-center min-w-[75px]">
                <span className={`arcade-value-mini font-bold tracking-widest ${isFlashing ? 'text-emerald-400 ![text-shadow:0_0_8px_currentColor]' : 'text-(--text-main) dark:![text-shadow:none]'}`}>
                    {fmt(stat.total)}
                </span>
                
                {/* แสดงตัวเลขส่วนต่างเมื่อเปิดใช้งานโหมด Snap */}
                {snapStat && (
                    <div className="h-3 mt-0.5 flex items-center justify-end overflow-visible">
                        {hasDiff ? (
                            <span className={`text-[10px] font-black tracking-widest animate-value-change ${diff > 0 ? 'text-emerald-500 drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]' : 'text-red-500 drop-shadow-[0_0_2px_rgba(239,68,68,0.5)]'}`}>
                                {diffStr}
                            </span>
                        ) : (
                            <span className="text-[10px] font-bold text-(--text-muted) opacity-40">-</span>
                        )}
                    </div>
                )}
            </div>

            {/* ส่วน Tooltip (เหมือนเดิม) */}
            {stat.details.length > 0 && (
                <div className="hidden group-hover:block absolute top-full right-0 mt-2 w-64 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-(--border-color) rounded-2xl shadow-2xl p-4 pointer-events-none z-100">
                    <div className="text-xs font-semibold text-(--text-main) border-b border-(--border-color) pb-2 mb-3 flex justify-between items-center">
                        <span className="uppercase tracking-wider truncate mr-2">{item.label}</span>
                        <span className="text-(--text-muted) bg-black/5 dark:bg-white/10 px-2 py-1 rounded-full border border-(--border-color) shrink-0">
                            Base: {fmt(stat.base)}
                        </span>
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