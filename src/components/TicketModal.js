"use client";
import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import html2canvas from "html2canvas";

export default function TicketModal({ event, ticket, onClose }) {
  const ticketRef = useRef();

  const handleDownload = async () => {
    const canvas = await html2canvas(ticketRef.current);
    const link = document.createElement("a");
    link.download = `CCHI_Ticket_${event.title}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-white text-black w-full max-w-md rounded-lg p-6 relative">
        <button onClick={onClose} className="absolute top-2 right-2">❌</button>

        {/* Ticket Card */}
        <div
          ref={ticketRef}
          className="bg-black text-white p-6 rounded-lg text-center space-y-4 border border-white"
        >
          <h2 className="text-2xl font-bold">{event.title}</h2>
          <p>🎟 Ticket for <strong>{ticket.userName || `User #${ticket.userId}`}</strong></p>

          {/* ✅ Fixed QR Code */}
          <QRCodeCanvas
            value={ticket.qrCode || "CCHI_EVENT"}
            size={150}
            className="mx-auto"
          />

          <p className="text-sm text-gray-400">CCHI Official Event Pass</p>
        </div>

        {/* Download Button */}
        <button
          onClick={handleDownload}
          className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-800"
        >
          Download Ticket
        </button>
      </div>
    </div>
  );
}
