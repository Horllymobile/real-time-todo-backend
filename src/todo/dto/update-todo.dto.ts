export interface UpdateTodoDto {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'done';
}
