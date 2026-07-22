import React from 'react';
export function Modal({open,title,description,children,onClose,primaryLabel='Confirm',secondaryLabel='Cancel',onPrimary}){
  if(!open) return null;
  return <div className="bk-modal-overlay" onClick={onClose}>
    <div className="bk-modal" onClick={e=>e.stopPropagation()}>
      <button className="bk-modal-close" onClick={onClose} aria-label="Close">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      <h2 className="bk-modal-title">{title}</h2>
      {description&&<p className="bk-modal-desc">{description}</p>}
      {children}
      <div className="bk-modal-actions">
        <button className="bk-btn bk-btn-ghost" onClick={onClose}>{secondaryLabel}</button>
        <button className="bk-btn bk-btn-primary" onClick={onPrimary}>{primaryLabel}</button>
      </div>
    </div>
  </div>;
}
