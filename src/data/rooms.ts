import type { Room } from '../types'

export const mockRooms: Room[] = [
  {
    id: 'r1',
    block: 'A',
    name: 'Block A - Room 101',
    capacity: 4,
    occupants: ['s1'],
  },
  {
    id: 'r2',
    block: 'A',
    name: 'Block A - Room 102',
    capacity: 4,
    occupants: ['s3'],
  },
  {
    id: 'r3',
    block: 'B',
    name: 'Block B - Room 201',
    capacity: 4,
    occupants: [],
  },
  {
    id: 'r4',
    block: 'B',
    name: 'Block B - Room 202',
    capacity: 4,
    occupants: [],
  },
  {
    id: 'r5',
    block: 'C',
    name: 'Block C - Room 301',
    capacity: 4,
    occupants: [],
  },
]
