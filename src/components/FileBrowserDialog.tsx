import type {
  ProjectFile,
} from "../models/ProjectFile";

export interface FileBrowserDialogProps {
  isOpen: boolean;
  files: ProjectFile[];
  onClose: () => void;
  onSelect: (
    file: ProjectFile
  ) => void;
}

export function FileBrowserDialog({
  isOpen,
  files,
  onClose,
  onSelect,
}: FileBrowserDialogProps) {

  if (!isOpen) {
    return null;
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor:
          "rgba(0,0,0,0.5)",
        zIndex: 1000,
      }}
    >
      <div
        onClick={(e) =>
          e.stopPropagation()
        }
        style={{
          background: "#ffffff",
          width: "800px",
          maxHeight: "80vh",
          overflowY: "auto",
          margin: "40px auto",
          padding: "20px",
          borderRadius: "8px",
          boxShadow:
            "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        <h3>
          Select Pose CSV
        </h3>

        <div
          style={{
            marginBottom: 20,
            color: "#666",
          }}
        >
          Select the CSV file
          containing panorama poses.
        </div>

        {files.map((file) => (
          <div
            key={file.id}
            onClick={() => {
              onSelect(file);
              onClose();
            }}
            style={{
              padding: "10px",
              cursor: "pointer",
              borderBottom:
                "1px solid #ddd",
            }}
          >
            📄 {file.name}
          </div>
        ))}

        <div
          style={{
            marginTop: 20,
            display: "flex",
            justifyContent:
              "flex-end",
          }}
        >
          <button
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}