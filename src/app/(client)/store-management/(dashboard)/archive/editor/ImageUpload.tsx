"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ImageUploadProps {
  name: string;
  defaultValue?: string;
  onChange?: (url: string) => void;
}

export default function ImageUpload({
  name,
  defaultValue = "",
  onChange,
}: ImageUploadProps) {
  const [url, setUrl] = useState(defaultValue);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    // Create a unique file name
    const fileExt = file.name.split(".").pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
    const filePath = `${fileName}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from("garments")
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from("garments").getPublicUrl(filePath);

      setUrl(data.publicUrl);
      onChange?.(data.publicUrl);
    } catch (error) {
      console.error("Upload error:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    setUrl("");
    onChange?.("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Hidden input to ensure the form submits the URL */}
      <input type="hidden" name={name} value={url} />

      {url ? (
        <div className="relative w-full h-48 border border-black/10 bg-[#FAFAFA] group overflow-hidden">
          <Image
            src={url}
            alt="Uploaded preview"
            fill
            className="object-contain mix-blend-multiply"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-white border border-black/10 p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative w-full h-48 border border-dashed border-black/20 bg-transparent hover:bg-black/[0.02] transition-colors cursor-pointer flex flex-col items-center justify-center gap-3 ${isUploading ? "opacity-50 pointer-events-none" : ""}`}
        >
          {isUploading ? (
            <>
              <Loader2 className="w-6 h-6 text-black/40 animate-spin" />
              <span className="font-sans text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/40">
                Uploading...
              </span>
            </>
          ) : (
            <>
              <Upload className="w-6 h-6 text-black/30" />
              <div className="flex flex-col items-center gap-1">
                <span className="font-sans text-[0.6rem] font-bold tracking-[0.2em] uppercase text-black/60">
                  Click to upload image
                </span>
                <span className="font-sans text-[0.55rem] tracking-[0.1em] text-black/40 uppercase">
                  JPEG, PNG, WEBP
                </span>
              </div>
            </>
          )}
        </div>
      )}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
