export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const dayOfMonth = date.toLocaleDateString('en-US', { day: '2-digit' });
  const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'short' });
  const month = date.toLocaleDateString('en-US', { month: 'long' });

  return `${dayOfWeek}, ${dayOfMonth} ${month}`;
}; 

export const formatDateForHistory = (dateString: string): string => {
  const timestampWithoutSpaces = dateString.replace(/\s/g, '');
  const date = new Date(parseInt(timestampWithoutSpaces));

  const dayOfMonth = date.getDate();
  const month = date.toLocaleString('en-US', { month: 'short' });
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'pm' : 'am';

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

  return `${month} ${dayOfMonth} at ${formattedHours}:${formattedMinutes} ${ampm}`;
};

