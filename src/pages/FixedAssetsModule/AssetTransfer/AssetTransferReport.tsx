import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import { getReportlist } from '@/services/assetTransferAssetServices';
import { Download } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppSelector } from '@/store';

const AssetTransferReport = () => {

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const transferId = JSON.parse(params.get("transferId"));
    const [transferData,setTransferData]=useState(null);
     const deliveryDate = transferData?.DeliveryChallanDetails[0]?.["DeliveryChallanDate"];
    const dataSource = transferData?.AssetDetails;
    const fileName = "TransferGSTDeliveryChallan";
        const companyName = useAppSelector(state => state.projects.companyName);
        console.log(companyName,'23')
    
    // const companyName = JSON.parse(params.get("companyName"));
    // const lastlevel = params.get("lastlevel");
    const supplystatus = JSON.parse(params.get("supplyStatus"));
    const TotalInvoice = transferData?.AssetTotalDetails[0]?.TotalValue
    const [inwords, setInWords] = useState("");
    const organisationDetails = JSON.parse(localStorage.getItem("orgObj"));



    //   function ConvertNumToWord() {
    //     if (!isNaN(TotalInvoice) && TotalInvoice !== '') {
    //       if (TotalInvoice?.toString().includes(".")) {
    //         const splitValue = TotalInvoice?.toString()?.split(".");
    //         if (splitValue[0].length <= 9) {
    //           const wholeNum = numWords(parseInt(splitValue[0]))
    //           let decimalNum;
    //           if (splitValue[1].length === 1) {
    //             const zeroAdd = `${splitValue[1]}0`
    //             decimalNum = numWords(parseInt(zeroAdd))
    //           }
    //           else {
    //             decimalNum = numWords(parseInt(splitValue[1]))
    //           }
    //           setInWords(`${wholeNum} Rupees And ${decimalNum} Paisa Only`)
    //         }
    //         else {
    //           setInWords('');
    //         }
    //       }
    //       else {
    //         const intoWords = numWords(TotalInvoice)
    //         setInWords(`${intoWords} Rupees Only`);
    //       }

    //     } else {
    //       setInWords('');
    //     }
    //   }

    function formatDate(dateString) {
        if (dateString) {
            const [year, month, day] = dateString.substring(0, 10).split('-');
            return `${day}/${month}/${year}`;
        }
        return null;
    }

    const formattedDelivDate = formatDate(transferData?.DeliveryChallanDetails[0]?.DeliveryChallanDate);
    const formattedTransfDate = formatDate(transferData?.FromDetails[0]?.TransferDate);
    const InvoiceDate = formatDate(transferData?.FromDetails[0]?.InvoiceDate)

    // formatting the today's date
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = date + "/" + month + "/" + year;

    //   useEffect(() => {
    //     ConvertNumToWord()
    //   }, [TotalInvoice])

      const handleMenuClick = (format) => {
        // AssetTransChallanDownload({ fileFormat: format, fileName: fileName, transferData: transferData, dataSource: dataSource, lastlevel: lastlevel, companyName: companyName, inWords: inwords, organisationDetails: organisationDetails, deliveryDate: deliveryDate, supplystatus: supplystatus, currentDate: currentDate });
      }

      const items = [
        {
          key: "1",
          label: (<span onClick={() => handleMenuClick('xls')}>Excel</span>),
          value: "excel"
        },
        {
          key: "2",
          label: (<span onClick={() => handleMenuClick('pdf')}>PDF</span>),
          value: "pdf"
        },
        {
          key: "3",
          label: (<span onClick={() => handleMenuClick('docx')}>Word</span>),
          value: "word"
        }
      ]

    const getTransferReport=async(transid,compid)=>{
        console.log(transid,compid)
        await getReportlist(transid,compid).then((res)=>{
            if(res.data && res.success){
               setTransferData(res.data)
            }
        })
    }

    useEffect(()=>{
        getTransferReport(transferId,"111")
    },[])

    return (
        <>
            <div className="flex justify-end ">
                {/* <Dropdown className='reportAssetTransferDropDown' menu={{ items }} placement="bottom">
          <div className="mrfour justify-content-center col-4">
            Select Format  <GoDownload size={18} />
          </div>
        </Dropdown> */}
         <DropdownMenu>
  <DropdownMenuTrigger asChild>
    <div
      className="bg-white w-1/5 rounded-[3px] text-[13px] border border-[#d3dbea]
                 px-[10px] py-[8px] cursor-pointer text-[#303e67] font-medium
                 h-[23px] flex items-center justify-center gap-2"
    >
      <span>Select Format</span>
      <Download size={18} />
    </div>
  </DropdownMenuTrigger>

  <DropdownMenuContent className="w-48">
    <DropdownMenuItem onClick={() => console.log('PDF selected')}>
      PDF
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => console.log('Excel selected')}>
      Excel
    </DropdownMenuItem>
     <DropdownMenuItem onClick={() => console.log('Word selected')}>
      Word
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

            </div>

            <div className="px-4 overflow-y-scroll">
                <div className="w-full max-h-[94vh]">

                    {/* header Div */}
                    <div className="flex justify-center flex-col items-center"
>
                        <h3 className="mb-[5px] font-medium text-[20px]">{companyName}</h3>
                        <h6 className="mt-[1px] text-[10px] font-extralight text-[#212529] text-center">{`${organisationDetails?.AddressLine1},${organisationDetails?.City},${organisationDetails?.State},${organisationDetails?.ZipCode},${organisationDetails?.CountryName}`}</h6>
                        <h6 className="mt-[1px] text-[10px] font-extralight text-[#212529] text-center">{`${organisationDetails?.OrganizationEmail},${organisationDetails?.OrganizationPhone} ${organisationDetails?.Website === null ? '' : organisationDetails?.Website}`}</h6>
                    </div>

                    {/* Table Start Div */}
                    <div className='mt-4'>
                        <div className=" px-2 flex justify-between items-center">
                            <h5  className="mt-[1px] text-[15px] font-medium text-[#212529] border-t border-l border-black border-b-0 mb-0 bg-[#B0C4DE]  p-2 text-center w-full"  ><u>{(supplystatus === 1 || deliveryDate !== "") ? "Asset Transfer Delivery Challan" : "Asset Transfer Invoice Details"}</u></h5>
                            <h5 className='p-2 border-t border-l border-r border-black w-[12rem]'>{`Date : ${currentDate}`}</h5>
                        </div>
                        <div className='assettransferReportTable pb-3 px-2'>
                            <table className='w-full'>
                                <tr>
                                    <th className={`p-[10px] border border-[#0c0b0c] font-medium w-[40px]  ${ (supplystatus === 1 || deliveryDate !== "") ? "w-1/3" : "w-1/2" }`}>Shipping From</th>
                                    <th className={`p-[10px] border border-[#0c0b0c] font-medium w-[40px] ${ (supplystatus === 1 || deliveryDate !== "") ? "w-1/3" : "w-1/2" }`}>Shipping To</th>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <th className="w-[40%] p-[10px] border border-[#0c0b0c] font-medium w-[40px]">Delivery Challan Details</th> : ""}
                                </tr>
                                <tr>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]"> <div className="flex justify-between w-full">
                                        <p className="w-[40%] text-[14px] font-medium">{"branch"}</p>
                                        <p className='w-[5%]'>:</p>
                                        <p  className=' w-[55%] text-[14px] font-normal'>{transferData?.FromDetails[0]?.FromBranch}</p>
                                        {/* <p style={{ width: "55%", wordWrap:'break-word' }}  >lkjhgfdcvbnkuytfdcvbnmkluygfcvbnmkugfvbnmkjhgvbnmkugfv njhgfcvbnjhgvbnjhg</p> */}
                                    </div></td>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">{"branch"}</p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{transferData?.ToDetails[0]?.ToBranch}</p>
                                        </div>
                                    </td>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Delivery Challan No</p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.DeliveryChallanDetails[0]?.DeliveryChallanNo}</p>
                                            </div>
                                        </td>
                                        : ""}
                                </tr>
                                <tr>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]"> <div className="flex justify-between w-full">
                                        <p className="w-[40%] text-[14px] font-medium">GSTIN/UIN </p>
                                        <p className='w-[5%]'>:</p>
                                        <p className=' w-[55%] text-[14px] font-normal' >{transferData?.FromDetails[0]?.FromGSTUIN}</p>
                                    </div></td>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">Location </p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{transferData?.ToDetails[0]?.Location}</p>
                                        </div>
                                    </td>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Delivery Challan Date</p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{formattedDelivDate}</p>
                                            </div>
                                        </td>
                                        : ""}
                                </tr>
                                <tr>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">Address</p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{transferData?.FromDetails[0]?.FromAddress}</p>
                                        </div>
                                    </td>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">Address</p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{transferData?.ToDetails[0]?.ToAddress}</p>
                                        </div>
                                    </td>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Mode Of Transport</p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.DeliveryChallanDetails[0]?.ModeofTransport}</p>
                                            </div>
                                        </td>
                                        : ""}
                                </tr>
                                <tr>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Invoice No</p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.FromDetails[0]?.InvoiceNo}</p>
                                            </div>
                                        </td> : <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]" style={{ height: "0%" }}><span ></span></td>
                                    }
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">GSTIN/UIN</p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{transferData?.ToDetails[0]?.ToGSTUIN}</p>
                                        </div>
                                    </td>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Transport Name</p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.DeliveryChallanDetails[0]?.TransportName}</p>
                                            </div>
                                        </td> : ""}
                                </tr>
                                <tr>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">{(supplystatus === 1 || deliveryDate !== "") ? "Invoice Date"
                                                : "Transfer Invoice No"}</p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{(supplystatus === 1 || deliveryDate !== "") ? (InvoiceDate) : (transferData?.FromDetails[0]?.TransferInvoiceNo)}</p>
                                        </div>
                                    </td>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">Pin Code</p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{transferData?.ToDetails[0]?.ToPinCode}</p>
                                        </div>
                                    </td>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Vehilce Reg No </p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.DeliveryChallanDetails[0]?.VehicleRegNo}</p>
                                            </div>
                                        </td> : ""}
                                </tr>
                                <tr>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">Transfer Date</p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{formattedTransfDate}</p>
                                        </div>
                                    </td>
                                    <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                        <div className="flex justify-between w-full">
                                            <p className="w-[40%] text-[14px] font-medium">Place Of Supply </p>
                                            <p className='w-[5%]'>:</p>
                                            <p className=' w-[55%] text-[14px] font-normal' >{transferData?.ToDetails[0]?.PlaceOfSupply}</p>
                                        </div>
                                    </td>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Lr No </p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.DeliveryChallanDetails[0]?.LRNo}</p>
                                            </div>
                                        </td> : ""}
                                </tr>
                                {/* <tr>
                  <td></td>
                  <td></td> */}
                                {(supplystatus === 1 || deliveryDate !== "") ?
                                    <tr>
                                        <td  className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]"></td>
                                        <td  className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]"></td>
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]">
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Driver Name </p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.DeliveryChallanDetails[0]?.DriverName}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    : ""}
                                {/* </tr> */}
                                {(supplystatus === 1 || deliveryDate !== "") ? "" :
                                    <tr>
                                        <td className='border-b border-[#0c0b0c]'></td>
                                        <td className='border-b border-[#0c0b0c]'>
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">State / State Code </p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.ToDetails[0]?.["State&StateCode"]}</p>
                                            </div>
                                        </td>
                                        {/* <td className='border-b border-[#0c0b0c]'></td> */}
                                    </tr>}
                                {/* <tr>
                  <td className='border-b border-[#0c0b0c]'></td>
                  <td className='border-b border-[#0c0b0c]'></td>
                  </tr> */}
                                {(supplystatus === 1 || deliveryDate !== "") ?
                                    <tr>
                                        <td className='border-b border-[#0c0b0c] p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]"'></td>
                                        <td className='border-b border-[#0c0b0c] p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px]"'></td>
                                        <td className="p-[10px] border-r border-l border-[#0c0b0c] font-medium w-[40px] border-b border-[#0c0b0c]" >
                                            <div className="flex justify-between w-full">
                                                <p className="w-[40%] text-[14px] font-medium">Contact Number </p>
                                                <p className='w-[5%]'>:</p>
                                                <p className=' w-[55%] text-[14px] font-normal' >{transferData?.DeliveryChallanDetails[0]?.ContactNumber}</p>
                                            </div>
                                        </td>
                                    </tr>
                                    : ""}
                                {/* </tr> */}
                            </table>
                        </div>
                    </div>

                    {/*Rows of transferred table*/}
                    <div className='mt-4'>
                        <table className="border-collapse w-full">
                            <thead>
                                <tr>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]  ">Asset Name</th>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE] w-[10%]">Asset Code</th>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE] w-[10%]">Customer Asset No</th>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE] w-[10%]">Asset BarCode</th>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Model Number</th>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Serial Number</th>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">HSN Code</th>
                                    <th rowSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Taxable Value</th>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <>
                                            <th colSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">CGST</th>
                                            <th colSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">SGST/UTGST</th>
                                        </> :
                                        <th colSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">IGST</th>
                                    }
                                    <th colSpan={2} className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Cess</th>
                                </tr>
                                <tr>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <>
                                            <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Rate</th>
                                            <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Amount</th>
                                            <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Rate</th>
                                            <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Amount</th>
                                        </> : <>
                                            <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Rate</th>
                                            <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Amount</th>
                                        </>
                                    }
                                    <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Rate</th>
                                    <th className="border border-[#0c0b0c] text-center p-[10px] font-medium w-[40px] text-[13px] bg-[#B0C4DE]">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    dataSource?.map((rec) => (
                                        <tr>
                                            <td className="border text-left p-[10px] text-[11px]">{rec.AssetName}</td>
                                            <td  className="border text-left p-[10px] text-[11px] w-[10%]">{rec.AssetCode}</td>
                                            <td className="border text-left p-[10px] text-[11px] w-[10%]">{rec.CustomerAssetNo}</td>
                                            <td className="border text-left p-[10px] text-[11px] w-[10%]">{rec.AssetBarCode}</td>
                                            <td className="border text-left p-[10px] text-[11px]">{rec.ModelNumber}</td>
                                            <td className="border text-left p-[10px] text-[11px]">{rec.SerialNumber}</td>
                                            <td className="border text-left p-[10px] text-[11px]">{rec.HSNCode}</td>
                                            <td className="border text-left p-[10px] text-[11px]">{rec.TaxableValue}</td>
                                            {(supplystatus === 1 || deliveryDate !== "") ? <>
                                                <td className="border text-left p-[10px] text-[11px]">{rec.CGSTRate}</td>
                                                <td className="border text-left p-[10px] text-[11px]">{rec.CGSTAmount}</td>
                                                <td className="border text-left p-[10px] text-[11px]">{rec.SGSTRate}</td>
                                                <td className="border text-left p-[10px] text-[11px]">{rec.SGSTAmount}</td></> :
                                                <><td className="border text-left p-[10px] text-[11px]">{rec.IGSTRate}</td>
                                                    <td className="border text-left p-[10px] text-[11px]">{rec.IGSTAmount}</td></>
                                            }
                                            <td className="border text-left p-[10px] text-[11px]">{rec.CessRate}</td>
                                            <td className="border text-left p-[10px] text-[11px]">{rec.CessAmount}</td>
                                        </tr>
                                    ))
                                }
                                <tr>
                                    <td colSpan={7} className="border text-left p-[10px] text-[11px] text-right text-[13px] font-semibold">Total</td>
                                    <td className="border text-left p-[10px] text-[11px] text-[13px] font-semibold"> {transferData?.AssetTotalDetails[0]?.TotalTaxableValue}</td>
                                    {(supplystatus === 1 || deliveryDate !== "") ?
                                        <>
                                            <td className="border text-left p-[10px] text-[11px]"></td>
                                            <td className="border text-left p-[10px] text-[11px] text-[13px] font-semibold">{transferData?.AssetTotalDetails[0]?.TotalCGSTAmount}</td>
                                            <td className="border text-left p-[10px] text-[11px]"></td>
                                            <td className="border text-left p-[10px] text-[11px] text-[13px] font-semibold">{transferData?.AssetTotalDetails[0]?.TotalSGSTAmount}</td>

                                        </> :
                                        <>
                                            <td className="border text-left p-[10px] text-[11px]"></td>
                                            <td className="border text-left p-[10px] text-[11px] text-[13px] font-semibold">{transferData?.AssetTotalDetails[0]?.TotalIGSTAmount}</td>
                                        </>
                                    }

                                    <td className="border text-left p-[10px] text-[11px]"></td>
                                    <td className="border text-left p-[10px] text-[11px] text-[13px] font-semibold">{transferData?.AssetTotalDetails[0]?.TotalCessAmount}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Totaling the Amount */}
                    <div className="flex justify-end px-2 mt-4">
                        <div className="flex gap-4">
                            <div className="flex flex-col gap-3 justify-end">
                                <div className='text-right'><b>Total Taxable Value &nbsp;&nbsp; :</b></div>
                                <div className='text-right'><b>Gst &nbsp;&nbsp; :</b></div>
                                <div className='text-right'><b>Total Cess Amount &nbsp;&nbsp; :</b></div>
                                <div className='text-right'><b>Total Challan Value ( in figures ) &nbsp;&nbsp; :</b></div>
                                <div className='text-right'><b>Total Challan (in words) &nbsp;&nbsp; :</b></div>
                            </div>
                            <div className="flex flex-col gap-3 justify-end">
                                <div className='text-right'><b>{transferData?.AssetTotalDetails[0]?.TotalTaxableValue}</b></div>
                                <div className='text-right'><b>{transferData?.AssetTotalDetails[0]?.GST}</b></div>
                                <div className='text-right'><b>{transferData?.AssetTotalDetails[0]?.TotalCessAmount}</b></div>
                                <div className='text-right'><b>{transferData?.AssetTotalDetails[0]?.TotalValue}</b></div>
                                <div className='text-right'><b>{`${inwords.charAt(0).toUpperCase() + inwords.slice(1)} ${TotalInvoice?.toString().length <= 9 ? `` : ""}`}</b></div>
                            </div>
                        </div>
                    </div>

                    <div className='flex flex-row gap-5 mt-4'>
                        {/* Remarks container */}
                        <div  className='flex flex-col gap-3 p-4 border border-black w-[40%]'>
                            <div className='flex gap-3'>
                                <div className='text-[14px] font-medium'>Remarks:</div>
                                <div className='text-right'> {transferData?.OtherDetails[0]?.Remark}</div>
                            </div>

                            <div className='d-flex gap-3'>
                                <div className='text-[14px] font-medium'>Terms & Conditions:</div>
                                <div className='text-right'> {transferData?.OtherDetails[0]?.TermsandCondition}</div>
                            </div>

                            <div className='flex gap-3'>
                                <div className='text-[14px] font-medium'> Prepared By: </div>
                                <div className='text-right'>    </div>
                            </div>

                            <div className='flex gap-3'>
                                <div className='text-[14px] font-medium'>Approved By:</div>
                                <div className='text-right'></div>
                            </div>

                            <div className='flex justify-end'>
                                E & O.E
                            </div>
                        </div>
                        {/* Signature Container */}
                        <div  className='p-4 border border-black w-[60%]'>
                            <div className='flex flex-col gap-4'>
                                <div className='text-[14px] font-medium'>Signature :{transferData?.OtherDetails[0]?.Signature}</div>
                                <div className='text-[14px] font-medium'>Name of the Authorized Signatory :  {transferData?.OtherDetails[0]?.NameOfTheAuthorizedSignatory}</div>
                                <div className='text-[14px] font-medium'>Design/Status :  {transferData?.OtherDetails[0]["Designation/Status"]}</div>
                                <div className='text-[14px] font-medium'>Date :  {transferData?.OtherDetails[0]?.Date}</div>
                            </div>
                            <div className='flex flex-col gap-3'>
                                <div></div>
                                <div></div>
                                <div></div>
                                <div></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default AssetTransferReport


