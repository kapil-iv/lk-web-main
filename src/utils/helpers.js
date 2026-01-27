/**
 * Formats any 10-digit phone number to (XXX) XXX-XXXX format.
 */
export const formatPhoneNumber = (input) => {
    const digits = input.toString().replace(/\D/g, ""); // remove non-numeric
    if (digits.length !== 10) return input.toString();
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  };
  
  // Function to trim a text after 8 character
  export const trimTextShort = (text, limit = 11) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };
  
  // Function to trim a text after 14 character
  export const trimTextBig = (text, limit = 20) => {
    if (!text) return "";
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };  export const getDayOfWeek = (dateString) => {
    const date = new Date(dateString);
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };
  
  export const getMonthAndDay = (dateString) => {
    const date = new Date(dateString);
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    return `${months[date.getMonth()]} ${date.getDate()}`;
  };
  
  export const getTime = (dateString) => {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutesStr} ${ampm}`;
  };

 const format24To12 = (time) => {
  if (!time) return "";

  return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export default format24To12;