// Mock data for the ComputeAxis GPU Compute Orchestration dashboard.
// Structured to mirror future Laravel/SQL entities with IDs and relationships.

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  avatar?: string;
  createdAt: string;
}

export const mockUser: User = {
  id: 'usr_001',
  name: 'Alex Morgan',
  email: 'alex.morgan@computeaxis.net',
  role: 'Infrastructure Operator',
  company: 'ComputeAxis',
  createdAt: '2024-03-15T10:00:00Z',
};

export interface Cluster {
  id: string;
  name: string;
  environment: string;
  location: string;
  gpuType: string;
  totalGpus: number;
  allocatedGpus: number;
  availableGpus: number;
  reservedGpus: number;
  utilization: number;
  owner: string;
  status: 'Operational' | 'Warning' | 'Maintenance' | 'Decommissioned';
  driverVersion: string;
  runtimeProfile: string;
  nodeCount: number;
  lastUpdated: string;
}

export const mockClusters: Cluster[] = [
  {
    id: 'cl_001',
    name: 'Cluster Alpha',
    environment: 'Production',
    location: 'us-east-1',
    gpuType: 'NVIDIA H100',
    totalGpus: 256,
    allocatedGpus: 208,
    availableGpus: 48,
    reservedGpus: 24,
    utilization: 81,
    owner: 'ML Platform',
    status: 'Operational',
    driverVersion: '535.129.03',
    runtimeProfile: 'Training Standard',
    nodeCount: 32,
    lastUpdated: '2026-09-16T08:30:00Z',
  },
  {
    id: 'cl_002',
    name: 'Cluster Beta',
    environment: 'Research',
    location: 'us-west-2',
    gpuType: 'NVIDIA A100',
    totalGpus: 512,
    allocatedGpus: 421,
    availableGpus: 91,
    reservedGpus: 48,
    utilization: 82,
    owner: 'Research Computing',
    status: 'Operational',
    driverVersion: '535.104.05',
    runtimeProfile: 'Research Experimental',
    nodeCount: 64,
    lastUpdated: '2026-09-16T07:45:00Z',
  },
  {
    id: 'cl_003',
    name: 'Cluster Gamma',
    environment: 'Inference',
    location: 'eu-central-1',
    gpuType: 'NVIDIA L40S',
    totalGpus: 128,
    allocatedGpus: 77,
    availableGpus: 51,
    reservedGpus: 16,
    utilization: 60,
    owner: 'MLOps',
    status: 'Warning',
    driverVersion: '535.98.00',
    runtimeProfile: 'Inference Optimized',
    nodeCount: 16,
    lastUpdated: '2026-09-16T06:20:00Z',
  },
  {
    id: 'cl_004',
    name: 'Cluster Delta',
    environment: 'Development',
    location: 'us-east-1',
    gpuType: 'NVIDIA A10',
    totalGpus: 96,
    allocatedGpus: 42,
    availableGpus: 54,
    reservedGpus: 12,
    utilization: 44,
    owner: 'Platform Team',
    status: 'Operational',
    driverVersion: '535.90.06',
    runtimeProfile: 'Training Standard',
    nodeCount: 12,
    lastUpdated: '2026-09-16T05:10:00Z',
  },
  {
    id: 'cl_005',
    name: 'Cluster Epsilon',
    environment: 'Production',
    location: 'us-west-2',
    gpuType: 'NVIDIA H100',
    totalGpus: 384,
    allocatedGpus: 310,
    availableGpus: 74,
    reservedGpus: 36,
    utilization: 81,
    owner: 'ML Platform',
    status: 'Operational',
    driverVersion: '535.129.03',
    runtimeProfile: 'Training Standard',
    nodeCount: 48,
    lastUpdated: '2026-09-16T08:00:00Z',
  },
  {
    id: 'cl_006',
    name: 'Cluster Zeta',
    environment: 'Research',
    location: 'ap-southeast-1',
    gpuType: 'NVIDIA A100',
    totalGpus: 256,
    allocatedGpus: 198,
    availableGpus: 58,
    reservedGpus: 28,
    utilization: 77,
    owner: 'Research Computing',
    status: 'Operational',
    driverVersion: '535.104.05',
    runtimeProfile: 'Research Experimental',
    nodeCount: 32,
    lastUpdated: '2026-09-16T04:30:00Z',
  },
  {
    id: 'cl_007',
    name: 'Cluster Eta',
    environment: 'Inference',
    location: 'us-east-1',
    gpuType: 'NVIDIA L40S',
    totalGpus: 64,
    allocatedGpus: 0,
    availableGpus: 0,
    reservedGpus: 0,
    utilization: 0,
    owner: 'MLOps',
    status: 'Maintenance',
    driverVersion: '535.98.00',
    runtimeProfile: 'Inference Optimized',
    nodeCount: 8,
    lastUpdated: '2026-09-15T22:00:00Z',
  },
  {
    id: 'cl_008',
    name: 'Cluster Theta',
    environment: 'Production',
    location: 'eu-west-1',
    gpuType: 'NVIDIA H100',
    totalGpus: 192,
    allocatedGpus: 160,
    availableGpus: 32,
    reservedGpus: 20,
    utilization: 83,
    owner: 'ML Platform',
    status: 'Operational',
    driverVersion: '535.129.03',
    runtimeProfile: 'Training Standard',
    nodeCount: 24,
    lastUpdated: '2026-09-16T07:00:00Z',
  },
  {
    id: 'cl_009',
    name: 'Cluster Iota',
    environment: 'Development',
    location: 'us-west-2',
    gpuType: 'NVIDIA A10',
    totalGpus: 48,
    allocatedGpus: 20,
    availableGpus: 28,
    reservedGpus: 4,
    utilization: 42,
    owner: 'Platform Team',
    status: 'Operational',
    driverVersion: '535.90.06',
    runtimeProfile: 'Training Standard',
    nodeCount: 6,
    lastUpdated: '2026-09-16T03:15:00Z',
  },
  {
    id: 'cl_010',
    name: 'Cluster Kappa',
    environment: 'Research',
    location: 'us-east-1',
    gpuType: 'NVIDIA V100',
    totalGpus: 128,
    allocatedGpus: 88,
    availableGpus: 40,
    reservedGpus: 12,
    utilization: 69,
    owner: 'Research Computing',
    status: 'Warning',
    driverVersion: '535.86.10',
    runtimeProfile: 'Research Experimental',
    nodeCount: 16,
    lastUpdated: '2026-09-16T01:45:00Z',
  },
  {
    id: 'cl_011',
    name: 'Cluster Lambda',
    environment: 'Inference',
    location: 'ap-southeast-1',
    gpuType: 'NVIDIA L40S',
    totalGpus: 96,
    allocatedGpus: 72,
    availableGpus: 24,
    reservedGpus: 8,
    utilization: 75,
    owner: 'MLOps',
    status: 'Operational',
    driverVersion: '535.98.00',
    runtimeProfile: 'Inference Optimized',
    nodeCount: 12,
    lastUpdated: '2026-09-16T06:50:00Z',
  },
  {
    id: 'cl_012',
    name: 'Cluster Mu',
    environment: 'Production',
    location: 'us-west-2',
    gpuType: 'NVIDIA H100',
    totalGpus: 64,
    allocatedGpus: 0,
    availableGpus: 0,
    reservedGpus: 0,
    utilization: 0,
    owner: 'ML Platform',
    status: 'Decommissioned',
    driverVersion: '535.129.03',
    runtimeProfile: 'Training Standard',
    nodeCount: 8,
    lastUpdated: '2026-09-10T14:00:00Z',
  },
];

