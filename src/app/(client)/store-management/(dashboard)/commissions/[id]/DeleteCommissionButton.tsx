"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";
import { deleteCommissionAction } from "../../actions";
import ConfirmModal from "@/components/store-management/ConfirmModal";
import { toast } from "sonner";

export default function DeleteCommissionButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const confirmDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteCommissionAction(id);
      setIsModalOpen(false);
      toast.success("Commission deleted successfully");
      router.push("/store-management");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete commission");
      setIsDeleting(false);
    }
  };

  const handleDeleteClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="w-full border border-red-200 px-6 py-4 font-sans text-[0.55rem] font-bold tracking-[0.2em] uppercase transition-colors bg-white text-red-600 hover:bg-red-50 hover:border-red-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isDeleting ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Trash2 className="w-3.5 h-3.5" />
        )}
        {isDeleting ? "Deleting..." : "Delete Commission"}
      </button>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Delete Commission"
        message="Are you sure you want to delete this commission? This action is permanent and cannot be undone."
        confirmText="Delete"
        requireString="DELETE"
        isConfirming={isDeleting}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
