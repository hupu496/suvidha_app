import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useAppTheme } from '@/context/ThemeContext';
import { useAppState } from '@/context/AppStateContext';
import { TaskPriority, TaskStatus } from '@/types';
import { FormField } from '@/components/common/FormField';
import { PrimaryButton, SecondaryButton } from '@/components/common/Buttons';
import { StatusBadge } from '@/components/common/StatusBadge';

export default function BusinessTasksPage() {
  const { colors } = useAppTheme();
  const { tasks, agents, addBusinessTask, changeTaskStatus } = useAppState();

  // Filter & Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // New Dispatch Form state
  const [taskCategory, setTaskCategory] = useState('Retail / Pharmacy Delivery');
  const [pickupOrigin, setPickupOrigin] = useState('42 Park Street Hub');
  const [destination, setDestination] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('Standard');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(
    agents.find((a) => a.availability === 'Available')?.id || ''
  );
  const [notes, setNotes] = useState('');
  const [formError, setFormError] = useState('');

  const filteredTasks = tasks.filter((t) => {
    const matchesStatus = statusFilter === 'ALL' || t.status === statusFilter;
    const matchesSearch =
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.taskCategory.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleCreateTask = async () => {
    setFormError('');
    if (!taskCategory.trim() || !pickupOrigin.trim() || !destination.trim()) {
      setFormError('Please specify task category, pickup origin, and destination.');
      return;
    }

    await addBusinessTask({
      taskCategory,
      pickupOrigin,
      destination,
      priority,
      assignedAgentId: selectedAgentId || undefined,
      notes,
    });
    setDestination('');
    setNotes('');
  };

  const nextStatusMap: Record<TaskStatus, TaskStatus> = {
    Queued: 'Assigned',
    Assigned: 'In Transit',
    'In Transit': 'Completed',
    Completed: 'Completed',
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.primaryText }]}>
        Dispatch Panel & Task Management
      </Text>

      <View style={styles.twoCol}>
        {/* Dispatch Panel */}
        <View
          style={[
            styles.dispatchCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <StatusBadge label="CREATE DEMO DISPATCH TASK" />
          <Text style={[styles.cardHeading, { color: colors.primaryText }]}>
            New Logistics / Field Request
          </Text>

          <FormField
            label="Task Category *"
            placeholder="e.g., Cold-Pouch Delivery, Inter-Branch Transfer"
            value={taskCategory}
            onChangeText={setTaskCategory}
          />
          <FormField
            label="Pickup / Origin *"
            placeholder="Origin Hub"
            value={pickupOrigin}
            onChangeText={setPickupOrigin}
          />
          <FormField
            label="Destination *"
            placeholder="Customer or branch destination address"
            value={destination}
            onChangeText={setDestination}
          />

          <Text style={[styles.fieldLabel, { color: colors.primaryText }]}>
            Priority Level
          </Text>
          <View style={styles.chipRow}>
            {(['Standard', 'High', 'Urgent'] as TaskPriority[]).map((p) => {
              const active = priority === p;
              return (
                <Pressable
                  key={p}
                  onPress={() => setPriority(p)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active
                        ? colors.primaryAccent
                        : colors.secondaryBackground,
                      borderColor: active ? colors.primaryAccent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.buttonTextOnAccent : colors.primaryText,
                      fontWeight: '700',
                      fontSize: 12,
                    }}
                  >
                    {p}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={[styles.fieldLabel, { color: colors.primaryText }]}>
            Assign Sample Agent
          </Text>
          <View style={styles.chipRow}>
            {agents.map((ag) => {
              const active = selectedAgentId === ag.id;
              return (
                <Pressable
                  key={ag.id}
                  onPress={() => setSelectedAgentId(ag.id)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active
                        ? colors.primaryAccent
                        : colors.secondaryBackground,
                      borderColor: active ? colors.primaryAccent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.buttonTextOnAccent : colors.primaryText,
                      fontSize: 12,
                      fontWeight: '600',
                    }}
                  >
                    {ag.name} ({ag.availability})
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <FormField
            label="Dispatch Notes"
            placeholder="Handling instructions"
            value={notes}
            onChangeText={setNotes}
            error={formError}
          />

          <PrimaryButton
            label="Dispatch Task to Queue"
            fullWidth
            onPress={handleCreateTask}
          />
        </View>

        {/* Task Queue Table */}
        <View
          style={[
            styles.tableCard,
            { backgroundColor: colors.cardBackground, borderColor: colors.border },
          ]}
        >
          <Text style={[styles.cardHeading, { color: colors.primaryText }]}>
            Task Queue ({filteredTasks.length})
          </Text>

          <FormField
            label="Search by Task ID, Type, or Destination"
            placeholder="e.g., TSK-9012 or Park Street"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <View style={styles.chipRow}>
            {['ALL', 'Queued', 'Assigned', 'In Transit', 'Completed'].map((st) => {
              const active = statusFilter === st;
              return (
                <Pressable
                  key={st}
                  onPress={() => setStatusFilter(st)}
                  style={[
                    styles.chip,
                    {
                      backgroundColor: active
                        ? colors.badgeBg
                        : colors.secondaryBackground,
                      borderColor: active ? colors.primaryAccent : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active ? colors.primaryAccent : colors.secondaryText,
                      fontSize: 12,
                      fontWeight: '700',
                    }}
                  >
                    {st}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {filteredTasks.map((task) => (
            <View
              key={task.id}
              style={[styles.taskItem, { borderColor: colors.border }]}
            >
              <View style={styles.rowBetween}>
                <Text style={[styles.taskTitle, { color: colors.primaryText }]}>
                  {task.id} • {task.taskCategory}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6 }}>
                  <StatusBadge
                    label={task.priority}
                    tone={task.priority === 'Urgent' ? 'danger' : 'accent'}
                  />
                  <StatusBadge label={task.status} tone="info" />
                </View>
              </View>
              <Text style={{ color: colors.secondaryText, fontSize: 13 }}>
                Origin: {task.pickupOrigin} → Destination: {task.destination}
              </Text>
              <Text style={{ color: colors.primaryAccent, fontSize: 12 }}>
                Assigned Agent: {task.assignedAgentName} • Created: {task.createdDate}
              </Text>
              {task.status !== 'Completed' ? (
                <View style={{ marginTop: 8, alignSelf: 'flex-start' }}>
                  <SecondaryButton
                    label={`Advance Status → ${nextStatusMap[task.status]}`}
                    onPress={() =>
                      changeTaskStatus(task.id, nextStatusMap[task.status])
                    }
                  />
                </View>
              ) : null}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
  },
  twoCol: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    alignItems: 'flex-start',
  },
  dispatchCard: {
    flex: 1,
    minWidth: 310,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    gap: 10,
  },
  tableCard: {
    flex: 1.4,
    minWidth: 340,
    borderRadius: 18,
    borderWidth: 1,
    padding: 22,
    gap: 12,
  },
  cardHeading: {
    fontSize: 19,
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
  },
  taskItem: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 16,
    gap: 6,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '700',
  },
});