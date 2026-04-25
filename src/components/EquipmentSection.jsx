import React, { useCallback } from 'react';
import { EquipmentBlock } from './EquipmentBlock';

// 🌟 OPTIMIZATION: Memoize EquipmentSection
export const EquipmentSection = React.memo(({ equipment, setEquipment, validationMsg, heroType }) => {

  // 🌟 OPTIMIZATION: useCallback ensures the function reference never changes
  const handleEqChange = useCallback((slotName, newData) => {
    setEquipment(prev => ({ ...prev, [slotName]: newData }));
  }, [setEquipment]);

  return (
    <div className="relative z-40 flex flex-col">
      <div className="absolute inset-0 rounded-3xl shadow-(--glass-shadow) overflow-hidden">
        <div className="aurora-bg aurora-style-4"></div>
        <div className="absolute inset-0 bg-(--card-bg) backdrop-blur-3xl border border-(--border-color) shadow-[inset_0_1px_1px_var(--glass-inner)] rounded-3xl transition-colors duration-400"></div>
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="bg-(--card-header) p-4 border-b border-(--border-color) rounded-t-3xl flex justify-between items-center">
           <h2 className="text-(--text-muted) font-semibold tracking-widest text-center text-xs uppercase pl-2">Equipment Setup</h2>
           <div className={`px-4 py-1.5 rounded-full border text-[11px] font-bold tracking-widest uppercase shadow-sm transition-colors ${validationMsg.bg} ${validationMsg.color} ${validationMsg.border}`}>
             {validationMsg.text}
           </div>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
            <EquipmentBlock title="Weapon 1" data={equipment.weapon1} allowedMains={{ 'Attack %': 0, 'Weakness Hit Chance': 0, 'Crit Rate': 0 }} onChange={(newData) => handleEqChange('weapon1', newData)} heroType={heroType} isWeapon={true} />
            <EquipmentBlock title="Weapon 2" data={equipment.weapon2} allowedMains={{ 'Attack %': 0, 'Weakness Hit Chance': 0, 'Crit Rate': 0 }} onChange={(newData) => handleEqChange('weapon2', newData)} heroType={heroType} isWeapon={true} />
            <EquipmentBlock title="Armor 1" data={equipment.armor1} allowedMains={{ 'Defense %': 0, 'HP %': 0, 'Block Rate': 0 }} onChange={(newData) => handleEqChange('armor1', newData)} heroType={heroType} isWeapon={false} />
            <EquipmentBlock title="Armor 2" data={equipment.armor2} allowedMains={{ 'Defense %': 0, 'HP %': 0, 'Block Rate': 0 }} onChange={(newData) => handleEqChange('armor2', newData)} heroType={heroType} isWeapon={false} />
          </div>
        </div>
      </div>
    </div>
  );
});