export interface Workload {
  id: string;
  name: string;
  type: 'Training' | 'Inference' | 'Batch' | 'Research' | 'Simulation';
  owner: string;
  project: string;
  priority: 'Critical' | 'High' | 'Medium' | 'Low';
  gpuRequest: number;
  gpuType: string;
  cpuRequest: number;
  memoryRequest: number;
  queue: 'Priority' | 'Standard';
  runtime: string;
  runtimeProfile: string;
  status: 'Running' | 'Queued' | 'Paused' | 'Completed' | 'Failed' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
  expectedDuration: string;
  description: string;
}

export const mockWorkloads: Workload[] = [
  {
    id: 'wl_001',
    name: 'Model Training A',
    type: 'Training',
    owner: 'ML Platform',
    project: 'Vision Project',
    priority: 'High',
    gpuRequest: 32,
    gpuType: 'NVIDIA H100',
    cpuRequest: 128,
    memoryRequest: 1024,
    queue: 'Priority',
    runtime: '04h 18m',
    runtimeProfile: 'Training Standard',
    status: 'Running',
    createdAt: '2026-09-16T04:24:00Z',
    updatedAt: '2026-09-16T08:42:00Z',
    expectedDuration: '08h 00m',
    description: 'Large-scale vision model training with mixed precision.',
  },
  {
    id: 'wl_002',
    name: 'Inference Pipeline B',
    type: 'Inference',
    owner: 'Research Team',
    project: 'NLP Project',
    priority: 'Medium',
    gpuRequest: 8,
    gpuType: 'NVIDIA L40S',
    cpuRequest: 32,
    memoryRequest: 256,
    queue: 'Standard',
    runtime: '00h 00m',
    runtimeProfile: 'Inference Optimized',
    status: 'Queued',
    createdAt: '2026-09-16T08:00:00Z',
    updatedAt: '2026-09-16T08:00:00Z',
    expectedDuration: '02h 30m',
    description: 'Real-time NLP inference pipeline for research workloads.',
  },
  {
    id: 'wl_003',
    name: 'Batch Embedding C',
    type: 'Batch',
    owner: 'Data Science',
    project: 'Knowledge Project',
    priority: 'Low',
    gpuRequest: 16,
    gpuType: 'NVIDIA A100',
    cpuRequest: 64,
    memoryRequest: 512,
    queue: 'Standard',
    runtime: '01h 42m',
    runtimeProfile: 'Training Standard',
    status: 'Paused',
    createdAt: '2026-09-16T06:30:00Z',
    updatedAt: '2026-09-16T08:12:00Z',
    expectedDuration: '04h 00m',
    description: 'Batch embedding generation for knowledge base expansion.',
  },
  {
    id: 'wl_004',
    name: 'Simulation Job D',
    type: 'Simulation',
    owner: 'Research Computing',
    project: 'Simulation',
    priority: 'High',
    gpuRequest: 64,
    gpuType: 'NVIDIA A100',
    cpuRequest: 256,
    memoryRequest: 2048,
    queue: 'Priority',
    runtime: '00h 12m',
    runtimeProfile: 'Research Experimental',
    status: 'Failed',
    createdAt: '2026-09-16T07:50:00Z',
    updatedAt: '2026-09-16T08:02:00Z',
    expectedDuration: '12h 00m',
    description: 'High-fidelity physics simulation requiring multi-GPU allocation.',
  },
  {
    id: 'wl_005',
    name: 'Training Run E',
    type: 'Training',
    owner: 'ML Platform',
    project: 'Vision Project',
    priority: 'Critical',
    gpuRequest: 64,
    gpuType: 'NVIDIA H100',
    cpuRequest: 256,
    memoryRequest: 2048,
    queue: 'Priority',
    runtime: '06h 30m',
    runtimeProfile: 'Training Standard',
    status: 'Running',
    createdAt: '2026-09-16T02:12:00Z',
    updatedAt: '2026-09-16T08:42:00Z',
    expectedDuration: '10h 00m',
    description: 'Critical production model training with checkpointing.',
  },
  {
    id: 'wl_006',
    name: 'Inference Service F',
    type: 'Inference',
    owner: 'MLOps',
    project: 'Production API',
    priority: 'High',
    gpuRequest: 16,
    gpuType: 'NVIDIA L40S',
    cpuRequest: 64,
    memoryRequest: 512,
    queue: 'Priority',
    runtime: '12h 05m',
    runtimeProfile: 'Inference Optimized',
    status: 'Running',
    createdAt: '2026-09-15T20:37:00Z',
    updatedAt: '2026-09-16T08:42:00Z',
    expectedDuration: '24h 00m',
    description: 'Production inference service for real-time API endpoints.',
  },
  {
    id: 'wl_007',
    name: 'Batch Processing G',
    type: 'Batch',
    owner: 'Data Science',
    project: 'Analytics',
    priority: 'Medium',
    gpuRequest: 8,
    gpuType: 'NVIDIA A100',
    cpuRequest: 32,
    memoryRequest: 256,
    queue: 'Standard',
    runtime: '00h 00m',
    runtimeProfile: 'Training Standard',
    status: 'Queued',
    createdAt: '2026-09-16T07:15:00Z',
    updatedAt: '2026-09-16T07:15:00Z',
    expectedDuration: '03h 00m',
    description: 'Batch data processing for analytics pipeline.',
  },
  {
    id: 'wl_008',
    name: 'Research Experiment H',
    type: 'Research',
    owner: 'Research Computing',
    project: 'NLP Research',
    priority: 'Medium',
    gpuRequest: 24,
    gpuType: 'NVIDIA A100',
    cpuRequest: 96,
    memoryRequest: 768,
    queue: 'Standard',
    runtime: '03h 22m',
    runtimeProfile: 'Research Experimental',
    status: 'Running',
    createdAt: '2026-09-16T05:20:00Z',
    updatedAt: '2026-09-16T08:42:00Z',
    expectedDuration: '06h 00m',
    description: 'Experimental NLP research with custom training loop.',
  },
  {
    id: 'wl_009',
    name: 'Training Run I',
    type: 'Training',
    owner: 'ML Platform',
    project: 'Speech Project',
    priority: 'High',
    gpuRequest: 48,
    gpuType: 'NVIDIA H100',
    cpuRequest: 192,
    memoryRequest: 1536,
    queue: 'Priority',
    runtime: '02h 45m',
    runtimeProfile: 'Training Standard',
    status: 'Running',
    createdAt: '2026-09-16T05:57:00Z',
    updatedAt: '2026-09-16T08:42:00Z',
    expectedDuration: '08h 00m',
    description: 'Speech recognition model training with data augmentation.',
  },
  {
    id: 'wl_010',
    name: 'Batch Inference J',
    type: 'Batch',
    owner: 'Data Science',
    project: 'Knowledge Project',
    priority: 'Low',
    gpuRequest: 4,
    gpuType: 'NVIDIA A10',
    cpuRequest: 16,
    memoryRequest: 128,
    queue: 'Standard',
    runtime: '00h 48m',
    runtimeProfile: 'Training Standard',
    status: 'Completed',
    createdAt: '2026-09-16T07:00:00Z',
    updatedAt: '2026-09-16T07:48:00Z',
    expectedDuration: '01h 00m',
    description: 'Batch inference for knowledge base enrichment.',
  },
  {
    id: 'wl_011',
    name: 'Simulation K',
    type: 'Simulation',
    owner: 'Research Computing',
    project: 'Climate Model',
    priority: 'Medium',
    gpuRequest: 32,
    gpuType: 'NVIDIA A100',
    cpuRequest: 128,
    memoryRequest: 1024,
    queue: 'Standard',
    runtime: '00h 00m',
    runtimeProfile: 'Research Experimental',
    status: 'Queued',
    createdAt: '2026-09-16T08:10:00Z',
    updatedAt: '2026-09-16T08:10:00Z',
    expectedDuration: '16h 00m',
    description: 'Climate modeling simulation with high-resolution grid.',
  },
  {
    id: 'wl_012',
    name: 'Training Run L',
    type: 'Training',
    owner: 'ML Platform',
    project: 'Vision Project',
    priority: 'Critical',
    gpuRequest: 128,
    gpuType: 'NVIDIA H100',
    cpuRequest: 512,
    memoryRequest: 4096,
    queue: 'Priority',
    runtime: '00h 05m',
    runtimeProfile: 'Training Standard',
    status: 'Failed',
    createdAt: '2026-09-16T08:37:00Z',
    updatedAt: '2026-09-16T08:42:00Z',
    expectedDuration: '24h 00m',
    description: 'Large-scale distributed training with multi-node setup.',
  },
  {
    id: 'wl_013',
    name: 'Inference M',
    type: 'Inference',
    owner: 'MLOps',
    project: 'Production API',
    priority: 'Medium',
    gpuRequest: 8,
    gpuType: 'NVIDIA L40S',
    cpuRequest: 32,
    memoryRequest: 256,
    queue: 'Standard',
    runtime: '00h 00m',
    runtimeProfile: 'Inference Optimized',
    status: 'Cancelled',
    createdAt: '2026-09-16T03:00:00Z',
    updatedAt: '2026-09-16T06:00:00Z',
    expectedDuration: '04h 00m',
    description: 'Inference service cancelled due to resource reallocation.',
  },
  {
    id: 'wl_014',
    name: 'Batch Processing N',
    type: 'Batch',
    owner: 'Data Science',
    project: 'Analytics',
    priority: 'Low',
    gpuRequest: 4,
    gpuType: 'NVIDIA A10',
    cpuRequest: 16,
    memoryRequest: 128,
    queue: 'Standard',
    runtime: '01h 15m',
    runtimeProfile: 'Training Standard',
    status: 'Completed',
    createdAt: '2026-09-16T06:45:00Z',
    updatedAt: '2026-09-16T08:00:00Z',
    expectedDuration: '02h 00m',
    description: 'Batch processing for daily analytics report.',
  },
  {
    id: 'wl_015',
    name: 'Research O',
    type: 'Research',
    owner: 'Research Computing',
    project: 'Genomics',
    priority: 'Medium',
    gpuRequest: 16,
    gpuType: 'NVIDIA V100',
    cpuRequest: 64,
    memoryRequest: 512,
    queue: 'Standard',
    runtime: '00h 00m',
    runtimeProfile: 'Research Experimental',
    status: 'Queued',
    createdAt: '2026-09-16T08:20:00Z',
    updatedAt: '2026-09-16T08:20:00Z',
    expectedDuration: '08h 00m',
    description: 'Genomics research with GPU-accelerated sequence analysis.',
  },
];

