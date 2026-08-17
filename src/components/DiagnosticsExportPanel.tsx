import {
  diagnosticsService,
} from "../services/DiagnosticsService";

import { AppInfo }
  from "../config/AppInfo";

export function DiagnosticsExportPanel() {
  const exportDiagnostics = () => {
    const data = {
      app: AppInfo,

      exported:
        new Date().toISOString(),

      diagnostics:
        diagnosticsService.export(),
    };

    const blob =
      new Blob(
        [
          JSON.stringify(
            data,
            null,
            2
          ),
        ],
        {
          type:
            "application/json",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document.createElement(
        "a"
      );

    link.href = url;

    link.download =
      "photo-location-diagnostics.json";

    link.click();
  };

  return (
    <div>
      <h2>
        Diagnostics
      </h2>

      <button
        onClick={
          exportDiagnostics
        }
      >
        Export Diagnostics
      </button>
    </div>
  );
}