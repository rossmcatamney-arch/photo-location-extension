import type {
    CsvPreview,
} from "../models/CsvPreview";

import type {
    PhotoPose,
} from "../models/PhotoPose";

export class CsvPreviewService {

    buildPreview(
        rows: PhotoPose[]
    ): CsvPreview {

        const firstRow =
            rows[0];

        return {

            rowCount:
                rows.length,

            columns: [
                "ImageName",
                "X",
                "Y",
                "Z",
            ],

            firstImage:
                firstRow?.imageName,

        };

    }

}

export const
    csvPreviewService =
        new CsvPreviewService();