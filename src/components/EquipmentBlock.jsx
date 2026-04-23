import React from 'react';
import { SET_OPTIONS, SUBSTAT_BASES } from '../utils/constants';
import { getSubstatValue, formatStatValue } from '../utils/helpers';
import { GlassSelect } from './GlassSelect'; // นำเข้า GlassSelect

export const EquipmentBlock = ({ title, data, onChange, allowedMains }) => {
  const usedRolls = data.substats.reduce((sum, sub) => sum + sub.rolls, 0);
  const remainingRolls = 5 - usedRolls;

  const updateMainStat = (typeStr) => {
    let newValue = data.mainStat.value;
    if (allowedMains && allowedMains[typeStr] !== undefined) {
      newValue = allowedMains[typeStr];
    }
    onChange({ ...data, mainStat: { type: typeStr, value: newValue } });
  };

  const updateSubstatType = (index, typeStr) => {
    const newSubs = [...data.substats];
    newSubs[index].type = typeStr;
    onChange({ ...data, substats: newSubs });
  };

  const updateSubstatRolls = (index, rollStr) => {
    let newVal = parseInt(rollStr, 10);
    if (isNaN(newVal) || newVal < 0) newVal = 0;
    const currentRolls = data.substats[index].rolls;
    const usedByOthers = usedRolls - currentRolls;
    if (usedByOthers + newVal > 5) newVal = 5 - usedByOthers;
    const newSubs = [...data.substats];
    newSubs[index].rolls = newVal;
    onChange({ ...data, substats: newSubs });
  };

  const mainStatKeys = allowedMains ? Object.keys(allowedMains) : Object.keys(SUBSTAT_BASES);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-(--card-header)border-b border-(--border-color) flex justify-between items-center rounded-t-3xl">
        <h2 className="text-(--text-main) font-semibold tracking-wide text-sm uppercase">{title}</h2>
        <span className={`text-[10px] font-medium px-2.5 py-1 rounded-full ${remainingRolls === 0 ? "bg-(--input-bg) text-(--text-muted)" : "bg-(--accent) text-white"}`}>
          Usable Substats: {remainingRolls}
        </span>
      </div>

      <div className="p-5 flex flex-col gap-4">
        {/* เปลี่ยนเป็น GlassSelect สำหรับ Set Name */}
        <div>
          <label className="text-[11px] text-(--text-muted) font-medium uppercase tracking-wider mb-2 block pl-1">Set Name</label>
          <GlassSelect
            value={data.set}
            onChange={(val) => onChange({ ...data, set: val })}
            options={SET_OPTIONS.map(s => ({ label: s, value: s }))}
          />
        </div>

        {/* เปลี่ยนเป็น GlassSelect สำหรับ Main Stat */}
        <div>
          <div className="flex justify-between items-end mb-2 px-1">
            <label className="text-[11px] text-(--text-muted) font-medium uppercase tracking-wider">Main Stat</label>
            <span className="text-(--accent) font-bold text-sm">
              {formatStatValue(data.mainStat.type, data.mainStat.value)}
            </span>
          </div>
          <GlassSelect
            value={data.mainStat.type}
            onChange={(val) => updateMainStat(val)}
            options={mainStatKeys.map(s => ({ label: s, value: s }))}
          />
        </div>

        <div className="pt-2">
          <div className="flex text-[10px] text-(--text-muted) font-medium uppercase tracking-wider px-2 pb-2">
            <div className="w-[50%]">Substats</div>
            <div className="w-[25%] text-center">Rolls</div>
            <div className="w-[25%] text-right">Value</div>
          </div>

          <div className="flex flex-col gap-2">
            {data.substats.map((sub, idx) => {
              const selectedByOthers = data.substats.filter((_, i) => i !== idx).map(s => s.type);

              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-[50%]">
                    {/* เปลี่ยนเป็น GlassSelect (แบบ Compact) สำหรับ Substats */}
                    <GlassSelect
                      value={sub.type}
                      onChange={(val) => updateSubstatType(idx, val)}
                      options={Object.keys(SUBSTAT_BASES).map(s => ({
                        label: s,
                        value: s,
                        disabled: selectedByOthers.includes(s)
                      }))}
                      className="text-xs"
                      compact={true}
                    />
                  </div>

                  <div className="w-[25%] flex justify-center">
                    <div className="flex items-center bg-(--bg-color) border border-(--border-color) rounded-lg overflow-hidden shadow-sm h-9">
                      <button
                        onClick={() => updateSubstatRolls(idx, String(sub.rolls - 1))}
                        disabled={sub.rolls <= 0}
                        className="w-7 h-full flex items-center justify-center text-(--text-main) hover:bg-(--hover-bg) active:bg-(--border-color) disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" /></svg>
                      </button>

                      <div className="w-6 h-full text-center text-[12px] font-bold text-(--text-main) border-x border-(--border-color) bg-(--input-bg) flex items-center justify-center">
                        {sub.rolls}
                      </div>

                      <button
                        onClick={() => updateSubstatRolls(idx, String(sub.rolls + 1))}
                        disabled={sub.rolls >= 5 || remainingRolls === 0}
                        className="w-7 h-full flex items-center justify-center text-(--text-main) hover:bg-(--hover-bg) active:bg-(--border-color) disabled:opacity-20 transition-all cursor-pointer disabled:cursor-not-allowed"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                      </button>
                    </div>
                  </div>

                  <div className="w-[25%] text-right text-(--text-main) text-[12px] font-semibold pr-1">
                    {formatStatValue(sub.type, getSubstatValue(sub.type, sub.rolls))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};