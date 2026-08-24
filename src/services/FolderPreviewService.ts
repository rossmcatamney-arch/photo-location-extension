import type {
    ProjectFile,
} from "../models/ProjectFile";

import type {
    FolderPreview,
} from "../models/FolderPreview";

export class FolderPreviewService {

    buildPreview(
        files: ProjectFile[]
    ): FolderPreview {

        const imageFiles =
            files.filter(
                file => {

                    const lower =
                        file.name.toLowerCase();

                    return (
                        lower.endsWith(".jpg") ||
                        lower.endsWith(".jpeg") ||
                        lower.endsWith(".png")
                    );

                }
            );

        const jpgCount =
            imageFiles.filter(
                file =>
                    file.name
                        .toLowerCase()
                        .endsWith(".jpg")
            ).length;

        const jpegCount =
            imageFiles.filter(
                file =>
                    file.name
                        .toLowerCase()
                        .endsWith(".jpeg")
            ).length;

        const pngCount =
            imageFiles.filter(
                file =>
                    file.name
                        .toLowerCase()
                        .endsWith(".png")
            ).length;

        return {

            imageCount:
                imageFiles.length,

            jpgCount,

            jpegCount,

            pngCount,

            sampleFiles:
                imageFiles
                    .slice(0, 5)
                    .map(
                        file => file.name
                    ),

        };

    }

}

export const
    folderPreviewService =
        new FolderPreviewService();