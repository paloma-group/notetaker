export function formatDate(date) {
  const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];

  const month = months[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // Handle midnight

  const formattedDate = `${month} ${day}, ${year} at ${hours}:${minutes.toString().padStart(2, '0')} ${period}`;

  return formattedDate;
}
