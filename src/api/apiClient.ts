// API client layer — currently uses mock data, structured for future Laravel API integration.
// Replace mock implementations with actual fetch calls to Laravel REST endpoints.

import {
  mockUser,
  mockClusters,
  mockWorkloads,
  mockActivityLogs,
  mockAlerts,
  mockEntitlements,
  mockRuntimeProfiles,
  mockSchedulingPolicies,
  mockChangeReviews,
  mockIncidents,
  mockNotifications,
  mockOperationalEvents,
  mockOptimizationOpportunities,
  mockQueues,
  utilization24h,
  workloadActivity,
  capacityDistribution,
  utilizationTrend7d,
  queueTimeTrend,
  memoryVsCompute,
  runtimeTrend,
  type User,
  type Cluster,
  type Workload,
  type ActivityLog,
  type Alert,
  type Entitlement,
  type RuntimeProfile,
  type SchedulingPolicy,
  type ChangeReview,
  type Incident,
  type Notification,
  type OperationalEvent,
  type OptimizationOpportunity,
  type QueueInfo,
} from '@/data/mockData';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// ===== Auth API =====
export async function loginUser(email: string, password: string): Promise<User> {
  await delay(800);
  if (!email || !password) throw new Error('Email and password are required');
  return { ...mockUser, email };
}

export async function registerUser(data: {
  name: string;
  email: string;
  company: string;
  role: string;
  password: string;
}): Promise<User> {
  await delay(1000);
  return {
    id: 'usr_' + Date.now(),
    name: data.name,
    email: data.email,
    role: data.role,
    company: data.company,
    createdAt: new Date().toISOString(),
  };
}

export async function logoutUser(): Promise<void> {
  await delay(300);
}

export async function getCurrentUser(): Promise<User> {
  await delay(200);
  return mockUser;
}

// ===== Capacity API =====
export async function getClusters(): Promise<Cluster[]> {
  await delay(400);
  return mockClusters;
}

export async function createCluster(data: Partial<Cluster>): Promise<Cluster> {
  await delay(600);
  return {
    id: 'cl_' + Date.now(),
    name: data.name || 'New Cluster',
    environment: data.environment || 'Development',
    location: data.location || 'us-east-1',
    gpuType: data.gpuType || 'NVIDIA A100',
    totalGpus: data.totalGpus || 0,
    allocatedGpus: 0,
    availableGpus: data.totalGpus || 0,
    reservedGpus: data.reservedGpus || 0,
    utilization: 0,
    owner: data.owner || 'Platform Team',
    status: 'Operational',
    driverVersion: data.driverVersion || '535.129.03',
    runtimeProfile: data.runtimeProfile || 'Training Standard',
    nodeCount: 8,
    lastUpdated: new Date().toISOString(),
  };
}

export async function updateCluster(id: string, data: Partial<Cluster>): Promise<Cluster> {
  await delay(400);
  const cluster = mockClusters.find((c) => c.id === id);
  if (!cluster) throw new Error('Cluster not found');
  return { ...cluster, ...data, lastUpdated: new Date().toISOString() };
}

export async function getClusterDetails(id: string): Promise<Cluster> {
  await delay(300);
  const cluster = mockClusters.find((c) => c.id === id);
  if (!cluster) throw new Error('Cluster not found');
  return cluster;
}

// ===== Workload API =====
export async function getWorkloads(): Promise<Workload[]> {
  await delay(400);
  return mockWorkloads;
}

export async function createWorkload(data: Partial<Workload>): Promise<Workload> {
  await delay(600);
  return {
    id: 'wl_' + Date.now(),
    name: data.name || 'New Workload',
    type: data.type || 'Training',
    owner: data.owner || 'ML Platform',
    project: data.project || 'Default',
    priority: data.priority || 'Medium',
    gpuRequest: data.gpuRequest || 8,
    gpuType: data.gpuType || 'NVIDIA H100',
    cpuRequest: data.cpuRequest || 32,
    memoryRequest: data.memoryRequest || 256,
    queue: data.queue || 'Standard',
    runtime: '00h 00m',
    runtimeProfile: data.runtimeProfile || 'Training Standard',
    status: 'Queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    expectedDuration: data.expectedDuration || '04h 00m',
    description: data.description || '',
  };
}

export async function updateWorkloadStatus(id: string, status: Workload['status']): Promise<Workload> {
  await delay(400);
  const workload = mockWorkloads.find((w) => w.id === id);
  if (!workload) throw new Error('Workload not found');
  return { ...workload, status, updatedAt: new Date().toISOString() };
}

export async function cancelWorkload(id: string): Promise<Workload> {
  await delay(400);
  return updateWorkloadStatus(id, 'Cancelled');
}

