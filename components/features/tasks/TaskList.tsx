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
  const filteredTasks = showCompleted ? tasks : tasks.filter(task => !task.isCompleted);

  const groupTasks = (tasks: Task[]) => {
    if (groupBy === 'none') {
      return [{ title: null, tasks }];
    }

    const groups: { title: string | null; tasks: Task[] }[] = [];
    const grouped = tasks.reduce((acc, task) => {
      let key: string;

      switch (groupBy) {
        case 'priority':
          key = task.priority;
          break;
        case 'category':
          key = task.category || 'Uncategorized';
          break;
        case 'dueDate':
          if (!task.dueDate) {
            key = 'No Due Date';
          } else {
            const today = new Date();
            const tomorrow = new Date(today);
            tomorrow.setDate(tomorrow.getDate() + 1);

            if (task.dueDate.toDateString() === today.toDateString()) {
              key = 'Today';
            } else if (task.dueDate.toDateString() === tomorrow.toDateString()) {
              key = 'Tomorrow';
            } else if (task.dueDate < today) {
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
              key={task.id}
              task={task}
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
