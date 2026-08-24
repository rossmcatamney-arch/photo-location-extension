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

        const difference =
            Math.abs(
                folderPreview.imageCount -
                csvPreview.rowCount
            );

        const ready =
            difference === 0;

        return {

            imageCount:
                folderPreview.imageCount,

            csvRowCount:
                csvPreview.rowCount,

            difference,

            ready,

            message:
                ready
                    ? "Image count matches CSV row count."
                    : `${difference} record(s) do not match.`,

        };

    }

}

export const
    datasetSummaryService =
        new DatasetSummaryService();