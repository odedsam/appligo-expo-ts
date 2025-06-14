import create from 'zustand'

export interface Goal {
  id: string
  title: string
  completed: boolean
}

export interface Task {
  id: string
  goalId: string
  title: string
  completed: boolean
}

interface State {
  goals: Goal[]
  tasks: Task[]
  addGoal: (goal: Goal) => void
  toggleGoal: (id: string) => void
  addTask: (task: Task) => void
  toggleTask: (id: string) => void
}

export const useStore = create<State>((set) => ({
  goals: [],
  tasks: [],
  addGoal: (goal) => set((state) => ({ goals: [...state.goals, goal] })),
  toggleGoal: (id) =>
    set((state) => ({
      goals: state.goals.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g),
    })),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)),
    })),
}))
