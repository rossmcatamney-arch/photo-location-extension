import type {
    CsvPreview,
} from "../models/CsvPreview";

export interface CsvPreviewPanelProps {

    preview: CsvPreview;

}

export function CsvPreviewPanel({
    preview,
}: CsvPreviewPanelProps) {

    return (

        <div
            style={{
                marginTop: 12,
                padding: 12,
                border:
                    "1px solid #ddd",
                borderRadius: 4,
                background:
                    "#f9f9f9",
            }}
        >

            <strong>
                CSV Preview
            </strong>

            <div
                style={{
                    marginTop: 8,
                }}
            >
                Rows:
                {" "}
                {preview.rowCount}
            </div>

            <div
                style={{
                    marginTop: 8,
                }}
            >
                Columns:
            </div>

            {
                preview.columns.map(
                    column => (

                        <div
                            key={column}
                        >
                            ✓ {column}
                        </div>

                    )
                )
            }

            {
                preview.firstImage && (

                    <div
                        style={{
                            marginTop: 8,
                        }}
                    >
                        First Record:
                        {" "}
                        {preview.firstImage}
                    </div>

                )
            }

        </div>

    );

}