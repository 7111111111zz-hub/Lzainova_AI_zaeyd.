import React, { createContext, useCallback, useMemo, useRef, useState, ReactNode } from 'react';
import { createTaskRun, executeTask, TaskRun } from '@/services/agents/taskAgent';
import { libraryStore } from '@/services/libraryStore';

interface TasksContextValue {
  tasks: TaskRun[];
  activeTaskId: string | null;
  startTask: (goal: string) => Promise<TaskRun>;
  cancelTask: (id: string) => void;
  selectTask: (id: string | null) => void;
  clearCompleted: () => void;
}

export const TasksContext = createContext<TasksContextValue | undefined>(undefined);

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskRun[]>([]);
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const cancelFlags = useRef<Record<string, boolean>>({});

  const startTask = useCallback(async (goal: string) => {
    const run = createTaskRun(goal);
    setTasks((prev) => [run, ...prev]);
    setActiveTaskId(run.id);
    cancelFlags.current[run.id] = false;

    executeTask(run, {
      onUpdate: (u) => setTasks((prev) => prev.map((t) => (t.id === u.id ? u : t))),
      onComplete: (u) => {
        setTasks((prev) => prev.map((t) => (t.id === u.id ? u : t)));
        libraryStore
          .add({
            kind: 'task',
            title: u.goal.slice(0, 60),
            subtitle: u.result ?? 'مهمة مكتملة',
          })
          .catch(() => {});
      },
      isCancelled: () => cancelFlags.current[run.id] === true,
    });

    return run;
  }, []);

  const cancelTask = useCallback((id: string) => {
    cancelFlags.current[id] = true;
  }, []);

  const selectTask = useCallback((id: string | null) => {
    setActiveTaskId(id);
  }, []);

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((t) => t.status !== 'COMPLETED' && t.status !== 'CANCELLED'));
  }, []);

  const value = useMemo<TasksContextValue>(
    () => ({ tasks, activeTaskId, startTask, cancelTask, selectTask, clearCompleted }),
    [tasks, activeTaskId, startTask, cancelTask, selectTask, clearCompleted],
  );

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}
