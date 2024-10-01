export interface Event {
  id?: number;
  title: string;
  description: string;
  start_date: Date | string;
  finish_date?: Date | string;
  is_all_day: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}