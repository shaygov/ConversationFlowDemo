import React, { useState } from 'react';

interface AddLinkModalProps {
  onClose: () => void;
  onSubmit: (url: string) => void;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({ onClose, onSubmit }) => {
  const [url, setUrl] = useState('');
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }} onClick={onClose}>
      <div style={{
        minWidth: 320,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
      }} onClick={e => e.stopPropagation()}>
        <input
          type="text"
          placeholder="Enter or paste a link"
          value={url}
          onChange={e => setUrl(e.target.value)}
          style={{ flex: 1 }}
        />
        <button
          onClick={() => { if (url) { onSubmit(url); setUrl(''); } }}
          style={{ padding: '8px 16px', height: 38, borderRadius: 4, background: '#fff', color: '#000', border: 'none', fontWeight: 600, cursor: 'pointer' }}
        >
          Add Link
        </button>
      </div>
    </div>
  );
};

export default AddLinkModal; 