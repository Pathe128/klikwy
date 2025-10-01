export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'draft' | 'in_progress' | 'completed' | 'cancelled';
  category?: string;
  type?: string;
  visibility: 'public' | 'private';
  budget?: string | number;
  deadline?: string;
  requirements?: string;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  client?: {
    id: string;
    name: string;
    email?: string;
  };
  freelancer?: {
    id: string;
    name: string;
    email?: string;
  };
  attachments?: Array<{
    id: string;
    name: string;
    url: string;
    type: string;
    size: number;
  }>;
  messages?: Array<{
    id: string;
    content: string;
    sender: 'client' | 'freelancer';
    createdAt: string;
    read: boolean;
  }>;
}
