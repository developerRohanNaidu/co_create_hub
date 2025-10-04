"use client";
import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";

export default function ReportModal({ isOpen, onClose, referenceId, referenceType }) {
  const [reasons, setReasons] = useState([]);
  const [selectedReason, setSelectedReason] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) fetchReasons();
  }, [isOpen]);

  const fetchReasons = async () => {
    const res = await apiRequest("/home/getAllReportReasons", "GET");
    if (res.success) {
      setReasons(res.data || []);
    }
  };

  const handleSubmit = async () => {
    if (!selectedReason) {
      alert("Please select a reason");
      return;
    }

    setLoading(true);
    const res = await apiRequest("/home/report", "POST", {
      reasonId: selectedReason,
      reasonText: comment || "",
      referenceId,
      referenceType,
    });

    setLoading(false);

    if (res.success) {
      alert("Report submitted successfully");
      onClose();
    } else {
      alert(res.message || "Failed to submit report");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
      <div className="bg-white w-full max-w-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Report {referenceType}</h2>

        {/* Reasons List */}
        <div className="space-y-2">
          {reasons.map((r) => (
            <label key={r.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="reason"
                value={r.id}
                checked={selectedReason === r.id}
                onChange={() => setSelectedReason(r.id)}
              />
              <span>{r.name}</span>
            </label>
          ))}
        </div>

        {/* Comment Field */}
        <textarea
          placeholder="Additional comments (optional)"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full mt-3 p-2 border rounded"
        />

        {/* Buttons */}
        <div className="flex justify-end gap-2 mt-4">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
          >
            {loading ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
}
