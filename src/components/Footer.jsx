import React, { useState } from 'react';

export const Footer = React.memo(() => {
  const currentYear = new Date().getFullYear();

  // 🌟 2. Add state and function for copying Discord ID
  const [discordCopied, setDiscordCopied] = useState(false);

  const handleCopyDiscord = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText("sandy7273"); // Your exact Discord name
    setDiscordCopied(true);
    setTimeout(() => setDiscordCopied(false), 2000); // Hide tooltip after 2 seconds
  };

  return (
    // 🌟 Wrapper for Footer matching the glassmorphism theme
    <footer className="w-full mt-12 py-6 border-t border-(--border-color) bg-(--card-bg) backdrop-blur-xl shadow-[inset_0_1px_1px_var(--glass-inner)] relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6">

        {/* 🌟 Copyright & Creator Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <p className="text-[11px] sm:text-xs font-bold text-(--text-muted) uppercase tracking-widest mb-1">
            © {currentYear} 7K Rebirth Simulator
          </p>
          <p className="text-[10px] sm:text-[11px] font-semibold text-(--text-muted) tracking-wide">
            Created & Maintained by <span className="text-(--accent) font-bold ml-1">DADIII</span>
          </p>
        </div>

        {/* 🌟 Data Reference Disclaimer */}
        <div className="text-center">
          <p className="text-[9px] sm:text-[10px] font-medium text-(--text-muted) opacity-70 max-w-xs md:max-w-sm uppercase tracking-widest">
            Game data referenced from AcidAqua. Not affiliated with the official game.
          </p>
        </div>

        {/* 🌟 Contact / Social Links (Can be updated with actual links) */}
        <div className="flex items-center gap-3">
          {/* 🌟 3. Discord Button with Copy function */}
          <button
            type="button"
            onClick={handleCopyDiscord}
            title="Discord: sandy7273"
            className="relative p-2 rounded-xl bg-(--input-bg) border border-(--border-color) text-(--text-muted) hover:text-[#5865F2] hover:border-[#5865F2] transition-all duration-300 shadow-sm hover:scale-110 group flex items-center justify-center cursor-pointer"
          >
            <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>

            {/* Tooltip Popup when copied */}
            {discordCopied && (
              <span className="absolute -top-8 text-[10px] bg-(--accent) text-white px-2 py-1 rounded-md font-bold shadow-md animate-in fade-in slide-in-from-bottom-1 whitespace-nowrap">
                Copied!
              </span>
            )}
          </button>

          {/* GitHub / Website Button */}
          <button
            type="button"
            title="Creator Website"
            className="p-2 rounded-xl bg-(--input-bg) border border-(--border-color) text-(--text-muted) hover:text-(--text-main) hover:border-(--text-main) transition-all duration-300 shadow-sm hover:scale-110 group"
          >
            <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
          </button>
        </div>

      </div>
    </footer>
  );
});