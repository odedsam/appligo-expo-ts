// import create from 'zustand'
// import { fetchGoals, insertGoal, updateGoalInDb, deleteGoalFromDb } from '@/lib/goal-db'

// export interface Goal {
//   id: number
//   title: string
//   description?: string
//   created_at: string
// }

// interface GoalsState {
//   goals: Goal[]
//   loadGoals: () => Promise<void>
//   addGoal: (goal: Omit<Goal, 'id' | 'created_at'>) => Promise<void>
//   updateGoal: (id: number, data: Partial<Omit<Goal, 'id' | 'created_at'>>) => Promise<void>
//   removeGoal: (id: number) => Promise<void>
// }

// export const useGoalStore = create<GoalsState>((set, get) => ({
//   goals: [],

//   loadGoals: async () => {
//     const goals = await fetchGoals()
//     set({ goals })
//   },

//   addGoal: async (goal) => {
//     await insertGoal(goal)
//     await get().loadGoals()
//   },

//   updateGoal: async (id, data) => {
//     await updateGoalInDb(id, data)
//     await get().loadGoals()
//   },

//   removeGoal: async (id) => {
//     await deleteGoalFromDb(id)
//     await get().loadGoals()
//   },
// }))
