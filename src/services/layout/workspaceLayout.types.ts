export type ColumnKey = 'primary' | 'secondary' | 'tertiary';

export interface ColumnContent {
  id: string
  componentPath?: string,
 
  component?: {
    type: string
    props?: Record<string, any>
  },
  mainComponent?: {
    type: string
    props?: Record<string, any>
  }
}
  
export type ColumnState = {
  [K in ColumnKey]?: ColumnContent | null
} & {
  activePrimaryNavLink?: string,
  activeMainColumnNavLink?: string,
}


export interface IWorkspaceModel {
  id: number
  type: number
  name: string
  image: string | null
  slug: string | null
  iconName: string | null
  unread_count?: number
}

export class WorkspaceModel implements IWorkspaceModel {
  constructor(
    public id: number,
    public type: number,
    public name: string,
    public iconName: string | null,
    public image: string | null,
    public slug: string | null,
    public unread_count?: number,
  ) {}
}

export interface WorkspaceHistory {
  current: ColumnState
  history: ColumnState[]
  future: ColumnState[]
}

export interface LayoutState {
  workspace: IWorkspaceModel | null
  workspaces: Record<string, WorkspaceHistory>

  setWorkspace: (ws: IWorkspaceModel) => void
  openWorkspaceColumn: (column: ColumnKey, content: ColumnContent) => void
  resetWorkspace: (workspaceId?: string) => void
  goBackWorkspace: (workspaceId: string) => void
  goForwardWorkspace: (workspaceId: string) => void
  getActiveWorkspaceLayoutId: (column: ColumnKey) => string | null
  updateWorkspaceColumn: (column: ColumnKey, content: Partial<ColumnContent>) => void
}