export interface OperationalEvent {
  id: string;
  event: string;
  cluster: string;
  severity: 'Operational' | 'Warning' | 'Critical' | 'Pending' | 'Resolved';
  owner: string;
  time: string;
  status: string;
}

export const mockOperationalEvents: OperationalEvent[] = [
  {
    id: 'ev_001',
    event: 'Capacity threshold reached',
    cluster: 'Cluster Alpha',
    severity: 'Warning',
    owner: 'Alex Morgan',
    time: '08:42',
    status: 'Active',
  },
  {
    id: 'ev_002',
    event: 'Workload allocation updated',
    cluster: 'Cluster Beta',
    severity: 'Operational',
    owner: 'Jordan Lee',
    time: '08:35',
    status: 'Completed',
  },
  {
    id: 'ev_003',
    event: 'Runtime profile change requested',
    cluster: 'Cluster Gamma',
    severity: 'Pending',
    owner: 'Sam Patel',
    time: '08:17',
    status: 'Pending Review',
  },
  {
    id: 'ev_004',
    event: 'Cluster maintenance scheduled',
    cluster: 'Cluster Eta',
    severity: 'Operational',
    owner: 'Taylor Quinn',
    time: '07:50',
    status: 'Scheduled',
  },
  {
    id: 'ev_005',
    event: 'Queue priority adjusted',
    cluster: 'Cluster Theta',
    severity: 'Resolved',
    owner: 'Alex Morgan',
    time: '07:22',
    status: 'Resolved',
  },
  {
    id: 'ev_006',
    event: 'Node health degraded',
    cluster: 'Cluster Kappa',
    severity: 'Critical',
    owner: 'Jordan Lee',
    time: '06:45',
    status: 'Investigating',
  },
];

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  resourceType: string;
  resourceName: string;
  previousState: string;
  newState: string;
  timestamp: string;
  status: string;
}

