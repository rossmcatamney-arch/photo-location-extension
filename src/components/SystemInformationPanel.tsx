import { AppInfo }
  from "../config/AppInfo";

export function SystemInformationPanel() {
  return (
    <div>
      <h2>
        System Information
      </h2>

      <p>
        <strong>Name:</strong>{" "}
        {AppInfo.name}
      </p>

      <p>
        <strong>Version:</strong>{" "}
        {AppInfo.version}
      </p>

      <p>
        <strong>Environment:</strong>{" "}
        {AppInfo.environment}
      </p>

      <p>
        <strong>Build Date:</strong>{" "}
        {AppInfo.buildDate}
      </p>

      <p>
        <strong>URL:</strong>{" "}
        {window.location.href}
      </p>
    </div>
  );
}