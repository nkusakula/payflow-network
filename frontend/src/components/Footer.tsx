import React from 'react';

const Footer: React.FC = () => (
  <footer className="bg-brand-900 dark:bg-slate-950 text-slate-400 border-t border-brand-800 dark:border-slate-800 mt-auto">
    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-sm">
      <span className="font-semibold text-slate-300">PayFlow Network</span>
      <span>Payment Network Operations Platform &mdash; Demo Environment</span>
      <span className="text-xs">© {new Date().getFullYear()} PayFlow Network. All rights reserved.</span>
    </div>
  </footer>
);

export default Footer;
