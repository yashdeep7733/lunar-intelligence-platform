import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "motion/react";
import { UploadCloud, FileImage, X } from "lucide-react";
import { toast } from "sonner";

export function UploadCard() {
  const [files, setFiles] = useState<File[]>([]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/png": [".png"], "image/jpeg": [".jpg", ".jpeg"] },
    maxSize: 20 * 1024 * 1024,
    onDrop: (accepted, rejected) => {
      if (rejected.length) {
        toast.error("Some files were rejected", { description: "PNG/JPG up to 20MB." });
      }
      if (accepted.length) {
        setFiles((f) => [...f, ...accepted]);
        toast.success(`${accepted.length} image(s) added`, {
          description: "Ready for analysis (frontend preview only).",
        });
      }
    },
  });

  return (
    <div className="card-surface rounded-2xl p-4 md:p-5">
      <h3 className="text-sm font-semibold">Upload Lunar Image</h3>
      <div
        {...getRootProps()}
        className={`mt-4 flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition-colors ${
          isDragActive ? "border-primary bg-primary/10" : "border-border/60 bg-card/40 hover:border-primary/50"
        }`}
      >
        <input {...getInputProps()} />
        <motion.div
          animate={isDragActive ? { scale: 1.1, y: -4 } : { scale: 1, y: 0 }}
          className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/15 text-primary"
        >
          <UploadCloud className="h-7 w-7" />
        </motion.div>
        <div className="mt-4 text-sm font-semibold">
          {isDragActive ? "Drop your image here" : "Drag & drop your lunar image"}
        </div>
        <div className="mt-1 text-xs text-muted-foreground">or click to browse • PNG, JPG up to 20MB</div>
      </div>

      <AnimatePresence>
        {files.length > 0 && (
          <motion.ul
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 space-y-2"
          >
            {files.map((f, i) => (
              <li key={i} className="flex items-center gap-3 rounded-lg bg-card/60 px-3 py-2 text-xs">
                <FileImage className="h-4 w-4 text-primary" />
                <span className="min-w-0 truncate">{f.name}</span>
                <span className="ml-auto text-muted-foreground">
                  {(f.size / 1024 / 1024).toFixed(2)} MB
                </span>
                <button
                  onClick={() => setFiles((files) => files.filter((_, j) => j !== i))}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
