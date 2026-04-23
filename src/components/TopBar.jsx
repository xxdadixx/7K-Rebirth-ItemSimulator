import React, { useState, useRef, useEffect } from 'react';

export const TopBar = ({ presets, onSavePreset, onLoadPreset, onDeletePreset, isDarkMode, toggleDarkMode }) => {
  const [showPresetMenu, setShowPresetMenu] = useState(false);
  const [presetNameInput, setPresetNameInput] = useState('');
  const presetMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (presetMenuRef.current && !presetMenuRef.current.contains(event.target)) setShowPresetMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSave = () => {
    onSavePreset(presetNameInput);
    setPresetNameInput('');
    setShowPresetMenu(false);
  };

  return (
    <div className="sticky top-4 md:top-6 z-120 flex justify-end gap-3 w-full pointer-events-none mb-8">
      <div className="relative pointer-events-auto" ref={presetMenuRef}>
        <button onClick={() => setShowPresetMenu(!showPresetMenu)} className="flex items-center gap-2 px-4 py-2 rounded-full bg-(--card-bg) backdrop-blur-xl border border-(--border-color) shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm font-medium text-(--text-main)">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" /></svg>
          Presets
        </button>

        {showPresetMenu && (
          <div className="absolute right-0 top-full mt-3 w-80 bg-(--bg-color) border border-(--border-color) rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="bg-(--card-header) p-3 border-b border-(--border-color) flex justify-between items-center">
              <h3 className="text-xs font-semibold uppercase tracking-widest text-(--text-muted)">Saved Setups</h3>
              <span className="text-[10px] bg-(--input-bg) px-2 py-1 rounded-full text-(--text-main)">{presets.length} Configs</span>
            </div>
            <div className="max-h-60 overflow-y-auto custom-scrollbar p-2 space-y-1">
              {presets.length === 0 ? (
                <div className="text-center p-4 text-(--text-muted) text-sm">No saved presets</div>
              ) : (
                presets.map(p => (
                  <div key={p.id} className="flex items-center justify-between group p-2 hover:bg-(--hover-bg) rounded-xl transition-colors cursor-pointer" onClick={() => onLoadPreset(p)}>
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold text-(--text-main)">{p.name}</span>
                      <span className="text-[10px] text-(--text-muted)">Hero: {p.heroName}</span>
                    </div>
                    <button onClick={(e) => onDeletePreset(p.id, e)} className="text-red-500 opacity-0 group-hover:opacity-100 hover:scale-110 transition-all p-1" title="Delete Preset">
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t border-(--border-color) bg-(--input-bg) flex gap-2">
              <input type="text" placeholder="Name your setup..." value={presetNameInput} onChange={e => setPresetNameInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSave()} className="flex-1 bg-(--bg-color) border border-(--input-border) rounded-xl px-3 py-2 text-sm text-(--text-main) focus:ring-2 focus:ring-(--accent) outline-none transition-all" />
              <button onClick={handleSave} className="bg-(--accent) text-white px-3 py-2 rounded-xl text-sm font-semibold hover:bg-opacity-90 transition-all active:scale-95">Save</button>
            </div>
          </div>
        )}
      </div>

      <button onClick={toggleDarkMode} className="flex items-center gap-2 px-4 py-2 rounded-full bg-(--card-bg) backdrop-blur-xl border border-(--border-color) shadow-md hover:shadow-lg hover:scale-105 transition-all text-sm font-medium text-(--text-main) pointer-events-auto">
        {isDarkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
      </button>
    </div>
  );
};