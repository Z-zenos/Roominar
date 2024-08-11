/**
 * @description Format datetime to hour:minue
 * @param string
 * @returns string
 * @example
 *  format('2019-12-12 12:50:13')) => '12:50'
 */
export function formatTime(date: string) {
  const formatDate = new Date(date);
  const hours = String(formatDate.getHours()).padStart(2, '0');
  const minutes = String(formatDate.getMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