export const mockActivityLogs: ActivityLog[] = [
  {
    id: 'al_001',
    user: 'Alex Morgan',
    action: 'Updated allocation',
    resourceType: 'Workload',
    resourceName: 'Model Training A',
    previousState: '16 GPUs',
    newState: '32 GPUs',
    timestamp: '2026-09-16T08:42:00Z',
    status: 'Completed',
  },
  {
    id: 'al_002',
    user: 'Jordan Lee',
    action: 'Changed quota',
    resourceType: 'Policy',
    resourceName: 'ML Platform',
    previousState: '128 GPUs',
    newState: '256 GPUs',
    timestamp: '2026-09-16T08:35:00Z',
    status: 'Approved',
  },
  {
    id: 'al_003',
    user: 'Sam Patel',
    action: 'Updated cluster status',
    resourceType: 'Cluster',
    resourceName: 'Cluster Gamma',
    previousState: 'Operational',
    newState: 'Warning',
    timestamp: '2026-09-16T08:17:00Z',
    status: 'Recorded',
  },
  {
    id: 'al_004',
    user: 'Taylor Quinn',
    action: 'Scheduled maintenance',
    resourceType: 'Cluster',
    resourceName: 'Cluster Eta',
    previousState: 'Operational',
    newState: 'Maintenance',
    timestamp: '2026-09-16T07:50:00Z',
    status: 'Scheduled',
  },
  {
    id: 'al_005',
    user: 'Alex Morgan',
    action: 'Adjusted queue priority',
    resourceType: 'Queue',
    resourceName: 'Priority Queue',
    previousState: 'Medium',
    newState: 'High',
    timestamp: '2026-09-16T07:22:00Z',
    status: 'Completed',
  },
  {
    id: 'al_006',
    user: 'Jordan Lee',
    action: 'Submitted workload',
    resourceType: 'Workload',
    resourceName: 'Simulation Job D',
    previousState: '—',
    newState: 'Queued',
    timestamp: '2026-09-16T07:50:00Z',
    status: 'Created',
  },
  {
    id: 'al_007',
    user: 'Sam Patel',
    action: 'Approved change review',
    resourceType: 'Change Review',
    resourceName: 'Runtime profile update',
    previousState: 'Pending',
    newState: 'Approved',
    timestamp: '2026-09-16T06:30:00Z',
    status: 'Approved',
  },
  {
    id: 'al_008',
    user: 'Taylor Quinn',
    action: 'Assigned incident owner',
    resourceType: 'Incident',
    resourceName: 'Node health degraded',
    previousState: 'Unassigned',
    newState: 'Jordan Lee',
    timestamp: '2026-09-16T06:45:00Z',
    status: 'Assigned',
  },
  {
    id: 'al_009',
    user: 'Alex Morgan',
    action: 'Cancelled workload',
    resourceType: 'Workload',
    resourceName: 'Inference M',
    previousState: 'Running',
    newState: 'Cancelled',
    timestamp: '2026-09-16T06:00:00Z',
    status: 'Completed',
  },
  {
    id: 'al_010',
    user: 'Jordan Lee',
    action: 'Updated runtime profile',
    resourceType: 'Runtime Profile',
    resourceName: 'Inference Optimized',
    previousState: 'CUDA 11.x',
    newState: 'CUDA 12.x',
    timestamp: '2026-09-16T05:15:00Z',
    status: 'Completed',
  },
];

