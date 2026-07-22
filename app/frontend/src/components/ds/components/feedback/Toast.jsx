import React from 'react';
export function Toast({tone='success',title,description,onClose}){
  return <div className={'bk-toast bk-toast-'+tone}>
    <div>
      <p className="bk-toast-title">{title}</p>
      {description&&<p className="bk-toast-desc">{description}</p>}
    </div>
    {onClose&&<button className="bk-toast-close" onClick={onClose} aria-label="Close">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6 6 18M6 6l12 12"/></svg>
    </button>}
  </div>;
}
