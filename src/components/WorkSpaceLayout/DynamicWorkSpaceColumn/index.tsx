import React, { Suspense, memo, useMemo } from "react";
import Messages from '@/components/WorkSpaceLayout/SecondaryColumn/Messages';
import Members from '@/components/WorkSpaceLayout/SecondaryColumn/Members';
import { useWorkspaceLayout } from "@/contexts/WorkspaceLayoutProvider";
import ChatMessages from "@/components/ChatContainer/Messages";
import { ColumnContent } from "@/services/layout/workspaceLayout.types";

const componentMap: Record<string, React.ComponentType<any>> = {
  'messages': Messages,
  'members': Members, 
  "ChatMessages": ChatMessages,
  // Add more components here as needed
} as const;

type ComponentMapKeys = keyof typeof componentMap;

interface DynamicComponentProps {
  type: string;
  layoutComponentType: keyof Pick<Required<ColumnContent>, 'component' | 'mainComponent'>;
}

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <div>Something went wrong loading this component.</div>;
    }

    return this.props.children;
  }
}

const DynamicWorkSpaceColumn: React.FC<DynamicComponentProps> = memo(({type, layoutComponentType}) => {
  const {workspacelayout} =  useWorkspaceLayout();
  
  const { componentType, content } = useMemo(() => {
    const content = workspacelayout[type as keyof typeof workspacelayout] as ColumnContent;
    const componentType = layoutComponentType === 'mainComponent' 
      ? content?.mainComponent?.type 
      : content?.component?.type;
    
    return { componentType, content };
  }, [workspacelayout, type, layoutComponentType]);

  const Component = componentType ? componentMap[componentType as ComponentMapKeys] : null;

  if (!Component || !content?.[layoutComponentType]) {
    return null;
  }
  
  const componentProps = content[layoutComponentType].props || {};

  return (
    <ErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <Component 
          {...componentProps}
        />
      </Suspense>
    </ErrorBoundary>
  );
});

DynamicWorkSpaceColumn.displayName = 'DynamicWorkSpaceColumn';

export default DynamicWorkSpaceColumn; 