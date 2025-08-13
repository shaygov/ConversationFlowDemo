import { IWorkspaceModel, WorkspaceModel } from '@/services/layout/workspaceLayout.types';
import { defaultWorkspace } from '@/services/layout/workspaceLayout.store';
import { IWorkspacesState } from '@/zustand/workspaces'
import { IUsersState }     from '@/zustand/users'

export class WorkspaceService {
  constructor(
    private workspaces: IWorkspacesState['workspaces'],
    private userWorkspaces: IUsersState['user']['workspaces'] | undefined
  ) {}

  buildList(): IWorkspaceModel[] {
    const result: IWorkspaceModel[] = [];
    for (const uw of this.userWorkspaces || []) {
      const { workspaceTypeId: type, workspaceId: id, workspaceSlug: slug } = uw
      const bucket = this.workspaces[type] || []
      const data = bucket.find(w => w.id === id)
      if (data) {
        result.push(new WorkspaceModel(
          data.id, type, data.name, null, data.imageURL || null, slug || null
        ))
      }
    }
    
    // Sort by workspace name
    result.sort((a, b) => a.name.localeCompare(b.name));
    
    // Add default workspace (chat workspace - type 0)
    result.unshift(defaultWorkspace);
    return result;
  }
}