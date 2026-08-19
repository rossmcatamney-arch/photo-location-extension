import { useState } from "react";

interface Props {
  onLoaded: (
    content: string
  ) => void;
}

export function ImportPanel({
  onLoaded,
}: Props) {
  const [fileName, setFileName] =
    useState<string>("");

  const [recordCount, setRecordCount] =
    useState<number>(0);

  const [status, setStatus] =
    useState<string>("Ready");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setStatus("Loading CSV...");
      setFileName(file.name);

      const text =
        await file.text();

      const rows =
        text
          .split(/\r?\n/)
          .filter(
            line =>
              line.trim().length > 0
          );

      setRecordCount(
        Math.max(
          0,
          rows.length - 1
        )
      );

      onLoaded(text);

      setStatus("Loaded");
    }
    catch (error) {
      console.error(error);

      setStatus("Failed");

      setRecordCount(0);
    }
  };

  const clearImport =
    () => {
      setFileName("");
      setRecordCount(0);
      setStatus("Ready");
    };

  return (
    <div
      style={{
        border: "1px solid #444",
        borderRadius: 8,
        padding: 20,
        marginBottom: 20,
      }}
    >
      <h3
        style={{
          marginTop: 0,
        }}
      >
        Import CSV
      </h3>

      <div
        style={{
          display: "flex",
          gap: 10,
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <input
          type="file"
          accept=".csv,.txt"
          onChange={
            handleFileChange
          }
        />

        <button
          onClick={
            clearImport
          }
        >
          Clear
        </button>
      </div>

      <div
        style={{
          marginTop: 16,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        <div>
          <strong>Status:</strong>{" "}
          {status}
        </div>

        <div>
          <strong>File:</strong>{" "}
          {fileName ||
            "None Selected"}
        </div>

        <div>
          <strong>Records:</strong>{" "}
          {recordCount}
        </div>
      </div>
    </div>
  );
}