export interface Alert {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info' | 'Pending';
  title: string;
  description: string;
  affectedResource: string;
  owner: string;
  timestamp: string;
  status: 'Active' | 'Acknowledged' | 'Resolved';
}

export const mockAlerts: Alert[] = [
  {
    id: 'al_001',
    severity: 'Warning',
    title: 'Cluster Gamma capacity warning',
    description: 'Available capacity below 20% threshold. Allocation pressure increasing.',
    affectedResource: 'Cluster Gamma',
    owner: 'Sam Patel',
    timestamp: '2026-09-16T08:42:00Z',
    status: 'Active',
  },
  {
    id: 'al_002',
    severity: 'Critical',
    title: 'Workload blocked by quota policy',
    description: 'Training Run L exceeded team quota. Allocation blocked pending review.',
    affectedResource: 'Training Run L',
    owner: 'Alex Morgan',
    timestamp: '2026-09-16T08:37:00Z',
    status: 'Active',
  },
  {
    id: 'al_003',
    severity: 'Pending',
    title: 'Runtime profile approval required',
    description: 'Inference Optimized profile requires review before deployment.',
    affectedResource: 'Inference Optimized',
    owner: 'Jordan Lee',
    timestamp: '2026-09-16T08:17:00Z',
    status: 'Active',
  },
  {
    id: 'al_004',
    severity: 'Warning',
    title: 'Node maintenance pending',
    description: 'Cluster Eta has 8 nodes scheduled for maintenance. No new allocations allowed.',
    affectedResource: 'Cluster Eta',
    owner: 'Taylor Quinn',
    timestamp: '2026-09-16T07:50:00Z',
    status: 'Acknowledged',
  },
  {
    id: 'al_005',
    severity: 'Warning',
    title: 'Queue waiting time elevated',
    description: 'Research Queue average wait time exceeds 30 minutes.',
    affectedResource: 'Research Queue',
    owner: 'Sam Patel',
    timestamp: '2026-09-16T07:30:00Z',
    status: 'Active',
  },
  {
    id: 'al_006',
    severity: 'Critical',
    title: 'Node health degraded',
    description: 'Cluster Kappa reports degraded node health. Investigating hardware issue.',
    affectedResource: 'Cluster Kappa',
    owner: 'Jordan Lee',
    timestamp: '2026-09-16T06:45:00Z',
    status: 'Acknowledged',
  },
  {
    id: 'al_007',
    severity: 'Info',
    title: 'Workload completed successfully',
    description: 'Batch Inference J completed within expected duration.',
    affectedResource: 'Batch Inference J',
    owner: 'Data Science',
    timestamp: '2026-09-16T07:48:00Z',
    status: 'Resolved',
  },
];

