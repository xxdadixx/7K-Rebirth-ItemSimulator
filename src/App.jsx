import React, { useState, useEffect, useMemo, useRef } from 'react';
import { RING_OPTIONS, WEAPON_MAIN_VALUES, ARMOR_MAIN_VALUES } from './utils/constants';
import { parseCSVData, getTranscendBonus, getSubstatValue, calculateSetBonus, getValidationStatus, getPotentialValue } from './utils/helpers';
import { GridHeader } from './components/GridHeader';
import { EquipmentBlock } from './components/EquipmentBlock';

// คอมโพเนนต์สำหรับแสดงแถวสเตตัสแต่ละบรรทัด พร้อมเอฟเฟกต์แสงกระพริบเมื่อค่าเปลี่ยน
const AnimatedStatRow = ({ item, stat, isPercent }) => {
  const total = stat.base + stat.totalChar + stat.totalEquip;
  const [isFlashing, setIsFlashing] = useState(false);

  // useRef ใช้สำหรับจำค่าสเตตัสก่อนหน้า เพื่อเอามาเทียบว่าค่าเปลี่ยนไปหรือยัง
  const prevTotal = useRef(total);

  useEffect(() => {
    // ถ้าสเตตัสปัจจุบัน ไม่เท่ากับ สเตตัสก่อนหน้า = มีการอัพเกรด!
    if (prevTotal.current !== total) {
      setIsFlashing(true);
      const timer = setTimeout(() => setIsFlashing(false), 500); // แสงวาบ 0.5 วินาที
      prevTotal.current = total; // จำค่าใหม่เอาไว้
      return () => clearTimeout(timer);
    }
  }, [total]);

  // ฟังก์ชันช่วยจัดรูปแบบตัวเลข (เติม % หรือใส่ลูกน้ำ)
  const fmt = (val) => isPercent ? `${val}%` : val.toLocaleString();

  return (
    <div className={`relative group flex justify-between items-center text-sm border-b border-slate-700 pb-1 last:border-b-0 cursor-help px-1 rounded transition-all duration-300 ${isFlashing ? 'bg-green-900/40 scale-[1.02] border-transparent z-10' : ''}`}>
      <span className={`${item.color} font-bold`}>{item.label}</span>

      <div className="flex items-center gap-1">
        {/* ตัวเลขจะเรืองแสงสีเขียวสว่างเมื่อค่าเปลี่ยน */}
        <span className={`font-bold transition-colors duration-300 ${isFlashing ? 'text-green-300 drop-shadow-[0_0_8px_rgba(74,222,128,1)]' : 'text-white'}`}>
          {fmt(total)}
        </span>

        {stat.totalChar > 0 && <span className="text-yellow-300 text-[10px] font-bold">(+{fmt(stat.totalChar)})</span>}
        {stat.totalEquip > 0 && <span className="text-green-400 text-[10px] font-bold">(+{fmt(stat.totalEquip)})</span>}
      </div>

      {/* Tooltip Box (ทำงานตอนเอาเมาส์ชี้) */}
      {stat.details.length > 0 && (
        <div className="hidden group-hover:block absolute top-full right-0 mt-1 w-56 bg-slate-950 border border-slate-500 rounded shadow-2xl p-2 z-50 pointer-events-none">
          <div className="text-[11px] font-bold text-white border-b border-slate-700 pb-1 mb-1 flex justify-between">
            <span>{item.label} Breakdown</span>
            <span className="text-slate-400">Base: {fmt(stat.base)}</span>
          </div>
          {stat.details.map((d, i) => (
            <div key={i} className={`flex justify-between text-[10px] ${d.color} leading-tight py-[2px]`}>
              <span>{d.label}</span>
              <span className="font-bold">+{fmt(d.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [heroDataList, setHeroDataList] = useState([]);
  const [selectedHeroName, setSelectedHeroName] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [transcend, setTranscend] = useState(6);
  const [ring, setRing] = useState(5);

  const [potentials, setPotentials] = useState({ atk: 0, def: 0, hp: 0 });

  const defaultSubstats = () => [
    { type: 'Attack %', rolls: 0 },
    { type: 'Defense %', rolls: 0 },
    { type: 'HP %', rolls: 0 },
    { type: 'Speed', rolls: 0 }
  ];

  const [equipment, setEquipment] = useState({
    weapon1: {
      set: 'None',
      mainStat: { type: 'Attack %', value: 0 },
      substats: defaultSubstats()
    },
    weapon2: {
      set: 'None',
      mainStat: { type: 'Attack %', value: 0 },
      substats: defaultSubstats()
    },
    armor1: {
      set: 'None',
      mainStat: { type: 'Defense %', value: 0 },
      substats: defaultSubstats()
    },
    armor2: {
      set: 'None',
      mainStat: { type: 'Defense %', value: 0 },
      substats: defaultSubstats()
    }
  });

  useEffect(() => {
    fetch('../public/DATA.csv')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.text();
      })
      .then(text => {
        const parsed = parseCSVData(text);
        if (parsed.length > 0) {
          setHeroDataList(parsed);
          setSelectedHeroName(parsed[0].name);
        } else {
          throw new Error("Parsed data is empty. Check CSV format.");
        }
      })
      .catch(err => {
        console.error("Error loading CSV:", err);
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const activeHero = useMemo(() => heroDataList.find(h => h.name === selectedHeroName) || null, [heroDataList, selectedHeroName]);

  const finalStats = useMemo(() => {
    if (!activeHero) return null;

    let totals = {
      'Attack %': 0, 'Attack Flat': 0, 'Defense %': 0, 'Defense Flat': 0,
      'HP %': 0, 'HP Flat': 0, 'Speed': 0,
      'Crit Rate': 0, 'Crit Damage': 0,
      'Weakness Hit Chance': 0, 'Block Rate': 0, 'Damage Taken Reduction': 0,
      'Effect Hit Rate': 0, 'Effect Resistance': 0
    };

    Object.values(equipment).forEach(eq => {
      if (eq.set === 'None') return;
      totals[eq.mainStat.type] = (totals[eq.mainStat.type] || 0) + eq.mainStat.value;
      eq.substats.forEach(sub => {
        totals[sub.type] = (totals[sub.type] || 0) + getSubstatValue(sub.type, sub.rolls);
      });
    });

    const eqList = [equipment.weapon1.set, equipment.weapon2.set, equipment.armor1.set, equipment.armor2.set];
    const setCounts = {};
    eqList.forEach(s => { setCounts[s] = (setCounts[s] || 0) + 1; });

    const vanguardAtkPct = setCounts['Vanguard'] === 4 ? 45 : (setCounts['Vanguard'] >= 2 ? 20 : 0);
    const guardianDefPct = setCounts['Guardian'] === 4 ? 45 : (setCounts['Guardian'] >= 2 ? 20 : 0);
    const paladinHpPct = setCounts['Paladin'] === 4 ? 40 : (setCounts['Paladin'] >= 2 ? 17 : 0);

    const assassinCR = setCounts['Assassin'] === 4 ? 30 : (setCounts['Assassin'] >= 2 ? 15 : 0);
    const bountyWK = setCounts['Bounty Tracker'] === 4 ? 35 : (setCounts['Bounty Tracker'] >= 2 ? 15 : 0);
    const gatekeeperBLK = setCounts['Gatekeeper'] === 4 ? 30 : (setCounts['Gatekeeper'] >= 2 ? 15 : 0);
    const spellweaverEFF = setCounts['Spellweaver'] === 4 ? 35 : (setCounts['Spellweaver'] >= 2 ? 17 : 0);
    const vanguardEFF = setCounts['Vanguard'] === 4 ? 20 : 0;
    const orchestratorRES = setCounts['Orchestrator'] === 4 ? 35 : (setCounts['Orchestrator'] >= 2 ? 17 : 0);
    const guardianRES = setCounts['Guardian'] === 4 ? 20 : 0;

    let t4CR = 0, t4CDM = 0, t4WK = 0, t4BLK = 0, t4RED = 0, t4EFF = 0;
    if (transcend >= 4) {
      switch (activeHero.star4Type) {
        case 'CR': t4CR = 18; break;
        case 'CDM': t4CDM = 24; break;
        case 'WK': t4WK = 20; break;
        case 'BLK': t4BLK = 18; break;
        case 'RED': t4RED = 10; break;
        case 'EFF': t4EFF = 24; break;
        default: break;
      }
    }

    const tAtk = getTranscendBonus(activeHero.baseAtk, activeHero.grade, activeHero.starType, 'Attack', transcend);
    const tDef = getTranscendBonus(activeHero.baseDef, activeHero.grade, activeHero.starType, 'Defense', transcend);
    const tHp = getTranscendBonus(activeHero.baseHp, activeHero.grade, activeHero.starType, 'HP', transcend);

    const pAtk = getPotentialValue('atk', potentials.atk);
    const pDef = getPotentialValue('def', potentials.def);
    const pHp = getPotentialValue('hp', potentials.hp);

    const atkPctVal = Math.floor(activeHero.baseAtk * totals['Attack %'] / 100);
    const atkSetVal = Math.floor(activeHero.baseAtk * vanguardAtkPct / 100);
    const atkRingVal = Math.floor(activeHero.baseAtk * ring / 100);

    const defPctVal = Math.floor(activeHero.baseDef * totals['Defense %'] / 100);
    const defSetVal = Math.floor(activeHero.baseDef * guardianDefPct / 100);
    const defRingVal = Math.floor(activeHero.baseDef * ring / 100);

    const hpPctVal = Math.floor(activeHero.baseHp * totals['HP %'] / 100);
    const hpSetVal = Math.floor(activeHero.baseHp * paladinHpPct / 100);
    const hpRingVal = Math.floor(activeHero.baseHp * ring / 100);

    const breakdown = {
      atk: {
        base: activeHero.baseAtk,
        totalChar: (304 * 2) + tAtk + pAtk,
        totalEquip: totals['Attack Flat'] + atkPctVal + atkSetVal + atkRingVal,
        details: [
          { label: '[Char] Level Base Bonus', value: 304 * 2, color: 'text-yellow-300' },
          { label: '[Char] Transcend', value: tAtk, color: 'text-yellow-300' },
          { label: '[Char] Potential', value: pAtk, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Flat', value: totals['Attack Flat'], color: 'text-green-400' },
          { label: `[Equip] Main/Sub (${totals['Attack %']}%)`, value: atkPctVal, color: 'text-green-400' },
          { label: `[Equip] Vanguard Set (${vanguardAtkPct}%)`, value: atkSetVal, color: 'text-green-400' },
          { label: `[Equip] Ring (${ring}%)`, value: atkRingVal, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      def: {
        base: activeHero.baseDef,
        totalChar: (189 * 2) + tDef + pDef,
        totalEquip: totals['Defense Flat'] + defPctVal + defSetVal + defRingVal,
        details: [
          { label: '[Char] Level Base Bonus', value: 189 * 2, color: 'text-yellow-300' },
          { label: '[Char] Transcend', value: tDef, color: 'text-yellow-300' },
          { label: '[Char] Potential', value: pDef, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Flat', value: totals['Defense Flat'], color: 'text-green-400' },
          { label: `[Equip] Main/Sub (${totals['Defense %']}%)`, value: defPctVal, color: 'text-green-400' },
          { label: `[Equip] Guardian Set (${guardianDefPct}%)`, value: defSetVal, color: 'text-green-400' },
          { label: `[Equip] Ring (${ring}%)`, value: defRingVal, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      hp: {
        base: activeHero.baseHp,
        totalChar: (1079 * 2) + tHp + pHp,
        totalEquip: totals['HP Flat'] + hpPctVal + hpSetVal + hpRingVal,
        details: [
          { label: '[Char] Level Base Bonus', value: 1079 * 2, color: 'text-yellow-300' },
          { label: '[Char] Transcend', value: tHp, color: 'text-yellow-300' },
          { label: '[Char] Potential', value: pHp, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Flat', value: totals['HP Flat'], color: 'text-green-400' },
          { label: `[Equip] Main/Sub (${totals['HP %']}%)`, value: hpPctVal, color: 'text-green-400' },
          { label: `[Equip] Paladin Set (${paladinHpPct}%)`, value: hpSetVal, color: 'text-green-400' },
          { label: `[Equip] Ring (${ring}%)`, value: hpRingVal, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      spd: {
        base: activeHero.baseSpd, totalChar: 0, totalEquip: totals['Speed'],
        details: [{ label: '[Equip] Main/Sub Stats', value: totals['Speed'], color: 'text-green-400' }].filter(d => d.value > 0)
      },
      critRate: {
        base: 5, totalChar: t4CR, totalEquip: assassinCR + totals['Crit Rate'],
        details: [
          { label: '[Char] Star 4 Bonus', value: t4CR, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Stats', value: totals['Crit Rate'], color: 'text-green-400' },
          { label: '[Equip] Assassin Set', value: assassinCR, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      critDmg: {
        base: 150, totalChar: t4CDM, totalEquip: totals['Crit Damage'],
        details: [
          { label: '[Char] Star 4 Bonus', value: t4CDM, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Stats', value: totals['Crit Damage'], color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      weakness: {
        base: 0, totalChar: t4WK, totalEquip: bountyWK + totals['Weakness Hit Chance'],
        details: [
          { label: '[Char] Star 4 Bonus', value: t4WK, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Stats', value: totals['Weakness Hit Chance'], color: 'text-green-400' },
          { label: '[Equip] Bounty Tracker Set', value: bountyWK, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      block: {
        base: 0, totalChar: t4BLK, totalEquip: gatekeeperBLK + totals['Block Rate'],
        details: [
          { label: '[Char] Star 4 Bonus', value: t4BLK, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Stats', value: totals['Block Rate'], color: 'text-green-400' },
          { label: '[Equip] Gatekeeper Set', value: gatekeeperBLK, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      dmgReduc: {
        base: 0, totalChar: t4RED, totalEquip: totals['Damage Taken Reduction'],
        details: [
          { label: '[Char] Star 4 Bonus', value: t4RED, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Stats', value: totals['Damage Taken Reduction'], color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      effHit: {
        base: 0, totalChar: t4EFF, totalEquip: spellweaverEFF + vanguardEFF + totals['Effect Hit Rate'],
        details: [
          { label: '[Char] Star 4 Bonus', value: t4EFF, color: 'text-yellow-300' },
          { label: '[Equip] Main/Sub Stats', value: totals['Effect Hit Rate'], color: 'text-green-400' },
          { label: '[Equip] Spellweaver Set', value: spellweaverEFF, color: 'text-green-400' },
          { label: '[Equip] Vanguard Set', value: vanguardEFF, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      },
      effRes: {
        base: 0, totalChar: 0, totalEquip: orchestratorRES + guardianRES + totals['Effect Resistance'],
        details: [
          { label: '[Equip] Main/Sub Stats', value: totals['Effect Resistance'], color: 'text-green-400' },
          { label: '[Equip] Orchestrator Set', value: orchestratorRES, color: 'text-green-400' },
          { label: '[Equip] Guardian Set', value: guardianRES, color: 'text-green-400' }
        ].filter(d => d.value > 0)
      }
    };

    return {
      tAtk, tDef, tHp,   // ส่งค่า Transcend กลับไปให้ตารางบน
      pAtk, pDef, pHp,   // ส่งค่า Potential กลับไปให้ตารางบน
      breakdown,
      activeSetBonus: calculateSetBonus(eqList)
    };
  }, [activeHero, potentials, equipment, ring, transcend]);

  const [isUpgrading, setIsUpgrading] = useState(false);

  // เอฟเฟกต์จะทำงานทุกครั้งที่ finalStats มีการคำนวณค่าใหม่
  useEffect(() => {
    if (!finalStats) return;

    // ใช้ setTimeout ครอบไว้เพื่อไม่ให้ setState ทำงาน Synchronous ทันที (แก้ Error ESLint)
    const startTimer = setTimeout(() => {
      setIsUpgrading(true);
    }, 10); // ดีเลย์แค่ 10ms (มองไม่เห็นด้วยตาเปล่า)

    // ตั้งเวลาให้แสงดับลง
    const stopTimer = setTimeout(() => {
      setIsUpgrading(false);
    }, 400);

    // ล้าง Timer ออกเมื่อ Component ถูกลบหรือรันใหม่
    return () => {
      clearTimeout(startTimer);
      clearTimeout(stopTimer);
    };
  }, [finalStats]);

  const validationMsg = getValidationStatus(equipment);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white font-mono text-xl animate-pulse">Loading data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="bg-red-900 border-2 border-red-500 p-6 rounded-lg text-white font-mono max-w-lg text-center">
          <h2 className="text-2xl font-bold mb-4">Error Loading Data</h2>
          <div className="bg-slate-950 p-4 rounded text-red-400 text-sm overflow-x-auto text-left mb-4">
            <code>{error}</code>
          </div>
          <p className="text-sm text-slate-300">Please ensure "DATA.csv" is in the "public" folder.</p>
        </div>
      </div>
    );
  }

  if (!activeHero) return <div className="p-10 text-white font-mono">No character data available.</div>;

  const gradeColor = activeHero.grade === 'LEGEND' ? 'text-yellow-400' : activeHero.grade === 'RARE' ? 'text-blue-400' : 'text-white';

  const getRoleColor = (roleStr) => {
    const role = (roleStr || '').toUpperCase();
    if (role.includes('ATTACK')) return 'text-red-400';
    if (role.includes('MAGIC')) return 'text-purple-400';
    if (role.includes('DEFENSE')) return 'text-blue-400';
    if (role.includes('SUPPORT')) return 'text-green-400';
    return 'text-white'; // สีเริ่มต้นถ้าหาไม่เจอ
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 p-2 font-mono text-sm">
      <div className="max-w-7xl mx-auto space-y-2">

        {/* VALIDATION MESSAGE */}
        <div className={`border border-slate-700 bg-slate-900 p-3 text-center whitespace-pre-line font-bold text-xs ${validationMsg.color}`}>
          {validationMsg.text}
        </div>

        {/* TOP SECTION: Character Setup & Base Stats */}
        <div
          className={`grid grid-cols-1 md:grid-cols-4 transition-all duration-500 ${isUpgrading
            ? 'border-green-400 bg-green-900/30 shadow-[0_0_25px_rgba(74,222,128,0.3)] scale-[1.01]'
            : 'border border-slate-600 bg-slate-900 shadow-none scale-100'
            }`}
        >

          <div className="lg:col-span-4 border-r border-slate-600 flex flex-col">
            <GridHeader title="CHARACTER SETUP" />
            <div className="grid grid-cols-3 gap-0 border-b border-slate-700">
              <div className="bg-slate-800 p-1 text-xs text-slate-400 flex items-center">Name</div>
              <div className="col-span-2 p-1">
                {/* 1. ใส่สีให้ Dropdown เลือกชื่อตัวละคร */}
                <select className={`w-full bg-slate-950 border border-slate-600 outline-none text-xs p-1 font-bold ${gradeColor}`}
                  value={selectedHeroName} onChange={e => setSelectedHeroName(e.target.value)}>
                  {heroDataList.map(h => {
                    // ทำให้รายชื่อใน Dropdown มีสีตาม Grade ด้วย
                    const optColor = h.grade === 'LEGEND' ? 'text-yellow-400' : h.grade === 'RARE' ? 'text-blue-400' : 'text-white';
                    return <option key={h.name} value={h.name} className={`bg-slate-900 ${optColor}`}>{h.name}</option>
                  })}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-0 border-b border-slate-700 text-xs">
              <div className="bg-slate-800 p-1 text-slate-400 text-center flex items-center justify-center">Level</div>
              <div className="p-1 border-r border-slate-700 flex items-center">
                {/* ล็อกช่อง Level เป็นข้อความตายตัว 30 (MAX) */}
                <div className="w-full bg-slate-900 text-slate-500 text-center border border-slate-700 py-[2px] cursor-not-allowed font-bold">
                  30 (MAX)
                </div>
              </div>
              <div className="bg-slate-800 p-1 text-slate-400 text-center flex items-center justify-center">Trans</div>
              <div className="p-1">
                <input type="number" min="0" max="12" className="w-full bg-slate-950 text-white text-center border border-slate-600 outline-none focus:border-yellow-500 focus:bg-slate-900 transition-colors"
                  value={transcend} onChange={e => setTranscend(Number(e.target.value))} />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-0 text-xs flex-1">
              <div className="bg-slate-800 p-1 text-slate-400 text-center border-r border-slate-700 flex flex-col justify-center">
                Ele: <span className={`font-bold ${getRoleColor(activeHero.element)}`}>{activeHero.element}</span>
              </div>
              <div className="bg-slate-800 p-1 text-slate-400 text-center border-r border-slate-700 flex flex-col justify-center">
                Type: <span className={`font-bold ${getRoleColor(activeHero.type)}`}>{activeHero.type}</span>
              </div>
              <div className="bg-slate-800 p-1 text-slate-400 text-center flex flex-col justify-center">
                Grade: <span className={`font-bold ${gradeColor}`}>{activeHero.grade}</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-12">
            <div className="col-span-12">
              <GridHeader title="BASE STATS & POTENTIALS & TRANSCENDENCE" />
            </div>
            <div className="col-span-12 grid grid-cols-12 bg-slate-800 border-b border-slate-700 text-[10px] text-center text-slate-400 font-bold">
              <div className="col-span-2 p-1 border-r border-slate-700">STAT</div>
              <div className="col-span-2 p-1 border-r border-slate-700">BASE VAL</div>
              <div className="col-span-3 p-1 border-r border-slate-700">★ TRANSCEND</div>
              <div className="col-span-2 p-1 border-r border-slate-700">POTEN LV</div>
              <div className="col-span-3 p-1">POTEN ADD</div>
            </div>
            {['atk', 'def', 'hp'].map((statKey) => {
              const label = statKey === 'atk' ? 'Attack' : statKey === 'def' ? 'Defense' : 'HP';
              const baseValue = statKey === 'atk' ? activeHero.baseAtk : statKey === 'def' ? activeHero.baseDef : activeHero.baseHp;

              // ดึงค่า Transcendence (โบนัสกลุ่มดาว) ที่คำนวณตามสูตรใหม่มาแสดง
              const transBonus = statKey === 'atk' ? finalStats.tAtk : statKey === 'def' ? finalStats.tDef : finalStats.tHp;
              const potenValue = statKey === 'atk' ? finalStats.pAtk : statKey === 'def' ? finalStats.pDef : finalStats.pHp;

              return (
                <div key={statKey} className="col-span-12 grid grid-cols-12 border-b border-slate-700 text-xs items-center text-center">
                  <div className="col-span-2 p-1 border-r border-slate-700 bg-slate-800 font-bold">{label}</div>
                  <div className="col-span-2 p-1 border-r border-slate-700 text-white">{baseValue}</div>

                  {/* ช่องแสดงผลโบนัส Transcend สีเหลือง */}
                  <div className="col-span-3 p-1 border-r border-slate-700 text-yellow-300 font-bold">
                    +{transBonus}
                  </div>

                  <div className="col-span-2 p-1 border-r border-slate-700">
                    <input type="number" min="0" max="30" className="w-full bg-slate-950 text-white text-center border border-slate-600 outline-none"
                      value={potentials[statKey]} onChange={e => setPotentials({ ...potentials, [statKey]: Number(e.target.value) })} />
                  </div>
                  <div className="col-span-3 p-1 text-green-400 font-bold">
                    +{potenValue}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* MIDDLE SECTION: Final Stats Summary */}
        <div className="border border-slate-600 bg-slate-900 grid grid-cols-1 md:grid-cols-4">
          <div className="md:col-span-4">
            <GridHeader title="FINAL SUMMARY (Hover for breakdown)" />
          </div>

          {/* Main Stats Column */}
          <div className="border-r border-slate-700 p-2 space-y-1 bg-slate-800 flex flex-col justify-center">
            {[
              { label: 'Attack', color: 'text-orange-400', key: 'atk' },
              { label: 'Defense', color: 'text-blue-400', key: 'def' },
              { label: 'HP', color: 'text-green-400', key: 'hp' },
              { label: 'Speed', color: 'text-yellow-400', key: 'spd' }
            ].map(item => (
              <AnimatedStatRow key={item.key} item={item} stat={finalStats.breakdown[item.key]} isPercent={false} />
            ))}
          </div>

          {/* Sub Stats Column 1 */}
          <div className="border-r border-slate-700 p-2 space-y-1 text-xs flex flex-col justify-center">
            {[
              { label: 'Crit Rate', color: 'text-red-400', key: 'critRate' },
              { label: 'Crit Damage', color: 'text-red-400', key: 'critDmg' },
              { label: 'Weakness Hit', color: 'text-purple-400', key: 'weakness' },
              { label: 'Block Rate', color: 'text-blue-300', key: 'block' }
            ].map(item => (
              <AnimatedStatRow key={item.key} item={item} stat={finalStats.breakdown[item.key]} isPercent={true} />
            ))}
          </div>

          {/* Sub Stats Column 2 */}
          <div className="border-r border-slate-700 p-2 space-y-1 text-xs flex flex-col justify-center">
            {[
              { label: 'Dmg Reduction', color: 'text-emerald-400', key: 'dmgReduc' },
              { label: 'Effect Hit', color: 'text-teal-300', key: 'effHit' },
              { label: 'Effect Res', color: 'text-teal-300', key: 'effRes' }
            ].map(item => (
              <AnimatedStatRow key={item.key} item={item} stat={finalStats.breakdown[item.key]} isPercent={true} />
            ))}
          </div>

          {/* Accessory & Set Bonus Column */}
          <div className="p-2 space-y-2 text-xs flex flex-col justify-center">
            <div>
              <select className="w-full bg-slate-950 text-white border border-slate-600 outline-none p-1 focus:border-green-400 transition-colors"
                value={ring} onChange={e => setRing(Number(e.target.value))}>
                {RING_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label} (+{r.value}%)</option>)}
              </select>
            </div>
            <div className="bg-slate-950 border border-slate-700 p-1 text-center text-green-400 whitespace-pre-line leading-tight h-full flex items-center justify-center font-bold">
              {finalStats.activeSetBonus}
            </div>
          </div>
        </div>

        {/* BOTTOM SECTION: Equipment Slots */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
          <EquipmentBlock title="WEAPON 1" data={equipment.weapon1} allowedMains={WEAPON_MAIN_VALUES} onChange={v => setEquipment({ ...equipment, weapon1: v })} />
          <EquipmentBlock title="WEAPON 2" data={equipment.weapon2} allowedMains={WEAPON_MAIN_VALUES} onChange={v => setEquipment({ ...equipment, weapon2: v })} />
          <EquipmentBlock title="ARMOR 1" data={equipment.armor1} allowedMains={ARMOR_MAIN_VALUES} onChange={v => setEquipment({ ...equipment, armor1: v })} />
          <EquipmentBlock title="ARMOR 2" data={equipment.armor2} allowedMains={ARMOR_MAIN_VALUES} onChange={v => setEquipment({ ...equipment, armor2: v })} />
        </div>

      </div>
    </div>
  );
}