export const COLUMNS = [
  { id: 'column-1', title: 'To do' },
  { id: 'column-2', title: 'Planned' },
  { id: 'column-3', title: 'In Progress' },
  { id: 'column-4', title: 'Closed' },
];

export function getTitleById(columnId: string): string | undefined {
  const column = COLUMNS.find(column => column.id === columnId);
  return column ? column.title : undefined;
}