// Define the Task type if not already imported
import Card from "@/components/ui/Card";
import type { Task } from "@/types";
import { Text, View } from 'react-native'
import { TaskItem } from "./TaskItem";
import { Feather } from "@expo/vector-icons";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onTaskPress?: (task: Task) => void;
  onTaskEdit?: (task: Task) => void;
  onTaskDelete?: (task: Task) => void;
  groupBy?: 'none' | 'priority' | 'category' | 'dueDate';
  showCompleted?: boolean;
  emptyMessage?: string;
}

export function TaskList({
  tasks,
  onToggleComplete,
  onTaskPress,
  onTaskEdit,
  onTaskDelete,
  groupBy = 'none',
  showCompleted = true,
  emptyMessage = "No tasks found"
}: TaskListProps) {
  const filteredTasks = showCompleted ? tasks : tasks.filter(task => !task.is_done);

  const groupTasks = (tasks: Task[]) => {
    if (groupBy === 'none') {
      return [{ title: null, tasks }];
    }

    const groups: { title: string | null; tasks: Task[] }[] = [];
    const grouped = tasks.reduce((acc, task) => {
      let key: string;

      switch (groupBy) {
        case 'priority':
          key = task.priority ?? 'No Priority';
          break;
        case 'category':
          key = (task as any).category || 'Uncategorized';
          break;
        case 'dueDate':
          if (!task.due_date) {
            key = 'No Due Date';
          } else {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            const dueDate = typeof task.due_date === "string" ? new Date(task.due_date) : task.due_date;
            if (dueDate.toDateString() === today.toDateString()) {
              key = 'Today';
            } else if (dueDate.toDateString() === tomorrow.toDateString()) {
              key = 'Tomorrow';
            } else if (dueDate < today) {
              key = 'Overdue';
            } else {
              key = 'Upcoming';
            }
          }
          break;
        default:
          key = 'Other';
      }

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(task);
      return acc;
    }, {} as Record<string, Task[]>);

    Object.entries(grouped).forEach(([title, tasks]) => {
      groups.push({ title, tasks });
    });

    return groups;
  };

  const taskGroups = groupTasks(filteredTasks);

  if (filteredTasks.length === 0) {
    return (
      <Card variant="outline" className="items-center py-8">
        <Feather name="check-circle" size={48} color="#6b7280" />
        <Text className="text-gray-500 dark:text-gray-400 mt-4 text-center">
          {emptyMessage}
        </Text>
      </Card>
    );
  }

  return (
    <View>
      {taskGroups.map((group, groupIndex) => (
        <View key={groupIndex}>
          {group.title && (
            <View className="flex-row items-center mb-3 mt-6">
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {group.title}
              </Text>
              <View className="flex-1 h-px bg-gray-200 dark:bg-gray-700 ml-3" />
              <Text className="text-sm text-gray-500 dark:text-gray-400 ml-3">
                {group.tasks.length}
              </Text>
            </View>
          )}

          {group.tasks.map((task) => (
            <TaskItem
              key={String(task.id)}
              task={{
                ...task,
                id: String(task.id),
                isCompleted: typeof task.is_done === "boolean" ? task.is_done : !!task.is_done,
                createdAt: (task as any).createdAt ?? new Date(),
                priority: (["low", "medium", "high", "urgent"].includes(task.priority as string)
                  ? task.priority
                  : "low") as "low" | "medium" | "high" | "urgent"
              }}
              onToggleComplete={onToggleComplete}
              onPress={() => onTaskPress?.(task)}
              onEdit={() => onTaskEdit?.(task)}
              onDelete={() => onTaskDelete?.(task)}
            />
          ))}
        </View>
      ))}
    </View>
  );
}
