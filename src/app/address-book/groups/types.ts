// export interface GroupCardProps {
//   id: number;
//   name: string;
//   count: number;
//   lastModified?: Date;
//   lastModifiedById?: number;
//   lastModifiedBy?: string;
// }



export interface GroupCardProps {
  id: number;
  name: string;
  count: number;
  lastModified?: Date;
  lastModifiedById?: number;
  lastModifiedBy?: string;
  demo?: boolean;
  source?: 'api' | 'user'; // Track data source
  createdAt?: string; // For new groups
}

export interface CreateGroupPayload {
  name: string;
  count: number;
  lastModifiedBy?: string;
}