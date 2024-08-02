export const formatDateToTime = (dateString) => {
  const date = new Date(dateString);
  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight (0 hours)
  minutes = minutes < 10 ? '0' + minutes : minutes;
  const formattedTime = hours + ':' + minutes + ' ' + ampm;
  return formattedTime;
};

export const formatDate = (dateString) => {
  const date = dateString ? new Date(dateString) : new Date();
  const options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true, // Use 12-hour format
  };
  return date.toLocaleDateString('en-US', options);
};

export function formatDateForFilter(dateString, isEndDate = false) {
  let date;
  if (dateString) {
    date = new Date(dateString);
  } else {
    date = new Date();
  }
  if (!isEndDate) {
    date.setHours(0, 0, 0, 0);
  } else {
    date.setHours(23, 59, 0, 0);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 because months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
