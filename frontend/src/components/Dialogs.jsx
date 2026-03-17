import React from "react";

const ConfirmatioDialog = ({ open, setOpen, msg, type, onClick }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">{type === "delete" ? "Delete" : "Restore"} Confirmation</h2>
        <p className="mb-6 text-gray-700">{msg || "Are you sure you want to proceed?"}</p>
        <div className="flex gap-2 justify-end">
          <button
            className="px-4 py-2 rounded bg-gray-300 text-gray-700"
            onClick={() => setOpen(false)}
          >Cancel</button>
          <button
            className={`px-4 py-2 rounded ${type === "delete" ? "bg-red-600 text-white" : "bg-blue-600 text-white"}`}
            onClick={() => {
              console.log('Dialog Confirm Button Clicked');
              onClick && onClick();
              setOpen(false);
            }}
          >Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmatioDialog;
