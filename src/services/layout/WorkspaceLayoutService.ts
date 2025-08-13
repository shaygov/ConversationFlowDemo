import { workspaceLayoutStore } from './workspaceLayout.store'
import { ColumnContent, ColumnKey, LayoutState, WorkspaceModel, ColumnState } from './workspaceLayout.types'

interface IWorkspaceLayoutService extends ReturnType<typeof WorkspaceLayoutService.getInstance> {
  workspace?: WorkspaceModel;
  workspacelayout?: ColumnState;
  setWorkspaceLayout(layout: ColumnState): void;
  openWorkspaceColumn(column: ColumnKey, content: ColumnContent): void;
  resetWorkspace(workspaceId?: string): void;
  getWorkspaceLayout(): LayoutState;
  getCurrentWorkspace(): WorkspaceModel | null;
  getCurrentWorkspaceLayout(): ColumnState;
  getActiveWorkspaceLayoutId(column: ColumnKey): string | null;
  goBackWorkspace(workspaceId: string): void;
  goForwardWorkspace(workspaceId: string): void;
  updateWorkspaceColumn(column: ColumnKey, content: Partial<ColumnContent>): void;
}

class WorkspaceLayoutService {
  private static instance: WorkspaceLayoutService

  private constructor() {}

  public static getInstance(): WorkspaceLayoutService {
    if (!WorkspaceLayoutService.instance) {
      WorkspaceLayoutService.instance = new WorkspaceLayoutService()
    }
    return WorkspaceLayoutService.instance
  }

  public setWorkspace(ws: WorkspaceModel) {
    workspaceLayoutStore.getState().setWorkspace(ws)
  }

  public setWorkspaceLayout(layout: ColumnState) {
    const state = workspaceLayoutStore.getState();
    const workspace = state.workspace;
    if (!workspace) return;
    
    const workspaces = state.workspaces;
    workspaces[workspace.id] = {
      current: layout,
      history: [],
      future: [],
    };
    
    state.workspaces = workspaces;
  }

  public openWorkspaceColumn(column: ColumnKey, content: ColumnContent) {
    workspaceLayoutStore.getState().openWorkspaceColumn(column, content)
  }

  public updateWorkspaceColumn(column: ColumnKey, content: Partial<ColumnContent>) {
    workspaceLayoutStore.getState().updateWorkspaceColumn(column, content)
  }

  public resetWorkspace(workspaceId?: string) {
    workspaceLayoutStore.getState().resetWorkspace(workspaceId)
  }

  public getWorkspaceLayout(): LayoutState {
    return workspaceLayoutStore.getState()
  }

  public getCurrentWorkspace() {
    return workspaceLayoutStore.getState().workspace;
  }

  public getCurrentWorkspaceLayout() {
    const state = workspaceLayoutStore.getState();
    const workspace = state.workspace;
    if (!workspace) return null;
    return state.workspaces[workspace.id]?.current || {};
  }

  public getActiveWorkspaceLayoutId(column: ColumnKey): string | null {
    const layout = this.getCurrentWorkspaceLayout();
    if (!layout) return null;
    return layout[column]?.id || null;
  }

  public goBackWorkspace(workspaceId: string) {
    workspaceLayoutStore.getState().goBackWorkspace(workspaceId)
  }

  public goForwardWorkspace(workspaceId: string) {
    workspaceLayoutStore.getState().goForwardWorkspace(workspaceId)
  }
}

export type { IWorkspaceLayoutService as WorkspaceLayoutService };
export const workspaceLayoutService = WorkspaceLayoutService.getInstance();