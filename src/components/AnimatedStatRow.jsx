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

        {/* 🌟 ปรับปรุงไอคอนใหม่เพื่อให้สื่อความหมายได้ชัดเจนขึ้น 🌟 */}
        {(totalChar > 0 || totalEquip > 0) && (
          <div className="flex items-center gap-1.5 mt-1.5">
            {/* โบนัสตัวละคร: ไอคอนดวงดาว (สื่อนัยยะถึง Star/Potential) */}
            {totalChar > 0 && (
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20"
                title="Hero Potential & Transcend Bonus"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" fill="currentColor" className="text-amber-500" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12 4.5A2.25 2.25 0 1 0 12 0a2.25 2.25 0 0 0 0 4.5M21.75 7V5.5H2.25V7l6.5 1.75L9 12L4.75 22.75l1.5.75l5.745-9h.01l5.745 9l1.5-.75L15 12l.25-3.25z" />
                </svg>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-amber-500">
                  {isPercent ? `${totalChar}%` : totalChar.toLocaleString()}
                </span>
              </div>
            )}

            {/* โบนัสอุปกรณ์: ไอคอนโล่/เกราะ (สื่อนัยยะถึง Equipment) */}
            {totalEquip > 0 && (
              <div
                className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20"
                title="Equipment & Set Bonus"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-swords-icon lucide-swords text-emerald-500"><polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" x2="19" y1="19" y2="13" /><line x1="16" x2="20" y1="16" y2="20" /><line x1="19" x2="21" y1="21" y2="19" /><polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" /><line x1="5" x2="9" y1="14" y2="18" /><line x1="7" x2="4" y1="17" y2="20" /><line x1="3" x2="5" y1="19" y2="21" /></svg>
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wider text-emerald-500">
                  {isPercent ? `${totalEquip}%` : totalEquip.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Tooltip และโครงสร้างอื่นๆ เหมือนเดิม */}
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