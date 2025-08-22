
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
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
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
    console.log("got",id)
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
 