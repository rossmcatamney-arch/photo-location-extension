import type {
    DatasetSummary,
} from "../models/DatasetSummary";

export interface DatasetSummaryPanelProps {

    summary: DatasetSummary;

}

export function DatasetSummaryPanel({
    summary,
}: DatasetSummaryPanelProps) {

    return (

        <div
            style={{
                marginTop: 20,
                padding: 12,
                border: "1px solid #ddd",
                borderRadius: 4,
                background:
                    summary.ready
                        ? "#f0fff0"
                        : "#fff8e6",
            }}
        >

            <strong>
                Dataset Summary
            </strong>

            <div
                style={{
                    marginTop: 8,
                }}
            >
                Images Found:
                {" "}
                {summary.imageCount}
            </div>

            <div>
                CSV Records:
                {" "}
                {summary.csvRowCount}
            </div>

            <div>
                Difference:
                {" "}
                {summary.difference}
            </div>

            <div
                style={{
                    marginTop: 8,
                    fontWeight: 600,
                }}
            >
                {
                    summary.ready
                        ? "✅ Ready to Validate"
                        : `⚠ Count Mismatch (${summary.difference})`
                }
            </div>

            <div>
                {summary.message}
            </div>

        </div>

    );

}