// ===== Optimization API =====
export async function getOptimizationInsights() {
  await delay(400);
  return {
    cards: {
      gpuUtilization: 76.4,
      idleCapacity: 8.7,
      memoryPressure: 'Medium',
      computePressure: 'High',
      queuePressure: 'Medium',
      fragmentedCapacity: 12.2,
    },
    utilizationTrend: utilizationTrend7d,
    queueTimeTrend,
    runtimeTrend,
    memoryVsCompute,
    capacityDistribution,
  };
}

export async function getCapacityScenarios(input: {
  additionalDemand: number;
  workloadIncrease: number;
  horizon: string;
  targetUtilization: number;
}) {
  await delay(800);
  const currentCapacity = 2624;
  const projectedDemand = currentCapacity * (1 + input.workloadIncrease / 100) + input.additionalDemand;
  const capacityGap = Math.max(0, projectedDemand - currentCapacity);
  const pressure = capacityGap > 200 ? 'High' : capacityGap > 50 ? 'Medium' : 'Low';
  return {
    projectedDemand: Math.round(projectedDemand),
    estimatedCapacityGap: Math.round(capacityGap),
    potentialAllocationPressure: pressure,
    scenarioStatus: capacityGap > 0 ? 'Capacity Gap Detected' : 'Within Capacity',
  };
}

export async function getOptimizationOpportunities(): Promise<OptimizationOpportunity[]> {
  await delay(300);
  return mockOptimizationOpportunities;
}

// ===== Policy API =====
export async function getPolicies(): Promise<SchedulingPolicy[]> {
  await delay(300);
  return mockSchedulingPolicies;
}

export async function getEntitlements(): Promise<Entitlement[]> {
  await delay(300);
  return mockEntitlements;
}

export async function getRuntimeProfiles(): Promise<RuntimeProfile[]> {
  await delay(300);
  return mockRuntimeProfiles;
}

export async function getChangeReviews(): Promise<ChangeReview[]> {
  await delay(300);
  return mockChangeReviews;
}

export async function submitChangeReview(data: Partial<ChangeReview>): Promise<ChangeReview> {
  await delay(500);
  return {
    id: 'cr_' + Date.now(),
    request: data.request || 'New Change Request',
    requestedBy: data.requestedBy || 'Platform Engineer',
    type: data.type || 'Policy Change',
    affectedResource: data.affectedResource || 'All Clusters',
    submitted: 'Just now',
    reviewer: data.reviewer || 'Administrator',
    status: 'Pending',
  };
}

export async function reviewChangeReview(
  id: string,
  status: ChangeReview['status'],
  comment?: string
): Promise<ChangeReview> {
  await delay(400);
  const review = mockChangeReviews.find((r) => r.id === id);
  if (!review) throw new Error('Change review not found');
  return { ...review, status, comment };
}

// ===== Operations API =====
export async function getOperationsStatus() {
  await delay(300);
  return {
    environmentStatus: 'Operational',
    lastUpdated: new Date().toISOString(),
    clustersOnline: 10,
    totalClusters: 12,
    healthyNodes: 268,
    totalNodes: 284,
    activeAlerts: 7,
    blockedWorkloads: 5,
    pendingApprovals: 3,
  };
}

export async function getAlerts(): Promise<Alert[]> {
  await delay(300);
  return mockAlerts;
}

export async function acknowledgeAlert(id: string): Promise<Alert> {
  await delay(300);
  const alert = mockAlerts.find((a) => a.id === id);
  if (!alert) throw new Error('Alert not found');
  return { ...alert, status: 'Acknowledged' };
}

export async function resolveAlert(id: string): Promise<Alert> {
  await delay(300);
  const alert = mockAlerts.find((a) => a.id === id);
  if (!alert) throw new Error('Alert not found');
  return { ...alert, status: 'Resolved' };
}

export async function getIncidents(): Promise<Incident[]> {
  await delay(300);
  return mockIncidents;
}

export async function assignIncidentOwner(id: string, owner: string): Promise<Incident> {
  await delay(300);
  const incident = mockIncidents.find((i) => i.id === id);
  if (!incident) throw new Error('Incident not found');
  return { ...incident, assignedOwner: owner };
}

export async function getQueues(): Promise<QueueInfo[]> {
  await delay(300);
  return mockQueues;
}

export async function getOperationalEvents(): Promise<OperationalEvent[]> {
  await delay(300);
  return mockOperationalEvents;
}

// ===== Activity API =====
export async function getActivityLogs(): Promise<ActivityLog[]> {
  await delay(400);
  return mockActivityLogs;
}

// ===== Notifications API =====
export async function getNotifications(): Promise<Notification[]> {
  await delay(200);
  return mockNotifications;
}

// ===== Overview API =====
export async function getOverviewData() {
  await delay(400);
  return {
    stats: {
      gpuCapacity: 2624,
      availableCapacity: 416,
      activeWorkloads: 146,
      queuedWorkloads: 38,
      averageUtilization: 76.4,
      activeAlerts: 7,
    },
    utilization24h,
    workloadActivity,
    capacityDistribution,
  };
}
