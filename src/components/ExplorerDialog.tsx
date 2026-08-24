import {
    useState,
} from "react";

import type {
    ProjectFile,
} from "../models/ProjectFile";

export interface ExplorerDialogProps {

    isOpen: boolean;

    title: string;

    items: ProjectFile[];

    onClose: () => void;

    onSelect: (
        item: ProjectFile
    ) => void;

    onExpandFolder?: (
        folder: ProjectFile
    ) => Promise<ProjectFile[]>;

    folderSelection?: boolean;

    fileFilter?: (
        item: ProjectFile
    ) => boolean;

}

export function ExplorerDialog({
    isOpen,
    title,
    items,
    onClose,
    onSelect,
    onExpandFolder,
    folderSelection,
    fileFilter,
}: ExplorerDialogProps) {

    if (!isOpen) {
        return null;
    }

    const [
        expandedFolders,
        setExpandedFolders,
    ] = useState<
        Set<string>
    >(
        new Set()
    );

    const [
        folderContents,
        setFolderContents,
    ] = useState<
        Record<
            string,
            ProjectFile[]
        >
    >({});

    const [
        selectedFolder,
        setSelectedFolder,
    ] = useState<
        ProjectFile | null
    >(
        items.find(
            item =>
                item.type === "folder"
        ) ?? null
    );

    function sortItems(
        items: ProjectFile[]
    ) {

        return [...items].sort(
            (a, b) => {

                const aFolder =
                    a.type === "folder";

                const bFolder =
                    b.type === "folder";

                if (
                    aFolder &&
                    !bFolder
                ) {
                    return -1;
                }

                if (
                    !aFolder &&
                    bFolder
                ) {
                    return 1;
                }

                return a.name.localeCompare(
                    b.name
                );

            }
        );

    }

    const toggleFolder =
        async (
            folder: ProjectFile
        ) => {

            const expanded =
                new Set(
                    expandedFolders
                );

            if (
                expanded.has(
                    folder.id
                )
            ) {

                expanded.delete(
                    folder.id
                );

                setExpandedFolders(
                    expanded
                );

                return;

            }

            expanded.add(
                folder.id
            );

            setExpandedFolders(
                expanded
            );

            if (
                !folderContents[
                folder.id
                ] &&
                onExpandFolder
            ) {

                const children =
                    sortItems(
                        await onExpandFolder(
                            folder
                        )
                    );

                setFolderContents(
                    current => ({
                        ...current,
                        [folder.id]:
                            children,
                    })
                );

            }

        };

    const renderNodes = (
        nodes: ProjectFile[],
        level = 0
    ) => {

        const filteredNodes =
            fileFilter
                ? nodes.filter(
                    fileFilter
                )
                : nodes;

        return sortItems(
            filteredNodes
        ).map(
            item => {

                const expanded =
                    expandedFolders.has(
                        item.id
                    );

                const children =
                    folderContents[
                    item.id
                    ] ?? [];

                return (

                    <div
                        key={item.id}
                    >

                        <div
                            className="tree-row"
                            onClick={
                                async () => {

                                    if (
                                        item.type ===
                                        "folder"
                                    ) {

                                        setSelectedFolder(
                                            item
                                        );

                                        await toggleFolder(
                                            item
                                        );

                                        return;

                                    }

                                    onSelect(
                                        item
                                    );

                                    onClose();

                                }
                            }
                            style={{
                                display: "flex",
                                alignItems: "center",
                                padding: "6px 8px",
                                marginLeft:
                                    level * 32,
                                cursor: "pointer",
                                borderRadius: 4,
                                backgroundColor:
                                    selectedFolder?.id === item.id
                                        ? "#dceeff"
                                        : "transparent",

                                border:
                                    selectedFolder?.id === item.id
                                        ? "1px solid #7fb8ff"
                                        : "1px solid transparent",
                            }}
                        >

                            <span
                                style={{
                                    display: "inline-block",
                                    width: 40,
                                }}
                            >
                                {
                                    item.type === "folder"
                                        ? (
                                            expanded
                                                ? "[-]"
                                                : "[+]"
                                        )
                                        : ""
                                }
                            </span>

                            {
                                item.type ===
                                    "folder"
                                    ? "📁 "
                                    : "📄 "
                            }

                            {item.name}

                        </div>

                        {
                            expanded &&
                            children.length > 0 &&
                            renderNodes(
                                children,
                                level + 1
                            )
                        }

                    </div>

                );

            }
        );

    };

    return (

        <div
            onClick={onClose}
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor:
                    "rgba(0,0,0,0.5)",
                zIndex: 1000,
            }}
        >

            <div
                onClick={(e) =>
                    e.stopPropagation()
                }
                style={{
                    background: "#ffffff",
                    width: "900px",
                    height: "80vh",
                    margin: "40px auto",
                    padding: "20px",
                    borderRadius: "8px",
                    boxShadow:
                        "0 4px 16px rgba(0,0,0,0.25)",
                    display: "flex",
                    flexDirection: "column",
                }}
            >

                <h3>
                    {title}
                </h3>
                {
                    folderSelection && (
                        <div
                            style={{
                                marginBottom: 12,
                                padding: "8px 12px",
                                background: "#f5f5f5",
                                border: "1px solid #ddd",
                                borderRadius: 4,
                                fontSize: "0.9rem",
                            }}
                        >
                            Selected Folder:
                            {" "}
                            <div
                                style={{
                                    marginTop: 4,
                                    color: "#333",
                                    fontWeight: 500,
                                    wordBreak: "break-word",
                                }}
                            >
                                {
                                    selectedFolder?.path?.replaceAll(
                                        "/",
                                        " > "
                                    ) ??
                                    "No folder selected"
                                }
                            </div>

                        </div>
                    )
                }
                <div
                    style={{
                        border: "1px solid #ddd",
                        borderRadius: 4,
                        padding: 16,
                        flex: 1,
                        minHeight: 0,
                        overflowY: "auto",
                    }}
                >
                    {renderNodes(
                        items
                    )}
                </div>

                <div
                    style={{
                        marginTop: 20,
                        display: "flex",
                        justifyContent:
                            "space-between",
                        flexShrink: 0,
                    }}
                >

                    <button
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    {
                        folderSelection && (

                            <button
                                disabled={
                                    !selectedFolder ||
                                    selectedFolder.type !== "folder"
                                }
                                onClick={() => {

                                    if (
                                        selectedFolder
                                    ) {

                                        onSelect(
                                            selectedFolder
                                        );

                                        onClose();

                                    }

                                }}
                            >
                                Select Folder
                            </button>

                        )
                    }

                </div>

            </div>

        </div>

    );

}