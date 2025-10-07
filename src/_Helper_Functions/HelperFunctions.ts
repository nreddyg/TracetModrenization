
import dayjs from 'dayjs';

//you can format the dates into various formats like dd/mm/yyyy || dd-mm-yyyy || dd-mm-yy || mm-dd-yyyy || yyyy-mm-dd etc other formats
export const formatDate = (date: Date | string | number, format: string = 'YYYY-MM-DD'): string => {
  return date ? dayjs(date).format(format):'';
};
// "04/03/2025 09:58:52" to DD-MM-YYYY
export function formatDateToDDMMYYYY(dateTimeStr: string) {
  if (!dateTimeStr?.trim()) return "";
  return (([d, m, y]) => `${d}-${m}-${y}`)(
    dateTimeStr.split(" ")[0].split("/")
  );
}

import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);
//you can format the dates into various formats like dd/mm/yyyy || dd-mm-yyyy || dd-mm-yy || mm-dd-yyyy || yyyy-mm-dd etc other formats and also accepts String in in given format

export const formatDates = (date: Date | string | number, format: string = 'YYYY-MM-DD'): string => {
  if (!date) return '';
  // If the input is a string, parse it using a specific format
  if (typeof date === 'string') {
    return dayjs(date, format, true).format(format);  // true => strict parsing
  }
  // For Date objects or timestamps
  return dayjs(date).format(format);
};


//upload helper function 
 export const fileToByteArray = (blob: Blob): Promise<Uint8Array> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const arrayBuffer = reader.result as ArrayBuffer;
      resolve(new Uint8Array(arrayBuffer));
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(blob);
  });
};

//get a color based on the priority
 export const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-600 text-white';
      case 'High': return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'Low': return 'bg-green-100 text-green-800 hover:bg-green-200';
      default: return 'bg-gray-100 text-gray-800';
    }
};
//get a color based on the status
export const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-blue-100 text-blue-800';
      case 'In Progress': return 'bg-orange-100 text-orange-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
};
//get a color based on the activity status
export const getActivityStatusColor = (status: string) => {
    switch (status) {
      case 'Linked': return 'text-green-600';
      case 'Unlinked': return 'text-red-600';
      case 'Manual Entry': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
};

 // Utility Function: byteArrayToFile
export const byteArrayToFile = (
    resultByte: number[] | Uint8Array,
    fileName: string,
    type: string,
    format: string
  ): void => {
    const bytes = new Uint8Array(resultByte);
    const blob = new Blob([bytes], { type });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${fileName}.${format}`;
    link.click();
  };

  //get getRequestType based on Id
  export const getRequestTypeById = (id) => {
    switch (id) {
      case "100":
           return "SLAViolatedRequests";
      case "101":
         return "OpenAndPending";
      case "102":
        return "OpenTicketsInMyGroups";
      case "103":
        return "Closed";
      case "104":
        return "MyOpenAndPendingRequests";
      case "105":
        return "MyRequestClosed";
         case "106":
        return "All";
      default:
        return "";
    }
  };

// Common style groups
const GREEN ='bg-green-50 text-green-700 border-green-200 hover:bg-green-600 hover:text-white';
const YELLOW ='bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-500 hover:text-white';
const RED ='bg-red-50 text-red-700 border-red-200 hover:bg-red-600 hover:text-white';
const BLUE ='bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-600 hover:text-white';
const PURPLE ='bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-600 hover:text-white';
const EMERALD ='bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-600 hover:text-white';
const AMBER ='bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-500 hover:text-white';
const GRAY ='bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-600 hover:text-white';
const statusColors: Record<string, string> = {
  Low: GREEN,
  Active: GREEN,
  Open: GREEN,
  Medium: YELLOW,
  High: RED,
  Deactive: RED,
  'In Progress': BLUE,
  Resolved: PURPLE,
  'Re-Open': EMERALD,
  Hold: AMBER,
  Closed: GRAY,
};
export const getColorForStatus = (status: string): string => statusColors[status] || GRAY;
