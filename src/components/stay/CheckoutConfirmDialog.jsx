import { Dialog } from "@headlessui/react";

const CheckoutConfirmDialog = ({
  open,
  setOpen,
  preview,
  onConfirm
}) => {

  if (!preview) return null;

  const { extraNights, extraAmount } = preview;

  return (
    <Dialog open={open} onClose={() => setOpen(false)} className="relative z-50">

      <div className="fixed inset-0 bg-black/30" />

      <div className="fixed inset-0 flex items-center justify-center p-4">

        <Dialog.Panel className="bg-white rounded-xl p-6 w-full max-w-md">

          <Dialog.Title className="text-lg font-semibold mb-3">
            Extra Charges Detected
          </Dialog.Title>

          <p className="text-sm text-gray-600 mb-4">
            Guest stayed longer than expected.
          </p>

          <div className="bg-gray-50 rounded-lg p-3 mb-4 text-sm space-y-1">
            <p>
              Extra Nights: <b>{extraNights}</b>
            </p>
            <p>
              Extra Charge: <b>₹{extraAmount}</b>
            </p>
          </div>

          <div className="flex justify-end gap-3">

            <button
              onClick={() => setOpen(false)}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>

            <button
              onClick={() => {
                onConfirm();
                setOpen(false);
              }}
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Confirm Checkout
            </button>

          </div>

        </Dialog.Panel>

      </div>
    </Dialog>
  );
};

export default CheckoutConfirmDialog;