export interface Entitlement {
  id: string;
  team: string;
  project: string;
  gpuQuota: number;
  used: number;
  remaining: number;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Active' | 'Restricted' | 'Suspended';
}

export const mockEntitlements: Entitlement[] = [
  {
    id: 'en_001',
    team: 'ML Platform',
    project: 'Vision Project',
    gpuQuota: 256,
    used: 208,
    remaining: 48,
    priority: 'High',
    status: 'Active',
  },
  {
    id: 'en_002',
    team: 'Research Team',
    project: 'NLP Research',
    gpuQuota: 128,
    used: 77,
    remaining: 51,
    priority: 'Medium',
    status: 'Active',
  },
  {
    id: 'en_003',
    team: 'Data Science',
    project: 'Embedding Project',
    gpuQuota: 96,
    used: 42,
    remaining: 54,
    priority: 'Medium',
    status: 'Active',
  },
  {
    id: 'en_004',
    team: 'MLOps',
    project: 'Production API',
    gpuQuota: 64,
    used: 48,
    remaining: 16,
    priority: 'High',
    status: 'Active',
  },
  {
    id: 'en_005',
    team: 'Research Computing',
    project: 'Simulation',
    gpuQuota: 192,
    used: 120,
    remaining: 72,
    priority: 'Medium',
    status: 'Active',
  },
  {
    id: 'en_006',
    team: 'Platform Team',
    project: 'Infrastructure',
    gpuQuota: 48,
    used: 20,
    remaining: 28,
    priority: 'Low',
    status: 'Restricted',
  },
];

export interface RuntimeProfile {
  id: string;
  name: string;
  framework: string;
  cudaVersion: string;
  container: string;
  approvedFor: string;
  status: 'Approved' | 'Review Required' | 'Restricted';
}

export const mockRuntimeProfiles: RuntimeProfile[] = [
  {
    id: 'rp_001',
    name: 'Training Standard',
    framework: 'PyTorch',
    cudaVersion: 'CUDA 12.x',
    container: 'Approved Runtime',
    approvedFor: 'ML Platform',
    status: 'Approved',
  },
  {
    id: 'rp_002',
    name: 'Inference Optimized',
    framework: 'Triton-compatible',
    cudaVersion: 'CUDA 12.x',
    container: 'Inference Runtime',
    approvedFor: 'MLOps',
    status: 'Review Required',
  },
  {
    id: 'rp_003',
    name: 'Research Experimental',
    framework: 'Custom',
    cudaVersion: 'Variable',
    container: 'Research Runtime',
    approvedFor: 'Research Team',
    status: 'Restricted',
  },
  {
    id: 'rp_004',
    name: 'Batch Processing',
    framework: 'TensorFlow',
    cudaVersion: 'CUDA 11.x',
    container: 'Batch Runtime',
    approvedFor: 'Data Science',
    status: 'Approved',
  },
  {
    id: 'rp_005',
    name: 'Simulation Standard',
    framework: 'Custom CUDA',
    cudaVersion: 'CUDA 12.x',
    container: 'Simulation Runtime',
    approvedFor: 'Research Computing',
    status: 'Approved',
  },
];

export interface SchedulingPolicy {
  id: string;
  name: string;
  description: string;
  scope: string;
  status: 'Active' | 'Draft' | 'Disabled';
  lastUpdated: string;
}

export const mockSchedulingPolicies: SchedulingPolicy[] = [
  {
    id: 'sp_001',
    name: 'Production Priority',
    description: 'High-priority production workloads receive controlled queue preference.',
    scope: 'Production Clusters',
    status: 'Active',
    lastUpdated: '2026-09-14T10:00:00Z',
  },
  {
    id: 'sp_002',
    name: 'Research Quota',
    description: 'Research workloads operate within assigned resource entitlements.',
    scope: 'Research Clusters',
    status: 'Active',
    lastUpdated: '2026-09-12T14:30:00Z',
  },
  {
    id: 'sp_003',
    name: 'GPU Reservation',
    description: 'Reserved capacity requires approved allocation context.',
    scope: 'All Clusters',
    status: 'Active',
    lastUpdated: '2026-09-10T09:15:00Z',
  },
  {
    id: 'sp_004',
    name: 'Maintenance Protection',
    description: 'Nodes in maintenance state cannot receive new workload assignments.',
    scope: 'All Clusters',
    status: 'Active',
    lastUpdated: '2026-09-08T16:45:00Z',
  },
];

export interface ChangeReview {
  id: string;
  request: string;
  requestedBy: string;
  type: string;
  affectedResource: string;
  submitted: string;
  reviewer: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Needs Review';
  comment?: string;
}

