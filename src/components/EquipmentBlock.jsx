import React from 'react';
import { SET_OPTIONS, SUBSTAT_BASES } from '../utils/constants';
import { getSubstatValue, formatStatValue } from '../utils/helpers';

export const EquipmentBlock = ({ title, data, onChange, allowedMains }) => {
  // Calculate remaining rolls for this specific equipment piece
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
    
    // Enforce the strict limit of 5 total rolls per equipment
    if (usedByOthers + newVal > 5) {
      newVal = 5 - usedByOthers;
    }

    const newSubs = [...data.substats];
    newSubs[index].rolls = newVal;
    onChange({ ...data, substats: newSubs });
  };

  const mainStatKeys = allowedMains ? Object.keys(allowedMains) : Object.keys(SUBSTAT_BASES);

  return (
    <div className="border border-slate-600 bg-slate-900 flex flex-col">
      {/* Dynamic Header with Usable Substats */}
      <div className="bg-slate-700 text-white font-bold text-xs p-1 uppercase border border-slate-600 flex justify-between items-center">
        <span>{title}</span>
        <span className={remainingRolls === 0 ? "text-slate-400" : "text-green-400"}>
          USABLE SUBSTATS: {remainingRolls}
        </span>
      </div>
      
      <div className="grid grid-cols-4 border-b border-slate-700">
        <div className="bg-slate-800 text-slate-300 text-xs p-1 flex items-center">SET NAME</div>
        <div className="col-span-3 p-1">
          <select className="w-full bg-transparent text-white text-xs border border-slate-600 outline-none p-1"
            value={data.set} onChange={(e) => onChange({...data, set: e.target.value})}>
            {SET_OPTIONS.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-4 border-b border-slate-700">
        <div className="bg-slate-800 text-yellow-500 font-bold text-xs p-1 flex items-center">MAIN STAT</div>
        <div className="col-span-2 p-1 border-r border-slate-700">
          <select className="w-full bg-transparent text-white text-xs outline-none p-1"
            value={data.mainStat.type} onChange={(e) => updateMainStat(e.target.value)}>
            {mainStatKeys.map(s => <option key={s} value={s} className="bg-slate-900">{s}</option>)}
          </select>
        </div>
        <div className="col-span-1 p-1 flex items-center justify-end pr-2 text-white text-xs font-bold">
          {formatStatValue(data.mainStat.type, data.mainStat.value)}
        </div>
      </div>

      <div className="grid grid-cols-12 bg-slate-800 border-b border-slate-700 text-[10px] text-slate-400 font-bold">
        <div className="col-span-7 p-1 border-r border-slate-700">SUBSTATS</div>
        <div className="col-span-2 p-1 border-r border-slate-700 text-center">ROLLS</div>
        <div className="col-span-3 p-1 text-center">TOTAL VAL</div>
      </div>

      {data.substats.map((sub, idx) => {
        const selectedByOthers = data.substats
          .filter((_, i) => i !== idx)
          .map(s => s.type);

        return (
          <div key={idx} className="grid grid-cols-12 border-b border-slate-800 last:border-b-0 text-xs hover:bg-slate-800">
            <div className="col-span-7 p-1 border-r border-slate-700">
              <select className="w-full bg-transparent text-slate-200 outline-none text-xs"
                value={sub.type} onChange={(e) => updateSubstatType(idx, e.target.value)}>
                {Object.keys(SUBSTAT_BASES).map(s => (
                  <option 
                    key={s} 
                    value={s} 
                    className="bg-slate-900 disabled:text-slate-600 disabled:bg-slate-950"
                    disabled={selectedByOthers.includes(s)}
                  >
                    {s}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2 p-1 border-r border-slate-700">
              <input 
                type="number" 
                min="0" 
                max="5" 
                className="w-full bg-slate-950 text-slate-200 border border-slate-600 outline-none text-center disabled:opacity-50"
                value={sub.rolls} 
                onChange={(e) => updateSubstatRolls(idx, e.target.value)} 
              />
            </div>
            <div className="col-span-3 p-1 flex items-center justify-end pr-2 text-white">
              {formatStatValue(sub.type, getSubstatValue(sub.type, sub.rolls))}
            </div>
          </div>
        );
      })}
    </div>
  );
};