import React, { useEffect, useState } from 'react';

// 🌟 OPTIMIZATION: Wrapped in React.memo to prevent re-rendering if props haven't changed
export const AnimatedStatRow = React.memo(({ item, stat, isPercent, textSize = "text-sm", snapStat = null }) => {
  const [animate, setAnimate] = useState(false);
  const [prevStat, setPrevStat] = useState(stat?.totalEquip || 0);

  useEffect(() => {
    if (stat?.totalEquip !== prevStat) {
      setAnimate(true);
      setPrevStat(stat?.totalEquip || 0);
      const timer = setTimeout(() => setAnimate(false), 500);
      return () => clearTimeout(timer);
    }
  }, [stat?.totalEquip, prevStat]);

  const displayValue = stat?.totalEquip || 0;
  let diffElement = null;

  if (snapStat && snapStat.totalEquip !== undefined) {
    const diff = displayValue - snapStat.totalEquip;
    if (diff !== 0) {
      const isPositive = diff > 0;
      diffElement = (
        <span className={`text-[11px] font-black tracking-wider ml-2 animate-value-change drop-shadow-sm ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {isPositive ? '+' : ''}{isPercent ? `${diff}%` : diff.toLocaleString()}
        </span>
      );
    }
  }

  return (
    <div className="group relative flex items-center justify-between p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-300">
      <div className="flex items-center gap-2.5 z-10">
        <div className={`w-8 h-8 rounded-lg bg-(--card-bg) border border-(--border-color) shadow-sm flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform duration-300`}>
          {item.icon}
        </div>
        <span className="font-bold text-(--text-muted) uppercase tracking-wider text-[11px] group-hover:text-(--text-main) transition-colors">{item.label}</span>
      </div>

      <div className="flex flex-col items-end z-10">
        <div className="flex items-baseline">
          <span className={`font-black tracking-widest ${textSize} text-(--text-main) ${animate ? 'animate-value-change !text-(--accent)' : 'transition-colors duration-300'}`} style={{ fontFamily: '"Press Start 2P", monospace' }}>
            {isPercent ? `${displayValue}%` : displayValue.toLocaleString()}
          </span>
          {diffElement}
        </div>
      </div>
      
      {stat?.details && stat.details.length > 0 && (
        <div className="absolute right-0 top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 w-64 bg-(--card-bg) backdrop-blur-2xl border border-(--border-color) shadow-2xl rounded-2xl p-4 translate-y-2 group-hover:translate-y-0 pointer-events-none">
           <div className="text-[10px] text-(--text-muted) uppercase font-bold tracking-widest mb-3 pb-2 border-b border-(--border-color)">{item.label} Sources</div>
           <div className="space-y-2">
             <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-(--text-main)">Character Base</span>
                <span className="font-bold text-(--text-main)">{isPercent ? `${stat.base}%` : stat.base.toLocaleString()}</span>
             </div>
             {stat.details.map((d, idx) => (
               <div key={idx} className="flex justify-between items-center text-xs">
                 <span className={`font-bold ${d.color}`}>{d.label}</span>
                 <span className={`font-black ${d.color}`}>+{isPercent ? `${d.value}%` : d.value.toLocaleString()}</span>
               </div>
             ))}
             <div className="pt-2 mt-2 border-t border-(--border-color) flex justify-between items-center">
                 <span className="text-[10px] text-(--text-muted) uppercase font-bold tracking-widest">Total</span>
                 <span className="text-sm font-black text-(--text-main)">{isPercent ? `${displayValue}%` : displayValue.toLocaleString()}</span>
             </div>
           </div>
        </div>
      )}
    </div>
  );
});