export const mockChangeReviews: ChangeReview[] = [
  {
    id: 'cr_001',
    request: 'Increase GPU quota',
    requestedBy: 'Platform Engineer',
    type: 'Quota Change',
    affectedResource: 'ML Platform',
    submitted: 'Today 09:42',
    reviewer: 'Administrator',
    status: 'Pending',
  },
  {
    id: 'cr_002',
    request: 'Change runtime profile',
    requestedBy: 'MLOps Engineer',
    type: 'Runtime Change',
    affectedResource: 'Inference Cluster',
    submitted: 'Yesterday',
    reviewer: 'Platform Lead',
    status: 'Approved',
  },
  {
    id: 'cr_003',
    request: 'Schedule cluster maintenance',
    requestedBy: 'Infrastructure Operator',
    type: 'Maintenance',
    affectedResource: 'Cluster Eta',
    submitted: 'Yesterday',
    reviewer: 'Platform Lead',
    status: 'Approved',
  },
  {
    id: 'cr_004',
    request: 'Update scheduling policy',
    requestedBy: 'Platform Engineer',
    type: 'Policy Change',
    affectedResource: 'Research Clusters',
    submitted: '2 days ago',
    reviewer: 'Administrator',
    status: 'Needs Review',
  },
  {
    id: 'cr_005',
    request: 'Decommission Cluster Mu',
    requestedBy: 'Infrastructure Operator',
    type: 'Decommission',
    affectedResource: 'Cluster Mu',
    submitted: '3 days ago',
    reviewer: 'Administrator',
    status: 'Rejected',
  },
];

export interface Incident {
  id: string;
  incident: string;
  severity: 'Critical' | 'Warning' | 'Info';
  assignedOwner: string;
  opened: string;
  status: 'Open' | 'Investigating' | 'Resolved';
}

export const mockIncidents: Incident[] = [
  {
    id: 'in_001',
    incident: 'Node health degraded',
    severity: 'Critical',
    assignedOwner: 'Jordan Lee',
    opened: '06:45',
    status: 'Investigating',
  },
  {
    id: 'in_002',
    incident: 'Capacity threshold exceeded',
    severity: 'Warning',
    assignedOwner: 'Alex Morgan',
    opened: '08:42',
    status: 'Open',
  },
  {
    id: 'in_003',
    incident: 'Queue wait time elevated',
    severity: 'Warning',
    assignedOwner: 'Sam Patel',
    opened: '07:30',
    status: 'Open',
  },
  {
    id: 'in_004',
    incident: 'Workload blocked by quota',
    severity: 'Critical',
    assignedOwner: 'Unassigned',
    opened: '08:37',
    status: 'Open',
  },
  {
    id: 'in_005',
    incident: 'Runtime profile pending review',
    severity: 'Warning',
    assignedOwner: 'Jordan Lee',
    opened: '08:17',
    status: 'Investigating',
  },
];

