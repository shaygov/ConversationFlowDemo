import React from 'react';
import styled from '@emotion/styled';

const DropdownWrapper = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  margin-top: -5px;
  transform: translateY(-100%);
  background: #444444;
  color: #222;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  max-height: 200px;
  overflow-y: auto;
  min-width: 180px;
  z-index: 100;
`;

const DropdownItem = styled.div`
  padding: 10px;
  cursor: pointer;
  color: #fff;
  &:hover {
    text-decoration: underline;
  }
`;

interface MentionsDropdownProps {
  showMentions: boolean;
  filteredUsers: any[];
  onSelect: (user: any) => void;
}

const MentionsDropdown: React.FC<MentionsDropdownProps> = ({ showMentions, filteredUsers, onSelect }) => {
  if (!showMentions || filteredUsers.length === 0) return null;
  return (
    <DropdownWrapper>
      {filteredUsers.map(user => (
        <DropdownItem
          key={user.id}
          onClick={() => onSelect(user)}
        >
          @{user.name || user.id}
        </DropdownItem>
      ))}
    </DropdownWrapper>
  );
};

export default MentionsDropdown; 