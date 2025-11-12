/**
 * Workspace-scoped localStorage utilities
 * All data in the CRM is isolated by workspace
 */

export function getActiveWorkspaceId(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('crmdeep_active_workspace');
}

export function getWorkspaceStorageKey(key: string): string {
  const workspaceId = getActiveWorkspaceId();
  if (!workspaceId) {
    throw new Error('No active workspace found');
  }
  return `crmdeep_workspace_${workspaceId}_${key}`;
}

export function getWorkspaceData<T>(key: string, defaultValue: T[] = []): T[] {
  try {
    const storageKey = getWorkspaceStorageKey(key);
    const data = localStorage.getItem(storageKey);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error(`Error reading workspace data for key ${key}:`, error);
    return defaultValue;
  }
}

export function setWorkspaceData<T>(key: string, data: T[]): void {
  try {
    const storageKey = getWorkspaceStorageKey(key);
    localStorage.setItem(storageKey, JSON.stringify(data));
  } catch (error) {
    console.error(`Error writing workspace data for key ${key}:`, error);
  }
}

export function clearWorkspaceData(key: string): void {
  try {
    const storageKey = getWorkspaceStorageKey(key);
    localStorage.removeItem(storageKey);
  } catch (error) {
    console.error(`Error clearing workspace data for key ${key}:`, error);
  }
}

/**
 * Initialize workspace data with demo data if empty
 */
export function initializeWorkspaceData<T>(key: string, demoData: T[]): T[] {
  const existing = getWorkspaceData<T>(key);
  if (existing.length === 0 && demoData.length > 0) {
    setWorkspaceData(key, demoData);
    return demoData;
  }
  return existing;
}

/**
 * Add workspaceId field to all data items
 */
export function addWorkspaceIdToData<T extends { workspaceId?: string }>(
  data: T[]
): T[] {
  const workspaceId = getActiveWorkspaceId();
  if (!workspaceId) return data;

  return data.map(item => ({
    ...item,
    workspaceId,
  }));
}