export interface Notification {
  id: string;
  type: 'capacity' | 'workload' | 'approval' | 'queue' | 'runtime' | 'incident';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export const mockNotifications: Notification[] = [
  {
    id: 'nt_001',
    type: 'capacity',
    title: 'Capacity Warning',
    message: 'Cluster Gamma available capacity below 20% threshold.',
    timestamp: '2026-09-16T08:42:00Z',
    read: false,
    link: '/dashboard/operations',
  },
  {
    id: 'nt_002',
    type: 'workload',
    title: 'Workload Completed',
    message: 'Batch Inference J completed successfully.',
    timestamp: '2026-09-16T07:48:00Z',
    read: false,
    link: '/dashboard/workloads',
  },
  {
    id: 'nt_003',
    type: 'approval',
    title: 'Approval Requested',
    message: 'GPU quota increase request pending review.',
    timestamp: '2026-09-16T09:42:00Z',
    read: false,
    link: '/dashboard/policies',
  },
  {
    id: 'nt_004',
    type: 'queue',
    title: 'Queue Pressure Alert',
    message: 'Research Queue average wait time exceeds 30 minutes.',
    timestamp: '2026-09-16T07:30:00Z',
    read: true,
    link: '/dashboard/operations',
  },
  {
    id: 'nt_005',
    type: 'runtime',
    title: 'Runtime Profile Review',
    message: 'Inference Optimized profile requires approval.',
    timestamp: '2026-09-16T08:17:00Z',
    read: true,
    link: '/dashboard/policies',
  },
  {
    id: 'nt_006',
    type: 'incident',
    title: 'Incident Assigned',
    message: 'Node health degraded incident assigned to Jordan Lee.',
    timestamp: '2026-09-16T06:45:00Z',
    read: true,
    link: '/dashboard/operations',
  },
];

// Chart data generators
export const utilization24h = [
  { time: '00:00', utilization: 62, allocated: 55, available: 35 },
  { time: '02:00', utilization: 58, allocated: 52, available: 38 },
  { time: '04:00', utilization: 65, allocated: 58, available: 32 },
  { time: '06:00', utilization: 72, allocated: 64, available: 28 },
  { time: '08:00', utilization: 78, allocated: 70, available: 22 },
  { time: '10:00', utilization: 81, allocated: 73, available: 19 },
  { time: '12:00', utilization: 76, allocated: 68, available: 24 },
  { time: '14:00', utilization: 79, allocated: 71, available: 21 },
  { time: '16:00', utilization: 83, allocated: 75, available: 17 },
  { time: '18:00', utilization: 74, allocated: 66, available: 26 },
  { time: '20:00', utilization: 71, allocated: 63, available: 29 },
  { time: '22:00', utilization: 68, allocated: 60, available: 32 },
];

export const workloadActivity = [
  { name: 'Mon', running: 132, queued: 42, completed: 198, failed: 6 },
  { name: 'Tue', running: 145, queued: 38, completed: 210, failed: 4 },
  { name: 'Wed', running: 138, queued: 45, completed: 195, failed: 8 },
  { name: 'Thu', running: 152, queued: 36, completed: 225, failed: 3 },
  { name: 'Fri', running: 146, queued: 38, completed: 218, failed: 4 },
  { name: 'Sat', running: 98, queued: 22, completed: 142, failed: 2 },
  { name: 'Sun', running: 85, queued: 18, completed: 128, failed: 1 },
];

export const capacityDistribution = [
  { name: 'Allocated', value: 2018, color: '#FF6B35' },
  { name: 'Available', value: 416, color: '#3B82F6' },
  { name: 'Reserved', value: 188, color: '#A855F7' },
  { name: 'Maintenance', value: 14, color: '#F59E0B' },
];

export const utilizationTrend7d = [
  { day: 'Sep 10', utilization: 72, idle: 12, fragmented: 10 },
  { day: 'Sep 11', utilization: 74, idle: 10, fragmented: 11 },
  { day: 'Sep 12', utilization: 71, idle: 14, fragmented: 9 },
  { day: 'Sep 13', utilization: 78, idle: 8, fragmented: 12 },
  { day: 'Sep 14', utilization: 76, idle: 9, fragmented: 11 },
  { day: 'Sep 15', utilization: 79, idle: 7, fragmented: 13 },
  { day: 'Sep 16', utilization: 76, idle: 9, fragmented: 12 },
];

export const queueTimeTrend = [
  { time: '00:00', priority: 3, standard: 8, research: 15 },
  { time: '04:00', priority: 2, standard: 6, research: 12 },
  { time: '08:00', priority: 5, standard: 14, research: 28 },
  { time: '12:00', priority: 8, standard: 18, research: 31 },
  { time: '16:00', priority: 6, standard: 16, research: 25 },
  { time: '20:00', priority: 4, standard: 10, research: 18 },
];

export const memoryVsCompute = [
  { time: '00:00', memory: 45, compute: 62 },
  { time: '04:00', time2: '04:00', memory: 48, compute: 65 },
  { time: '08:00', memory: 55, compute: 78 },
  { time: '12:00', memory: 62, compute: 83 },
  { time: '16:00', memory: 58, compute: 79 },
  { time: '20:00', memory: 52, compute: 71 },
];

export const runtimeTrend = [
  { time: 'Mon', training: 45, inference: 32, batch: 18, research: 12 },
  { time: 'Tue', training: 48, inference: 35, batch: 20, research: 14 },
  { time: 'Wed', training: 42, inference: 38, batch: 16, research: 16 },
  { time: 'Thu', training: 52, inference: 36, batch: 22, research: 10 },
  { time: 'Fri', training: 46, inference: 34, batch: 24, research: 12 },
  { time: 'Sat', training: 28, inference: 22, batch: 16, research: 8 },
  { time: 'Sun', training: 24, inference: 20, batch: 14, research: 6 },
];

export interface OptimizationOpportunity {
  id: string;
  severity: 'Critical' | 'Warning' | 'Info';
  title: string;
  description: string;
  affected: string;
  status: 'Open' | 'Reviewing' | 'Addressed';
}

export const mockOptimizationOpportunities: OptimizationOpportunity[] = [
  {
    id: 'oo_001',
    severity: 'Warning',
    title: 'Fragmented capacity detected in Cluster Gamma',
    description: 'Several small allocations may be limiting larger workload placement.',
    affected: 'Cluster Gamma',
    status: 'Open',
  },
  {
    id: 'oo_002',
    severity: 'Info',
    title: 'Low utilization observed in selected workloads',
    description: 'Review runtime requirements and allocation patterns.',
    affected: 'Cluster Delta',
    status: 'Reviewing',
  },
  {
    id: 'oo_003',
    severity: 'Warning',
    title: 'Queue pressure increasing in Priority Queue',
    description: 'Review pending workloads and available capacity.',
    affected: 'Priority Queue',
    status: 'Open',
  },
  {
    id: 'oo_004',
    severity: 'Info',
    title: 'Reserved capacity exceeds current demand',
    description: 'Review reservation allocation and upcoming workload requirements.',
    affected: 'Cluster Beta',
    status: 'Addressed',
  },
];

export interface QueueInfo {
  id: string;
  name: string;
  pendingJobs: number;
  oldestWait: string;
  priority: 'High' | 'Medium' | 'Low';
  capacityAvailable: 'Available' | 'Limited' | 'Restricted';
  status: 'Active' | 'Warning' | 'Paused';
}

export const mockQueues: QueueInfo[] = [
  {
    id: 'q_001',
    name: 'Priority Queue',
    pendingJobs: 12,
    oldestWait: '08m',
    priority: 'High',
    capacityAvailable: 'Available',
    status: 'Active',
  },
  {
    id: 'q_002',
    name: 'Standard Queue',
    pendingJobs: 21,
    oldestWait: '16m',
    priority: 'Medium',
    capacityAvailable: 'Limited',
    status: 'Active',
  },
  {
    id: 'q_003',
    name: 'Research Queue',
    pendingJobs: 5,
    oldestWait: '31m',
    priority: 'Medium',
    capacityAvailable: 'Restricted',
    status: 'Warning',
  },
];
