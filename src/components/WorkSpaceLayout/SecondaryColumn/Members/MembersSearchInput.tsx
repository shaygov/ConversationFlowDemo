import InputField from '@components/forms/ChatInputField';
import { useWorkspaceLayout } from '@/contexts/WorkspaceLayoutProvider';

const MembersSearchInput = () => {
  const { updateWorkspaceColumn, workspacelayout } = useWorkspaceLayout();
  const vlSearch = workspacelayout.secondary.component.props.search || '';
  return (
    <InputField
      value={vlSearch}
      placeholder="Find Members"
      onChange={(event) => {
        updateWorkspaceColumn('secondary', {
          component: {
            type: 'members',
            props: {
              id: 'sidebar-messages-item-members',
              search: event.target.value,
            },
          },
        });
      }}
    />
  );
};

export default MembersSearchInput; 