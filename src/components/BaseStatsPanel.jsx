import React from 'react';

export const BaseStatsPanel = React.memo(({
  activeHero,
  finalStats,
  potentials,
  handlePotentialChange,
  isDarkMode
}) => {
  return (
    <div className="relative z-30 w-full xl:w-[70%] flex flex-col">
      <div className="absolute inset-0 rounded-3xl shadow-(--glass-shadow) overflow-hidden">
        <div className="aurora-bg aurora-style-2"></div>
        <div className="absolute inset-0 bg-(--card-bg) backdrop-blur-3xl border border-(--border-color) shadow-[inset_0_1px_1px_var(--glass-inner)] rounded-3xl transition-colors duration-400"></div>
      </div>
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-(--card-header) p-4 border-b border-(--border-color) rounded-t-3xl">
          <h2 className="text-(--text-muted) font-semibold tracking-widest text-center text-xs uppercase">Base Stats & Potentials</h2>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div className="hidden md:flex items-center text-[11px] text-(--text-muted) font-medium px-4 pb-2 border-b border-(--border-color) tracking-wider uppercase">
            <div className="w-1/4">Stat Type</div><div className="w-1/5 text-center">Base</div><div className="w-1/5 text-center">★ Transcend</div><div className="w-1/5 text-center">Poten Lv</div><div className="w-[15%] text-right">Poten Add</div>
          </div>
          {['atk', 'def', 'hp', 'spd'].map((statKey) => {
            const isAtk = statKey === 'atk'; const isDef = statKey === 'def'; const isHp = statKey === 'hp'; const isSpd = statKey === 'spd';
            const label = isAtk ? 'Attack' : isDef ? 'Defense' : isHp ? 'HP' : 'Speed';
            const colorClass = isAtk ? 'bg-red-500' : isDef ? 'bg-blue-500' : isHp ? 'bg-green-500' : 'bg-yellow-500';
            const baseValue = isAtk ? activeHero.baseAtk : isDef ? activeHero.baseDef : isHp ? activeHero.baseHp : activeHero.baseSpd;
            const transBonus = isSpd ? 0 : (isAtk ? finalStats.tAtk : isDef ? finalStats.tDef : finalStats.tHp);
            const potenValue = isSpd ? 0 : (isAtk ? finalStats.pAtk : isDef ? finalStats.pDef : finalStats.pHp);

            return (
              <div key={statKey} className="flex flex-col md:flex-row md:items-center justify-between bg-(--input-bg) hover:bg-(--hover-bg) transition-colors p-4 rounded-2xl border border-(--border-color) gap-4 md:gap-0 shadow-[inset_0_1px_1px_var(--glass-inner)]">
                <div className="flex items-center gap-3 w-full md:w-1/4">
                  <div className={`w-1.5 h-6 rounded-full ${colorClass}`}></div>
                  <span className="font-bold text-(--text-main)">{label}</span>
                </div>
                <div className="w-full md:w-1/5 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-[11px] text-(--text-muted) uppercase">Base</span>
                  <span className={`arcade-value-mini ${isDarkMode ? '' : '!text-slate-700 ![text-shadow:none]'}`}>{baseValue?.toLocaleString() || 0}</span>
                </div>
                <div className="w-full md:w-1/5 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-[11px] text-(--text-muted) uppercase">Trans</span>
                  <span key={transBonus} className={`animate-value-change transition-colors ${isDarkMode ? 'arcade-value-bonus text-[#00bfff]' : 'text-blue-700 font-bold text-base'}`}>{isSpd ? '-' : `+${transBonus.toLocaleString()}`}</span>
                </div>
                <div className="w-full md:w-1/5 flex justify-between md:justify-center items-center">
                  <span className="md:hidden text-[11px] text-(--text-muted) uppercase">Level</span>
                  <div className={`flex items-center bg-(--bg-color) border border-(--border-color) rounded-lg overflow-hidden shadow-sm h-8 w-24 ${isSpd ? 'opacity-20 grayscale pointer-events-none' : ''}`}>
                    <button type="button" onClick={() => handlePotentialChange(statKey, potentials[statKey] - 1)} disabled={potentials[statKey] <= 0} className="w-8 h-full flex items-center justify-center text-(--text-main) hover:bg-(--hover-bg) active:bg-(--border-color)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M20 12H4" /></svg></button>
                    <input type="number" className={`flex-1 w-full h-full text-center bg-(--input-bg) border-x border-(--border-color) focus:outline-none hide-spin-button !text-[16px] transition-colors ${isDarkMode ? 'arcade-value-mini' : 'text-slate-800 font-bold'}`} value={isSpd ? 0 : (potentials[statKey] === 0 ? '' : potentials[statKey])} disabled={isSpd} placeholder="0" onChange={(e) => { let val = parseInt(e.target.value, 10); if (isNaN(val)) val = 0; handlePotentialChange(statKey, val); }} />
                    <button type="button" onClick={() => handlePotentialChange(statKey, potentials[statKey] + 1)} disabled={potentials[statKey] >= 30} className="w-8 h-full flex items-center justify-center text-(--text-main) hover:bg-(--hover-bg) active:bg-(--border-color)"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 4v16m8-8H4" /></svg></button>
                  </div>
                </div>
                <div className="w-full md:w-[15%] flex justify-between md:justify-end items-center pr-2">
                  <span className="md:hidden text-[11px] text-(--text-muted) uppercase">Poten Add</span>
                  <span key={potenValue} className={`animate-value-change transition-colors ${isDarkMode ? 'arcade-value-bonus text-[#ffd700]' : 'text-amber-700 font-bold text-base'}`}>{isSpd ? '-' : `+${potenValue.toLocaleString()}`}</span>
                </div>
              </div>
            );
          })}

          <div className="mt-2 pt-5 border-t border-(--border-color) flex flex-col gap-3">
            <div className="flex justify-between items-end px-1">
              <span className="text-[11px] text-(--text-muted) font-bold tracking-widest uppercase flex items-center gap-1.5"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg> Total Raw Stats</span>
              <span className="text-[9px] text-(--text-muted) opacity-70 font-semibold uppercase tracking-wider">( Base + Trans + Poten )</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Attack', colorClass: 'red', val: (activeHero.baseAtk || 0) + (finalStats.tAtk || 0) + (finalStats.pAtk || 0), add: (finalStats.tAtk || 0) + (finalStats.pAtk || 0) },
                { label: 'Defense', colorClass: 'blue', val: (activeHero.baseDef || 0) + (finalStats.tDef || 0) + (finalStats.pDef || 0), add: (finalStats.tDef || 0) + (finalStats.pDef || 0) },
                { label: 'HP', colorClass: 'green', val: (activeHero.baseHp || 0) + (finalStats.tHp || 0) + (finalStats.pHp || 0), add: (finalStats.tHp || 0) + (finalStats.pHp || 0) },
                { label: 'Speed', colorClass: 'yellow', val: activeHero.baseSpd || 0, add: 0 }
              ].map(stat => (
                <div key={stat.label} className="bg-(--input-bg) border border-(--border-color) rounded-2xl p-4 flex flex-col items-center justify-center shadow-inner relative overflow-hidden group transition-all hover:-translate-y-0.5">
                  <div className={`absolute inset-0 bg-${stat.colorClass}-500/5 group-hover:bg-${stat.colorClass}-500/15 transition-colors`}></div>
                  <span className={`text-xs md:text-sm font-bold text-${stat.colorClass}-500 mb-2 uppercase tracking-widest`}>{stat.label}</span>
                  <span key={stat.val} className={`animate-value-change transition-colors tracking-widest ${isDarkMode ? `text-${stat.colorClass}-400 ![text-shadow:0_0_8px_currentColor]` : `!text-${stat.colorClass}-700 ![text-shadow:none]`}`} style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '1.1rem' }}>
                    {stat.val.toLocaleString()}
                  </span>
                  <div className="h-3 mt-1.5 flex items-center justify-center">
                    {stat.add > 0 && <span className="text-emerald-500 font-bold tracking-widest drop-shadow-[0_0_2px_rgba(16,185,129,0.5)]" style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '0.55rem' }}>(+{stat.add.toLocaleString()})</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
});