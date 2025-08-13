import React, { useState, useMemo } from 'react';
import emojiData from '@/assets/emoji/data-by-emoji.json';
const emojiList = Object.entries(emojiData);
import styled from '@emotion/styled';

const PopupModalStyled = styled.div`
  display: flex;
  flex-direction: column;
`;

const CustomEmojiPickerStyledA = styled(PopupModalStyled)``;

const CustomEmojiPickerStyledB = styled(PopupModalStyled)`
  padding: 10px;
  background: #444444;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  input {
    padding: 4px 10px;
    height: 38px;
    background-color: #fff;
    color: #000;
    border-radius: 4px;
    z-index: 10;
  }
`;

const getAllGroups = () => {
  const groups = new Set<string>();
  emojiList.forEach(([, data]: any) => groups.add(data.group));
  return Array.from(groups);
};

const CustomEmojiPickerBase = ({ onSelect, Styled }: { onSelect: (slug: string) => void, Styled: any }) => {
  const [search, setSearch] = useState('');
  const [group, setGroup] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const groups = useMemo(getAllGroups, []);

  // Filter by search and category
  const filtered = useMemo(() => {
    return emojiList.filter(([, data]: any) => {
      const matchesGroup = !group || data.group === group;
      const matchesSearch =
        !search ||
        data.name.toLowerCase().includes(search.toLowerCase()) ||
        (data.keywords && data.keywords.some((k: string) => k.includes(search.toLowerCase())));
      return matchesGroup && matchesSearch;
    });
  }, [search, group]);

  return (
    <Styled style={{ width: 340 }}>
      <input
        type="text"
        ref={inputRef}
        placeholder="Search emoji…"
        value={search}
        onChange={(e)=> {
          setSearch(e.target.value)
        }}
        style={{
          width: '100%',
          marginBottom: 8
        }}
      />
      <div style={{ display: 'flex', gap: 4, marginBottom: 8, flexWrap: 'wrap' }}>
        <button
          style={{
            background: !group ? '#444' : 'none',
            color: !group ? '#fff' : '#aaa',
            border: 'none',
            borderRadius: 4,
            padding: '4px 8px',
            cursor: 'pointer',
          }}
          onClick={() => setGroup(null)}
        >
          All
        </button>
        {groups.map(g => (
          <button
            key={g}
            style={{
              background: group === g ? '#444' : 'none',
              color: group === g ? '#fff' : '#aaa',
              border: 'none',
              borderRadius: 4,
              padding: '4px 8px',
              cursor: 'pointer',
            }}
            onClick={() => setGroup(g)}
          >
            {g}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', maxHeight: 220, overflowY: 'auto' }}>
        {filtered.slice(0, 300).map(([emoji, data]) => (
          <button
            key={data.slug}
            style={{
              fontSize: 24,
              padding: 4,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
            }}
            onClick={() => onSelect(data.slug)}
            title={data.name}
          >
            {emoji}
          </button>
        ))}
        {filtered.length === 0 && (
          <div style={{ color: '#aaa', padding: 8 }}>No emoji found</div>
        )}
      </div>
    </Styled>
  );
};

export const CustomEmojiPicker = (props: { onSelect: (slug: string) => void }) => (
  <CustomEmojiPickerBase {...props} Styled={CustomEmojiPickerStyledA} />
);

export const CustomEmojiPickerForReaction = (props: { onSelect: (slug: string) => void }) => (
  <CustomEmojiPickerBase {...props} Styled={CustomEmojiPickerStyledB} />
);

export default CustomEmojiPicker; 