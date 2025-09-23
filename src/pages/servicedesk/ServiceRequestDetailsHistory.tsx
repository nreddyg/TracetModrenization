import ReusableTable from "@/components/ui/reusable-table";
import { getServiceRequestDetailsHistoryReport } from "@/services/servicedeskReportsServices";
import { useAppDispatch, useAppSelector } from "@/store";
import { setLoading } from "@/store/slices/projectsSlice";
import { ColumnDef } from "@tanstack/react-table";
import React, { useEffect, useState, useRef } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react"; // icon

const ServiceRequestReport: React.FC = () => {
  const [data, setData] = useState<any>(null);
  const dispatch = useAppDispatch();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [cols, setCols] = useState<ColumnDef<any>[]>([]);
  const storedData = localStorage.getItem("srData");
  const branch = localStorage.getItem("Branch");
  const companyId = localStorage.getItem("CompanyId");

  // Ref to capture the full component
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchServiceRequestDetailsHistoryReport(companyId,branch,JSON.parse(storedData || "{}").id || "");
  }, [branch]);

  async function fetchServiceRequestDetailsHistoryReport(compId: string , BranchName: string, srID: string) {
    dispatch(setLoading(true));
    await getServiceRequestDetailsHistoryReport(compId, BranchName, srID)
      .then((res) => {
        if (res.success && res.data.status === undefined) {
          setData(res.data);
          if (res.data.AssetDetails.length !== 0) {
            setCols(generateColumnsFromData(res.data.AssetDetails));
            setDataSource(res.data.AssetDetails);
          }
        }
      })
      .catch(() => {})
      .finally(() => {
        dispatch(setLoading(false));
      });
  }

  function generateColumnsFromData<T extends Record<string, any>>(
    data: T[]
  ): ColumnDef<T>[] {
    if (!data || data.length === 0) return [];
    const sample = data[0];
    return Object.keys(sample).map((key) => ({
      accessorKey: key,
      header: key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase()),
    })) as ColumnDef<T>[];
  }

  if (!data) return <p>Loading...</p>;

  const details = data.ServiceRequestDetails;
  const assets = data.AssetDetails ;
  const comments = Object.values(data.Comments||{});

  // 📦 Export Handlers
  const handleExportPDF = async () => {
  if (!reportRef.current) return;
  const element = reportRef.current;

  const canvas = await html2canvas(element, { scale: 2 });
  const imgData = canvas.toDataURL("image/png");
  const pdf = new jsPDF("p", "mm", "a4");

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const margin = 15; // ⬅️ add margins here
  const imgWidth = pageWidth - margin * 2;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let y = margin;

  // if image is taller than page, scale down
  if (imgHeight > pageHeight - margin * 2) {
    const ratio = (pageHeight - margin * 2) / imgHeight;
    pdf.addImage(
      imgData,
      "PNG",
      margin,
      margin,
      imgWidth * ratio,
      imgHeight * ratio
    );
  } else {
    pdf.addImage(imgData, "PNG", margin, y, imgWidth, imgHeight);
  }
  pdf.save("Service Request Detail History Report.pdf");
};


  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();

    // Sheet 1: Service Request Details
    const detailsSheet = XLSX.utils.json_to_sheet([details]);
    XLSX.utils.book_append_sheet(wb, detailsSheet, "Request Details");

    // Sheet 2: Assets
    const assetSheet = XLSX.utils.json_to_sheet(assets);
    XLSX.utils.book_append_sheet(wb, assetSheet, "Assets");

    // Sheet 3: History
    const historySheet = XLSX.utils.json_to_sheet(
      comments.map((c, idx) => ({ Step: idx + 1, Comment: c }))
    );
    XLSX.utils.book_append_sheet(wb, historySheet, "History");

    XLSX.writeFile(wb, "Service Request Detail History Report.xlsx");
  };

  const handleExportCSV = () => {
    const csvData = [
      ["Service Request Details"],
      ...Object.entries(details).map(([k, v]) => [k, v]),
      [],
      ["Assets"],
      ...assets.map((row) => Object.values(row)),
      [],
      ["History"],
      ...comments.map((c, idx) => [idx + 1, c]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(csvData);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "Service Request Detail History Report.csv");
  };
  return (
    <div className="p-6 bg-white h-full overflow-y-scroll">
      {/* Export Dropdown */}
      <div className="flex justify-end mb-4">
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button variant="outline" size="sm">
        <Download className="w-4 h-4 mr-2" />
        Export
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end" className="w-48">
      <DropdownMenuItem onClick={handleExportPDF}>
        Export as PDF
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleExportExcel}>
        Export as Excel
      </DropdownMenuItem>
      <DropdownMenuItem onClick={handleExportCSV}>
        Export as CSV
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</div>

      {/* Full Report Wrapper */}
      <div ref={reportRef}>
        {/* Header */}
        <h1 className="text-center font-semibold text-lg mb-6">
          Service request detail history
        </h1>
        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8">
        {/* Left column */}
        <div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">
              Service Request No</span>
            <span>: {details?.ServiceRequestNo}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Requested By</span>
            <span>: {details?.RequestedBy}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Requested date & time</span>
            <span>: {details?.RequestedDate}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Severity</span>
            <span>: {details?.Severity}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Priority</span>
            <span>: {details?.Priority}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Branch</span>
            <span>: {details?.Branch}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Assignee</span>
            <span>: {details?.Assignee || "-"}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Linked To</span>
            <span>: {details?.LinkedTo || "-"}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Customer Name</span>
            <span>: {details?.CustomerName}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Title</span>
            <span>: {details?.Title}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Description</span>
            <span>: {details?.Description}</span>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Service Request Type</span>
            <span>: {details?.ServiceRequestType}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Service Request Status</span>
            <span>: {details?.ServiceRequestStatus}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">SLA Duration (In Hrs)</span>
            <span>: {details?.SLAHoursInHrs}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">SLA Reminder before (In Hrs)</span>
            <span>: {details?.SLAReminderbeforeInHrs}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Resolution time (In Hrs)</span>
            <span>: {details?.ResolutionTimeInHrs || "-"}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Resolved Date & time</span>
            <span>: {details?.ResolvedDateTime || "-"}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">Closed date & time</span>
            <span>: {details?.ClosedDateTime || "-"}</span>
          </div>
          <div className="flex mb-2">
            <span className="w-56 font-semibold">SLA Status</span>
            <span>: {details?.SLAStatus || "-"}</span>
          </div>
        </div>
      </div>
        {/* (your existing grid of request details here – unchanged) */}
        {/* Assets */}
        <div className="mb-8">
          <h3 className="font-semibold mb-2">
            List of Asset details mapped with Service Request
          </h3>
          {assets?.length > 0 ? (
            <ReusableTable data={dataSource} columns={cols} />
          ) : (
            <p className="text-red-500">NO DATA IS AVAILABLE</p>
          )}
        </div>

        {/* History */}
<div>
  <h3 className="font-semibold mb-2">Service Request History</h3>
  <ul className="border border-gray-300 rounded divide-y divide-gray-300">
    {comments.map((comment: string, idx: number) => (
      <li
        key={idx}
        className="py-2 px-3"
        dangerouslySetInnerHTML={{ __html: comment }}
      />
    ))}
  </ul>
</div>
 

      </div>
    </div>
  );
};

export default ServiceRequestReport;
