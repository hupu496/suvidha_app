import { BusinessTask, FieldAgent, TaskPriority, TaskStatus } from '@/types';
import { INITIAL_BUSINESS_TASKS, INITIAL_FIELD_AGENTS } from '@/mocks/business';

let tasksStore: BusinessTask[] = [...INITIAL_BUSINESS_TASKS];
let agentsStore: FieldAgent[] = [...INITIAL_FIELD_AGENTS];

export interface CreateBusinessTaskInput {
  businessId: string;
  taskCategory: string;
  pickupOrigin: string;
  destination: string;
  priority: TaskPriority;
  assignedAgentId?: string;
  notes?: string;
}

/**
 * Future Django REST endpoint: GET /api/v1/business/tasks/
 */
export async function getBusinessTasks(): Promise<BusinessTask[]> {
  return [...tasksStore];
}

/**
 * Future Django REST endpoint: GET /api/v1/business/fleet/agents/
 */
export async function getFleetAgents(): Promise<FieldAgent[]> {
  return [...agentsStore];
}

/**
 * Future Django REST endpoint: POST /api/v1/business/tasks/
 */
export async function createBusinessTask(
  input: CreateBusinessTaskInput
): Promise<BusinessTask> {
  const agent = agentsStore.find((a) => a.id === input.assignedAgentId);
  const newTaskId = `TSK-${Math.floor(9020 + Math.random() * 800)}`;

  const newTask: BusinessTask = {
    id: newTaskId,
    businessId: input.businessId,
    taskCategory: input.taskCategory.trim(),
    pickupOrigin: input.pickupOrigin.trim(),
    destination: input.destination.trim(),
    assignedAgentId: agent?.id,
    assignedAgentName: agent ? `${agent.name} (${agent.agentCode})` : 'Unassigned Queue',
    priority: input.priority,
    status: agent ? 'Assigned' : 'Queued',
    notes: input.notes?.trim() || undefined,
    createdDate: new Date().toISOString().slice(0, 16).replace('T', ' '),
  };

  if (agent) {
    agentsStore = agentsStore.map((a) =>
      a.id === agent.id ? { ...a, availability: 'On Active Task', currentTaskId: newTaskId } : a
    );
  }

  tasksStore = [newTask, ...tasksStore];
  return newTask;
}

/**
 * Future Django REST endpoint: PATCH /api/v1/business/tasks/:id/
 */
export async function updateTaskStatus(
  taskId: string,
  status: TaskStatus,
  assignedAgentId?: string
): Promise<BusinessTask | null> {
  let updatedTask: BusinessTask | null = null;

  tasksStore = tasksStore.map((t) => {
    if (t.id !== taskId) return t;
    const agent = assignedAgentId
      ? agentsStore.find((a) => a.id === assignedAgentId)
      : undefined;

    updatedTask = {
      ...t,
      status,
      assignedAgentId: agent ? agent.id : t.assignedAgentId,
      assignedAgentName: agent ? `${agent.name} (${agent.agentCode})` : t.assignedAgentName,
    };
    return updatedTask;
  });

  if (status === 'Completed' && updatedTask) {
    const completedId = (updatedTask as BusinessTask).id;
    agentsStore = agentsStore.map((a) =>
      a.currentTaskId === completedId
        ? { ...a, availability: 'Available', currentTaskId: undefined }
        : a
    );
  }

  return updatedTask;
}