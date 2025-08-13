import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LayoutState, ColumnKey, ColumnContent, ColumnState, IWorkspaceModel, WorkspaceHistory } from './workspaceLayout.types'

export const defaultWorkspace = {
  id: 0,
  type: 0,
  name: 'Home',
  image: '',
  slug: '',
  iconName: '',
} as IWorkspaceModel;
  
export const workspaceLayoutStore = create<LayoutState>()(
  persist(
    (set, get) => ({
      workspace: defaultWorkspace,
      workspaces: {} as Record<string, WorkspaceHistory>,

      setWorkspace: (ws) => {
        const workspaces = get().workspaces
        if (!workspaces[ws.id]) {
          workspaces[ws.id] = {
            current: {},
            history: [],
            future: [],
          }
        }
        set({ workspace: ws, workspaces })
      },

      openWorkspaceColumn: (column, content) => {
        const workspace = get().workspace
        if (!workspace) return

        const workspaces = get().workspaces
        if (!workspaces[workspace.id]) {
          workspaces[workspace.id] = {
            current: {},
            history: [],
            future: [],
          }
        }
        const wsState = workspaces[workspace.id]

        const newState: ColumnState = {
          ...wsState.current,
          [column]: content,
        }

        workspaces[workspace.id] = {
          current: newState,
          history: [wsState.current],
          future: [],
        }

        set({ workspaces: { ...workspaces } })
      },

      updateWorkspaceColumn: (column, content) => {
        const workspace = get().workspace
        if (!workspace) return

        const workspaces = get().workspaces
        const wsState = workspaces[workspace.id]
        if (!wsState?.current[column]) return

        const newState: ColumnState = {
          ...wsState.current,
          [column]: {
            ...wsState.current[column],
            ...content
          }
        }

        workspaces[workspace.id] = {
          current: newState,
          history: [wsState.current], //history: [...wsState.history, wsState.current],
          future: [],
        }

        set({ workspaces: { ...workspaces } })
      },

      getActiveWorkspaceLayoutId: (column: ColumnKey): string | null => {
        const workspace = get().workspace
        if (!workspace) return null
        
        const wsState = get().workspaces[workspace.id]
        if (!wsState) return null

        return wsState.current[column]?.id || null
      },

      resetWorkspace: (workspaceId) => {
        const id = workspaceId || get().workspace?.id
        if (!id) return

        const workspaces = get().workspaces
        workspaces[id] = {
          current: {},
          history: [],
          future: [],
        }

        set({ workspaces: { ...workspaces } })
      },

      goBackWorkspace: (workspaceId) => {
        const ws = get().workspaces[workspaceId]
        if (!ws || ws.history.length === 0) return

        const prev = ws.history.pop()!
        ws.future.unshift(ws.current)
        ws.current = prev
        set({ workspaces: { ...get().workspaces } })
      },

      goForwardWorkspace: (workspaceId) => {
        const ws = get().workspaces[workspaceId]
        if (!ws || ws.future.length === 0) return

        const next = ws.future.shift()!
        ws.history.push(ws.current)
        ws.current = next
        set({ workspaces: { ...get().workspaces } })
      },
      reset: () => set({ 
        workspace: defaultWorkspace,
        workspaces: {},
      }),
    }),
    {
      name: 'chat-messenger-layout',
    }
  )
)