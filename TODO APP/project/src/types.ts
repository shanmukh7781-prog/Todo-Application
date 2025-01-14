export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  reminder?: Date;
  priority: 'low' | 'medium' | 'high';
  tags?: string[];
}

export interface User {
  id: string;
  username: string;
  password: string;
}