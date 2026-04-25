import React, { useEffect, useState } from 'react';

export const AnimatedStatRow = React.memo(({ item, stat, isPercent, textSize = "text-base", snapStat = null }) => {
  const base = stat?.base || 0;
  const totalChar = stat?.totalChar || 0;
  const totalEquip = stat?.totalEquip || 0;
  
  const finalValue = base + totalChar + totalEquip;

  const [animate, setAnimate] = useState(false);
  const [prevStat, setPrevStat] = useState(finalValue);

  useEffect(() => {
    if (finalValue !== prevStat) {
      setAnimate(true);
      setPrevStat(finalValue);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [finalValue, prevStat]);

  let diffElement = null;

  if (snapStat) {
    const snapFinal = (snapStat.base || 0) + (snapStat.totalChar || 0) + (snapStat.totalEquip || 0);
    const diff = finalValue - snapFinal;
    
    if (diff !== 0) {
      const isPositive = diff > 0;
      diffElement = (
        <span className={`text-xs font-black tracking-wider ml-2 animate-value-change drop-shadow-sm ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '+' : ''}{isPercent ? `${diff}%` : diff.toLocaleString()}
        </span>
      );
    }
  }

  return (
    <div className="group relative flex items-center justify-between p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300">
      <div className="flex items-center gap-3 z-10">
        <div className={`w-9 h-9 rounded-lg bg-(--card-bg) border border-(--border-color) shadow-sm flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
          {item.icon}
        </div>
        {/* 🌟 คืนค่าป้ายชื่อสถิติ (Stat Label) พร้อมสีตามธีม กลับมาตรงนี้ 🌟 */}
        <span className={`font-bold uppercase tracking-wider text-xs sm:text-sm transition-colors ${item.color}`}>
          {item.label}
        </span>
      </div>

      <div className="flex flex-col items-end z-10">
        <div className="flex items-baseline">
          <span className={`font-black tracking-widest ${textSize} text-(--text-main) ${animate ? 'animate-value-change !text-(--accent)' : 'transition-colors duration-300'}`} style={{ fontFamily: '"Press Start 2P", monospace' }}>
            {isPercent ? `${finalValue}%` : finalValue.toLocaleString()}
          </span>
          {diffElement}
        </div>
        
        {totalEquip > 0 && (
          <span className={`text-xs font-bold mt-1 tracking-wider ${isPercent ? 'text-cyan-500' : 'text-emerald-500'}`}>
            +{isPercent ? `${totalEquip}%` : totalEquip.toLocaleString()}
          </span>
        )}
      </div>
      
      {/* ส่วน Details (Hover) ยังคงอยู่และทำงานได้ปกติ */}
      {stat?.details && stat.details.length > 0 && (
        <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-64 bg-(--card-bg) backdrop-blur-2xl border border-(--border-color) shadow-2xl rounded-2xl p-4 translate-y-2 group-hover:translate-y-0 pointer-events-none">
           <div className="text-[10px] text-(--text-muted) uppercase font-bold tracking-widest mb-3 pb-2 border-b border-(--border-color)">
             {item.label} Sources
           </div>
           <div className="space-y-2">
             <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-(--text-main)">Character Base</span>
                <span className="font-bold text-(--text-main)">{isPercent ? `${base}%` : base.toLocaleString()}</span>
             </div>
             {stat.details.map((d, idx) => (
               <div key={idx} className="flex justify-between items-center text-xs">
                 <span className={`font-bold ${d.color}`}>{d.label}</span>
                 <span className={`font-black ${d.color}`}>+{isPercent ? `${d.value}%` : d.value.toLocaleString()}</span>
               </div>
             ))}
             <div className="pt-2 mt-2 border-t border-(--border-color) flex justify-between items-center">
                 <span className="text-[10px] text-(--text-muted) uppercase font-bold tracking-widest">Total</span>
                 <span className="text-sm font-black text-(--text-main)">{isPercent ? `${finalValue}%` : finalValue.toLocaleString()}</span>
             </div>
           </div>
        </div>
      )}
    </div>
  );
});