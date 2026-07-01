import Image from "next/image";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface SuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDone: () => void;
  actionType?: "publish" | "draft" | "save_changes" | "edit_product" | "archive" | "unarchive" | "publish_action";
}

export function SuccessModal({ open, onOpenChange, onDone, actionType = "publish" }: SuccessModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent showCloseButton={false} className="max-w-sm rounded-[24px] p-8 text-center flex flex-col items-center justify-center gap-6">
        <div className="w-32 h-32 relative">
          <Image src="/svgs/success.svg" alt="Success" fill className="object-contain" />
        </div>
        <div className="space-y-1">
          <h3 className="text-[28px] font-bold text-success-600">Successful!</h3>
          <p className="text-text-950 font-medium">
            {actionType === "draft" ? "Product saved to draft" : actionType === "save_changes" ? "Changes saved" : actionType === "edit_product" ? "Product updated successfully" : actionType === "archive" ? "Product archived" : actionType === "unarchive" ? "Product unarchived" : actionType === "publish_action" ? "Product published" : "Product published"}
          </p>
        </div>
        <button
          onClick={onDone}
          className="w-full rounded-full bg-[#5C00FF] px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#00CC8D] hover:text-text-950 mt-2"
        >
          Done
        </button>
      </DialogContent>
    </Dialog>
  );
}
