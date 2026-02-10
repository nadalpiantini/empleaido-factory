/**
 * Virtual Office Room Manager
 * Handles room transitions, layout, and navigation
 */

export interface RoomConfig {
  id: string;
  name: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
 empleaido?: string;
  doors: DoorConfig[];
  color: number;
}

export interface DoorConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  targetRoom: string;
  spawnPosition: { x: number; y: number };
}

/**
 * 6-Room Office Layout
 */
export const OFFICE_LAYOUT: RoomConfig[] = [
  {
    id: 'sera-office',
    name: 'SERA - Contabilidad',
    position: { x: 0, y: 0 },
    size: { width: 800, height: 600 },
    empleaido: 'SERA',
    color: 0x4a90d9,
    doors: [
      {
        x: 750,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'kael-office',
        spawnPosition: { x: 50, y: 300 },
      },
    ],
  },
  {
    id: 'kael-office',
    name: 'KAEL - Marketing',
    position: { x: 800, y: 0 },
    size: { width: 800, height: 600 },
    empleaido: 'KAEL',
    color: 0xd94a6e,
    doors: [
      {
        x: 0,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'sera-office',
        spawnPosition: { x: 700, y: 300 },
      },
      {
        x: 750,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'nora-office',
        spawnPosition: { x: 50, y: 300 },
      },
    ],
  },
  {
    id: 'nora-office',
    name: 'NORA - Customer Success',
    position: { x: 1600, y: 0 },
    size: { width: 800, height: 600 },
    empleaido: 'NORA',
    color: 0x6ed94a,
    doors: [
      {
        x: 0,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'kael-office',
        spawnPosition: { x: 700, y: 300 },
      },
      {
        x: 400,
        y: 550,
        width: 100,
        height: 50,
        targetRoom: 'lior-office',
        spawnPosition: { x: 400, y: 50 },
      },
    ],
  },
  {
    id: 'lior-office',
    name: 'LIOR - Operations',
    position: { x: 0, y: 600 },
    size: { width: 800, height: 600 },
    empleaido: 'LIOR',
    color: 0xd9b84a,
    doors: [
      {
        x: 400,
        y: 0,
        width: 100,
        height: 50,
        targetRoom: 'nora-office',
        spawnPosition: { x: 400, y: 500 },
      },
      {
        x: 750,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'ziv-office',
        spawnPosition: { x: 50, y: 300 },
      },
    ],
  },
  {
    id: 'ziv-office',
    name: 'ZIV - Legal',
    position: { x: 800, y: 600 },
    size: { width: 800, height: 600 },
    empleaido: 'ZIV',
    color: 0x9a4ad9,
    doors: [
      {
        x: 0,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'lior-office',
        spawnPosition: { x: 700, y: 300 },
      },
      {
        x: 750,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'lounge',
        spawnPosition: { x: 50, y: 300 },
      },
    ],
  },
  {
    id: 'lounge',
    name: 'Employee Lounge',
    position: { x: 1600, y: 600 },
    size: { width: 800, height: 600 },
    color: 0x4ad9c4,
    doors: [
      {
        x: 0,
        y: 300,
        width: 50,
        height: 100,
        targetRoom: 'ziv-office',
        spawnPosition: { x: 700, y: 300 },
      },
    ],
  },
];

/**
 * Get room by ID
 */
export function getRoom(roomId: string): RoomConfig | undefined {
  return OFFICE_LAYOUT.find(room => room.id === roomId);
}

/**
 * Get empleaido's office room
 */
export function getEmpleaidoOffice(empleaidoId: string): RoomConfig | undefined {
  return OFFICE_LAYOUT.find(room => room.empleaido?.toLowerCase() === empleaidoId.toLowerCase());
}

/**
 * Get adjacent rooms
 */
export function getConnectedRooms(roomId: string): RoomConfig[] {
  const room = getRoom(roomId);
  if (!room) return [];

  return room.doors
    .map(door => getRoom(door.targetRoom))
    .filter((r): r is RoomConfig => r !== undefined);
}
