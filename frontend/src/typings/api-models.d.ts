export interface Group {
  name: GroupPK;
}

export type GroupPK = 'admin' | 'reader' | 'manager';

export interface User {
  id: number;
  name: string;
  is_active: boolean;
  email: string;
  group: GroupPK;
  date_joined: string;
}