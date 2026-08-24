import type {
    DatasetSummary,
} from "../models/DatasetSummary";

import type {
    FolderPreview,
} from "../models/FolderPreview";

import type {
    CsvPreview,
} from "../models/CsvPreview";

export class DatasetSummaryService {

    buildSummary(
        folderPreview:
            FolderPreview | null,
        csvPreview:
            CsvPreview | null
    ): DatasetSummary | null {

        if (
            !folderPreview ||
            !csvPreview
        ) {
            return null;
        }

        const ready =
            folderPreview.imageCount ===
            csvPreview.rowCount;

        return {

            imageCount:
                folderPreview.imageCount,

            csvRowCount:
                csvPreview.rowCount,

            ready,

            message:
                ready
                    ? "Image count matches CSV row count."
                    : "Image count does not match CSV row count.",

        };

    }

}

export const
    datasetSummaryService =
        new DatasetSummaryService();