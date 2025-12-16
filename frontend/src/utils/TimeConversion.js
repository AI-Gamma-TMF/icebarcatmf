
const useTimeConversion = (dateString, forDate) => {
    const inputDate = new Date(dateString);
    let formattedDate
    if(forDate == 'start') {
      formattedDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 0, 0, 0, 0);
    } else {
      formattedDate = new Date(inputDate.getFullYear(), inputDate.getMonth(), inputDate.getDate(), 23, 59, 59, 999);
    }
    
    const utcTimestamp = formattedDate.toISOString();
    return utcTimestamp;
}
export default useTimeConversion