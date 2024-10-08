export class Task {
  id: string;
  title: string;
  description: string;
  capacity: number;
  participants: string[];
  constructor(
    id: string,
    title: string,
    description: string,
    capacity: number,
    participants: string[]
  ) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.capacity = capacity;
    this.participants = participants;
  }
}
