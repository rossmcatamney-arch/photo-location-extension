import type {
    FolderPreview,
} from "../models/FolderPreview";

export interface FolderPreviewPanelProps {

    preview: FolderPreview;

}

export function FolderPreviewPanel({
    preview,
}: FolderPreviewPanelProps) {

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
                Folder Preview
            </strong>

            <div
                style={{
                    marginTop: 8,
                }}
            >
                Images Found:
                {" "}
                {preview.imageCount}
            </div>

            <div>
                JPG Files:
                {" "}
                {preview.jpgCount}
            </div>

            <div>
                JPEG Files:
                {" "}
                {preview.jpegCount}
            </div>

            <div>
                PNG Files:
                {" "}
                {preview.pngCount}
            </div>

            <div
                style={{
                    marginTop: 8,
                }}
            >
                Sample Files:
            </div>

            {
                preview.sampleFiles.map(
                    file => (

                        <div
                            key={file}
                        >
                            {file}
                        </div>

                    )
                )
            }

        </div>

    );

}