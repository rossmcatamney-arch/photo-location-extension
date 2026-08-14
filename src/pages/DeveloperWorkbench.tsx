export function DeveloperWorkbench() {
  return (
    <div
      style={{
        padding: 20,
      }}
    >
      <h1>
        Developer Workbench
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 1fr",
          gap: 20,
        }}
      >
        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2>
            Capability Report
          </h2>

          <p>
            Workspace:
            Unknown
          </p>

          <p>
            Viewer API:
            Unknown
          </p>

          <p>
            Markup API:
            Unknown
          </p>

          <p>
            Project API:
            Unknown
          </p>
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2>
            Event Log
          </h2>

          <p>
            No events captured
          </p>
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2>
            API Explorer
          </h2>

          <button>
            Dump APIs
          </button>
        </div>

        <div
          style={{
            border:
              "1px solid #444",
            borderRadius: 8,
            padding: 20,
          }}
        >
          <h2>
            Marker Lab
          </h2>

          <button>
            Create Marker
          </button>
        </div>
      </div>
    </div>
  );
}