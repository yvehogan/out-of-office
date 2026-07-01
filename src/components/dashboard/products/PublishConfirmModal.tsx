import { Dialog, DialogContent } from "@/components/ui/dialog";
import Image from "next/image";

interface PublishConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  actionType?: "publish" | "draft" | "save_changes" | "edit_product" | "archive" | "unarchive" | "publish_action";
}

export function PublishConfirmModal({ open, onOpenChange, onConfirm, isLoading, actionType = "publish" }: PublishConfirmModalProps) {
  return (
    <Dialog open={open} onOpenChange={!isLoading ? onOpenChange : undefined}>
      <DialogContent className="max-w-md rounded-[24px] p-8 text-center flex flex-col items-center justify-center gap-6 [&>button]:hidden border-0 outline-none">
        {isLoading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-6">
            <div className="w-24 h-24 relative flex items-center justify-center">
              <Image src="/gif/loading-animation.gif" alt="Loading" fill className="object-contain" />
            </div>
            <p className="text-text-600 font-medium animate-pulse">
              {actionType === "draft" ? "Saving to draft..." : actionType === "save_changes" ? "Saving changes..." : actionType === "edit_product" ? "Updating product..." : actionType === "archive" ? "Archiving product..." : actionType === "unarchive" ? "Unarchiving product..." : actionType === "publish_action" ? "Publishing product..." : "Publishing product..."}
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-text-950">
                {actionType === "draft" ? "Save to Draft" : actionType === "save_changes" ? "Save Changes" : actionType === "edit_product" ? "Update Product" : actionType === "archive" ? "Archive Product" : actionType === "unarchive" ? "Unarchive Product" : actionType === "publish_action" ? "Publish Product" : "Publish Product"}
              </h3>
              <p className="text-text-950 text-sm">Are you sure about this?</p>
            </div>
            <div className="flex items-center justify-center gap-4 w-full mt-4">
              <button
                onClick={() => onOpenChange(false)}
                className={`w-1/2 rounded-full border bg-transparent px-5 py-3 text-sm font-semibold transition-all ${
                  actionType === "save_changes" 
                    ? "border-[#00CC8D] text-[#111827] hover:bg-gray-100" 
                    : "border-[#00CC8D] text-success-600 hover:bg-success-600/10"
                }`}
              >
                No
              </button>
              <button
                onClick={onConfirm}
                className="w-1/2 rounded-full bg-[#5C00FF] px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-[#5C00FF]/90"
              >
                Yes
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
