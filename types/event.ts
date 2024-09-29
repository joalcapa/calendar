export interface Event {
  id: number;
  title: string;
  description: string;
  start_date: Date;
  finish_date: Date;
  is_all_day: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}