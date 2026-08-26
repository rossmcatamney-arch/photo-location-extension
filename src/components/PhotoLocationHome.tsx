import {
  useEffect,
  useState,
} from "react";

import {
    COORDINATE_SYSTEMS,
} from "../services/CoordinateSystemDatabase";

import {
  PhotoMapPanel,
} from "./PhotoMapPanel";

import {
  PhotoListPanel,
} from "./PhotoListPanel";

import {
  SelectedPhotoPanel,
} from "./SelectedPhotoPanel";

import {
  ImageViewerModal,
} from "./ImageViewerModal";

import {
  folderPreviewService,
} from "../services/FolderPreviewService";

import type {
  FolderPreview,
} from "../models/FolderPreview";

import {
  FolderPreviewPanel,
} from "./FolderPreviewPanel";

import type {
  PhotoLocationConfiguration,
} from "../models/PhotoLocationConfiguration";

import type {
  CsvPreview,
} from "../models/CsvPreview";

import {
  csvPreviewService,
} from "../services/CsvPreviewService";

import {
  CsvPreviewPanel,
} from "./CsvPreviewPanel";

import type {
  PhotoMatchingResult,
} from "../models/PhotoMatchingResult";

import type {
  PhotoNode,
} from "../models/PhotoNode";

import type {
  ProjectFile,
} from "../models/ProjectFile";

import {
  photoLocationConfigurationService,
} from "../services/PhotoLocationConfigurationService";

import {
  trimbleProjectFilesService,
} from "../services/TrimbleProjectFilesService";

import {
  CsvService,
} from "../services/CsvService";

import {
  photoMatchingService,
} from "../services/PhotoMatchingService";

import {
  workspaceService,
} from "../services/WorkspaceService";

import {
  ExplorerDialog,
} from "./ExplorerDialog";

import type {
  DatasetSummary,
} from "../models/DatasetSummary";

import {
  datasetSummaryService,
} from "../services/DatasetSummaryService";

import {
  DatasetSummaryPanel,
} from "./DatasetSummaryPanel";

const APP_VERSION =
  "DEV-V30.0";

export interface PhotoLocationHomeProps {
  projectName: string;
  projectId: string;
}

export function PhotoLocationHome({
  projectName,
  projectId,
}: PhotoLocationHomeProps) {

  const [
    searchText,
    setSearchText,
  ] = useState("");

  const [
    selectedPhoto,
    setSelectedPhoto,
  ] = useState<PhotoNode | null>(
    null
  );

  function getDistance(
    a: PhotoNode,
    b: PhotoNode
  ): number {

    const dx = a.x - b.x;
    const dy = a.y - b.y;
    const dz = a.z - b.z;

    return Math.sqrt(
      dx * dx +
      dy * dy +
      dz * dz
    );

  }

  const [
    selectedPhotoUrl,
    setSelectedPhotoUrl,
  ] = useState("");

  const [
    showImageViewer,
    setShowImageViewer,
  ] = useState(false);


  const [
    basemap,
    setBasemap,
  ] = useState(
    "street"
  );

  const [
    configuration,
    setConfiguration,
  ] = useState<PhotoLocationConfiguration>({
    projectId,

    photosFolderId: "",
    photosFolderPath: "",

    poseCsvFileId: "",
    poseCsvName: "",

    coordinateSystem:
      "LOCAL",
  });

  const [
    saveStatus,
    setSaveStatus,
  ] = useState("");

  const [
    discoveryStatus,
    setDiscoveryStatus,
  ] = useState("");

  const [
    matchingResult,
    setMatchingResult,
  ] =
    useState<PhotoMatchingResult | null>(
      null
    );

  const [
    photoNodes,
    setPhotoNodes,
  ] = useState<PhotoNode[]>([]);

  const [
    folderPreview,
    setFolderPreview,
  ] = useState<
    FolderPreview | null
  >(
    null
  );

  const [
    csvPreview,
    setCsvPreview,
  ] = useState<
    CsvPreview | null
  >(
    null
  );

  const [
    datasetSummary,
    setDatasetSummary,
  ] = useState<
    DatasetSummary | null
  >(
    null
  );

  const [
    extraImageCount,
    setExtraImageCount,
  ] = useState(0);

  const [
    missingImageCount,
    setMissingImageCount,
  ] = useState(0);


  // Legacy discovery lists removed.
  // ExplorerDialog now uses rootItems.

  useEffect(() => {

    setDatasetSummary(

      datasetSummaryService
        .buildSummary(
          folderPreview,
          csvPreview
        )

    );

  }, [
    folderPreview,
    csvPreview,
  ]);

  const [
    rootItems,
    setRootItems,
  ] = useState<ProjectFile[]>([]);

  const [
    browserItems,
    setBrowserItems,
  ] = useState<ProjectFile[]>([]);

  const [
    showFolderBrowser,
    setShowFolderBrowser,
  ] = useState(false);


  const [
    showFileBrowser,
    setShowFileBrowser,
  ] = useState(false);

  useEffect(() => {

    if (!projectId) {
      return;
    }

    const existing =
      photoLocationConfigurationService.load(
        projectId
      );

    if (existing) {

      setConfiguration({
        ...existing,
        coordinateSystem:
          existing.coordinateSystem ??
          "LOCAL",
      });

    }

  }, [projectId]);

  const openFolderBrowser =
    async () => {

      try {

        const itemsToDisplay =
          rootItems.length === 0
            ? await trimbleProjectFilesService
              .getRootItems(
                projectId
              )
            : rootItems;

        if (
          rootItems.length === 0
        ) {

          setRootItems(
            itemsToDisplay
          );

        }

        setBrowserItems(
          itemsToDisplay
        );

        setShowFolderBrowser(
          true
        );

      }
      catch (error) {

        console.error(
          error
        );

      }

    };

  const filteredPhotos =
    photoNodes.filter(
      photo =>
        photo.imageName
          .toLowerCase()
          .includes(
            searchText.toLowerCase()
          )
    );

  const selectedPhotoIndex =
    selectedPhoto
      ? filteredPhotos.findIndex(
        photo =>
          photo.id ===
          selectedPhoto.id
      )
      : -1;

  const nearestStations =
    selectedPhoto
      ? photoNodes
        .filter(
          photo =>
            photo.id !==
            selectedPhoto.id
        )
        .map(photo => ({
          photo,
          distance:
            getDistance(
              selectedPhoto,
              photo
            )
        }))
        .sort(
          (a, b) =>
            a.distance -
            b.distance
        )
        .slice(0, 5)
      : [];

  useEffect(() => {

    if (!selectedPhoto) {

      setSelectedPhotoUrl("");

      return;
    }

    const photo = selectedPhoto;

    async function loadImage() {


      try {

        const imageUrl =
          await trimbleProjectFilesService
            .getImageUrl(
              projectId,
              photo.imageId
            );

        console.log(
          "IMAGE URL",
          imageUrl
        );

        setSelectedPhotoUrl(
          imageUrl
        );


      }
      catch (error) {

        console.error(
          "Failed to load image",
          error
        );
      }
    }

    loadImage();

  }, [
    selectedPhoto,
    projectId,
  ]);

  const openFileBrowser =
    async () => {

      try {

        const itemsToDisplay =
          rootItems.length === 0
            ? await trimbleProjectFilesService
              .getRootItems(
                projectId
              )
            : rootItems;

        if (
          rootItems.length === 0
        ) {

          setRootItems(
            itemsToDisplay
          );

        }

        setBrowserItems(
          itemsToDisplay
        );

        setShowFileBrowser(
          true
        );

      }
      catch (error) {

        console.error(
          error
        );

      }

    };

  const saveConfiguration =
    () => {

      const updated = {
        ...configuration,
        projectId,
      };

      photoLocationConfigurationService.save(
        updated
      );

      setSaveStatus(
        "✓ Configuration Saved"
      );
    };

  const validateMatching =
    async () => {

      try {

        setDiscoveryStatus(
          "Loading CSV..."
        );

        const csvContent =
          await trimbleProjectFilesService
            .loadCsvContentById(
              projectId,
              configuration.poseCsvFileId
            );

        const poses =
          CsvService.parse(
            csvContent
          );

        console.log(
          "FIRST CSV IMAGE",
          poses[0]?.imageName
        );

        setDiscoveryStatus(
          "Loading images..."
        );

        const imageFiles =
          await trimbleProjectFilesService
            .discoverImagesInFolder(
              configuration.photosFolderId
            );

        console.log(
          "FIRST FOLDER IMAGE",
          imageFiles[0]?.name
        );
        console.log(
          "POSE COUNT",
          poses.length
        );

        console.log(
          "IMAGE COUNT",
          imageFiles.length
        );

        const normalizeName = (
          name: string
        ) =>
          name
            .replace(/\\/g, "/")
            .split("/")
            .pop()
            ?.toLowerCase() ?? "";

        const poseNames = new Set(
          poses.map(p =>
            normalizeName(
              p.imageName
            )
          )
        );


        const imageNames = new Set(
          imageFiles.map(i =>
            normalizeName(
              i.name
            )
          )
        );

        const extraImages =
          imageFiles.filter(
            image =>
              !poseNames.has(
                normalizeName(image.name)
              )
          );

        const missingImages =
          poses.filter(
            pose =>
              !imageNames.has(
                normalizeName(
                  pose.imageName
                )
              )
          );

        console.log(
          "EXTRA IMAGES",
          extraImages
        );

        console.log(
          "MISSING IMAGES",
          missingImages
        );

        setExtraImageCount(
          extraImages.length
        );

        setMissingImageCount(
          missingImages.length
        );

        console.log(
          "EXTRA IMAGE COUNT",
          extraImages.length
        );

        console.log(
          "MISSING IMAGE COUNT",
          missingImages.length
        );

        console.log(
          "EXTRA IMAGES",
          extraImages
        );

        console.log(
          "MISSING IMAGES",
          missingImages
        );

        console.log(
          "FIRST IMAGE",
          imageFiles[0]
        );

        const result =
          photoMatchingService.matchPhotos(
            poses,
            imageFiles
          );

        console.log(
          "Missing Records",
          result.records.filter(
            record =>
              record.imageStatus !== "available"
          )
        );

        const nodes =
          result.records
            .filter(
              record =>
                record.image &&
                record.imageStatus ===
                "available"
            )
            .map(
              record => ({
                id:
                  record.image!.id,

                imageId:
                  record.image!.id,

                imageName:
                  record.image!.name,

                x:
                  record.pose.x,

                y:
                  record.pose.y,

                z:
                  record.pose.z,

                yaw:
                  record.pose.yaw,

                pitch:
                  record.pose.pitch,

                roll:
                  record.pose.roll,
              })
            );

        console.log(
          "PHOTO NODE COUNT",
          nodes.length
        );

        console.log(
          "FIRST PHOTO NODE",
          nodes[0]
        );

        setPhotoNodes(
          nodes
        );

        if (nodes.length > 0) {

          setSelectedPhoto(
            nodes[0]
          );

        }

        setMatchingResult(
          result
        );

        setDiscoveryStatus(
          "Matching complete"
        );
      }
      catch (error) {

        console.error(
          error
        );

        setDiscoveryStatus(
          "Validation failed"
        );
      }
    };

  const testViewerModel =
    async () => {

      const api =
        workspaceService.getApi();

      try {

        const models =
          await api.viewer.getModels();

        console.log(
          "MODELS",
          models
        );

      }
      catch (error) {

        console.error(
          "MODEL ERROR",
          error
        );

      }

    };

  const testViewerMethods =
    async () => {

      const api =
        workspaceService.getApi();

      console.log(
        "GET CAMERA",
        api.viewer.getCamera
      );

      console.log(
        "SET CAMERA",
        api.viewer.setCamera
      );

      console.log(
        "ADD PANORAMA",
        api.viewer.addPanorama
      );

      console.log(
        "GET MODELS",
        api.viewer.getModels
      );

      console.log(
        "GET LOADED MODEL",
        api.viewer.getLoadedModel
      );

    };

  const testWorkspaceContext =
    async () => {

      const api =
        workspaceService.getApi();

      console.log(
        "API KEYS",
        Object.keys(api)
      );

      console.log(
        "VIEW API",
        api.view
      );

      console.log(
        "VIEW KEYS",
        api.view
          ? Object.keys(api.view)
          : "No View API"
      );

      try {

        const currentView =
          await api.view.getCurrentView();

        console.log(
          "CURRENT VIEW",
          currentView
        );

      } catch (error) {

        console.error(
          "CURRENT VIEW ERROR",
          error
        );

      }

      try {

        const project =
          await api.project.getCurrentProject();

        console.log(
          "CURRENT PROJECT",
          project
        );

      } catch (error) {

        console.error(
          "PROJECT ERROR",
          error
        );

      }
    };

  const testGoToViewer =
    async () => {

      const api =
        workspaceService.getApi();

      try {

        const result =
          await api.extension.goTo(
            "viewer"
          );

        console.log(
          "GO TO RESULT",
          result
        );

      } catch (error) {

        console.error(
          "GO TO ERROR",
          error
        );

      }
    };

  const testHost =
    async () => {

      const api =
        workspaceService.getApi();

      try {

        const host =
          await api.extension.getHost();

        console.log(
          "HOST JSON",
          JSON.stringify(
            host,
            null,
            2
          )
        );

        try {

          const focused =
            await api.extension
              .requestFocus();

          console.log(
            "REQUEST FOCUS",
            focused
          );

        }
        catch (error) {

          console.error(
            "FOCUS ERROR",
            error
          );

        }

        console.log(
          "HOST OBJECT",
          host
        );

      } catch (error) {

        console.error(
          "HOST ERROR",
          error
        );

      }
    };

  const testPermission =
    async () => {

      const api =
        workspaceService.getApi();

      try {

        const permission =
          await api.extension.getPermission();

        console.log(
          "PERMISSION",
          permission
        );

      } catch (error) {

        console.error(
          "PERMISSION ERROR",
          error
        );

      }
    };

  const testViewerApi =
    async () => {

      const api =
        workspaceService.getApi();

      console.log(
        "VIEWER API",
        api.viewer
      );

      console.log(
        "VIEWER KEYS",
        api.viewer
          ? Object.keys(
            api.viewer
          )
          : "NO VIEWER API"
      );

    };

  return (
    <>
      <div
        style={{
          border: "1px solid #444",
          borderRadius: 8,
          padding: 20,
          marginBottom: 20,
        }}
      >

        <h2>
          Photo Location
        </h2>

        <div
          style={{
            color: "#666",
            fontSize: "0.9rem",
            marginBottom: 20,
          }}
        >
          Developer Build: {APP_VERSION}
        </div>

        <div
          style={{
            marginBottom: 20,
          }}
        >

          <strong>
            Current Project
          </strong>

          <div>
            {projectName}
          </div>
        </div>

        {discoveryStatus && (
          <div
            style={{
              marginBottom: 20,
              color: "#0066cc",
            }}
          >
            {discoveryStatus}
          </div>
        )}

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <strong>
            Pose CSV
          </strong>

          <div
            style={{
              marginTop: 8,
              padding: 12,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "#f5f5f5",
            }}
          >
            {configuration.poseCsvName ||
              "No CSV selected"}
          </div>

          <div
            style={{
              marginTop: 8,
            }}
          >
            <button
              onClick={
                openFileBrowser
              }
            >
              Browse CSV
            </button>
          </div>
          {
            csvPreview && (

              <CsvPreviewPanel
                preview={
                  csvPreview
                }
              />

            )
          }
        </div>

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <strong>
            Photos Folder
          </strong>

          <div
            style={{
              marginTop: 8,
              padding: 12,
              border: "1px solid #ccc",
              borderRadius: 4,
              background: "#f5f5f5",
            }}
          >
            {configuration.photosFolderPath ||
              "No folder selected"}
          </div>

          <div
            style={{
              marginTop: 8,
            }}
          >
            <button
              onClick={
                openFolderBrowser
              }
            >
              Browse Folder
            </button>
          </div>
          {
            folderPreview && (

              <FolderPreviewPanel
                preview={
                  folderPreview
                }
              />

            )
          }
        </div>

        <div
          style={{
            marginBottom: 20,
          }}
        >
          <strong>
            Coordinate System
          </strong>

          <div
            style={{
              marginTop: 8,
            }}
          >
            <select
              value={
                configuration.coordinateSystem
              }
              onChange={event =>
                setConfiguration({
                  ...configuration,
                  coordinateSystem:
                    event.target.value,
                })
              }
            >
              <option value="LOCAL">
                Local Coordinates
              </option>

              {
                COORDINATE_SYSTEMS.map(system => (
                  <option
                    key={system.code}
                    value={system.code}
                  >
                    {system.name}
                  </option>
                ))
              }
            </select>
          </div>
        </div>

        {
          datasetSummary && (

            <DatasetSummaryPanel
              summary={
                datasetSummary
              }
            />

          )
        }

        <div
          style={{
            display: "flex",
            gap: 10,
            marginTop: 15,
          }}
        >
          <button
            onClick={
              saveConfiguration
            }
          >
            Save Configuration
          </button>

          <button
            onClick={
              validateMatching
            }
            disabled={
              !configuration.photosFolderId ||
              !configuration.poseCsvFileId
            }
          >
            Validate Matching
          </button>
        </div>

        <button
          onClick={
            testWorkspaceContext
          }
          disabled={
            photoNodes.length === 0
          }
        >
          Test Workspace Context
        </button>

        <button
          onClick={
            testHost
          }
        >
          Test Host
        </button>

        <button
          onClick={
            testGoToViewer
          }
        >
          Go To Viewer
        </button>

        <button onClick={testPermission}>
          Test Permission
        </button>

        <button
          onClick={
            testViewerApi
          }
        >
          Test Viewer API
        </button>

        <button
          onClick={
            testViewerMethods
          }
        >
          Test Viewer Methods
        </button>

        <button
          onClick={
            testViewerModel
          }
        >
          Test Viewer Models
        </button>

        {saveStatus && (
          <div
            style={{
              marginTop: 12,
              color: "#008000",
            }}
          >
            {saveStatus}
          </div>
        )}

        {matchingResult && (
          <div
            style={{
              marginTop: 20,
              padding: 20,
              border: "1px solid #ccc",
              borderRadius: 8,
              background: "#f9f9f9",

            }}
          >

            <PhotoMapPanel
              basemap={basemap}
              onBasemapChange={setBasemap}
              photoNodes={photoNodes}
              selectedPhoto={selectedPhoto}
              coordinateSystem={
                configuration.coordinateSystem
              }
              onPhotoSelected={setSelectedPhoto}
            />

            {photoNodes.length > 0 && (

              <div
                style={{
                  display: "flex",
                  gap: 20,
                  marginTop: 20,
                  alignItems: "flex-start",
                }}
              >

                <PhotoListPanel
                  searchText={searchText}
                  onSearchTextChange={setSearchText}
                  photoNodes={filteredPhotos}
                  selectedPhotoId={selectedPhoto?.id}
                  onPhotoSelected={setSelectedPhoto}
                />

                {selectedPhoto && (
                  <>
                    <SelectedPhotoPanel
                      selectedPhoto={selectedPhoto}
                      selectedPhotoUrl={selectedPhotoUrl}
                      selectedPhotoIndex={selectedPhotoIndex}
                      totalPhotos={filteredPhotos.length}
                      onPrevious={() =>
                        setSelectedPhoto(
                          filteredPhotos[
                          selectedPhotoIndex - 1
                          ]
                        )
                      }
                      onNext={() =>
                        setSelectedPhoto(
                          filteredPhotos[
                          selectedPhotoIndex + 1
                          ]
                        )
                      }
                      onOpenViewer={() =>
                        setShowImageViewer(true)
                      }
                    />

                    <div
                      style={{
                        width: 300,
                        padding: 12,
                        border: "1px solid #ccc",
                        borderRadius: 8,
                        background: "#fafafa",
                      }}
                    >
                      <h3>Nearby Stations</h3>

                      {nearestStations.map(
                        station => (
                          <div
                            key={station.photo.id}
                            onClick={() =>
                              setSelectedPhoto(
                                station.photo
                              )
                            }
                            style={{
                              padding: 8,
                              borderBottom:
                                "1px solid #eee",
                              cursor: "pointer",
                            }}
                          >
                            <div>
                              {station.photo.imageName}
                            </div>

                            <div
                              style={{
                                color: "#666",
                                fontSize: "0.85rem",
                              }}
                            >
                              {station.distance.toFixed(2)} m
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </>
                )}

              </div>

            )}

            <h3>
              Dataset Validation
            </h3>

            <div>
              CSV Records: {matchingResult.totalPoses}
            </div>

            <div>
              Matched Photos: {matchingResult.availableImages}
            </div>

            <div>
              Missing Images: {missingImageCount}
            </div>

            <div>
              Extra Images: {extraImageCount}
            </div>

            <div
              style={{
                marginTop: 10,
                padding: 10,
                background:
                  missingImageCount === 0
                    ? "#e8f5e9"
                    : "#fff3cd",
                borderRadius: 4,
                fontWeight: "bold",
              }}
            >
              {missingImageCount === 0
                ? extraImageCount > 0
                  ? `✅ Data Validated - All CSV photo records matched successfully. ${extraImageCount} additional panorama image(s) in the folder are not referenced by the CSV and have been ignored.`
                  : "✅ Data Validated - All CSV photo records matched successfully."
                : `⚠ ${missingImageCount} CSV record(s) could not be matched to an image.`}
            </div>
          </div>
        )}

      </div >

      <ExplorerDialog
        isOpen={
          showFolderBrowser
        }
        title="Select Photos Folder"
        items={browserItems}
        folderSelection={true}
        fileFilter={item => {

          if (
            item.type === "folder"
          ) {
            return true;
          }

          const lower =
            item.name.toLowerCase();

          return (
            lower.endsWith(".jpg") ||
            lower.endsWith(".jpeg") ||
            lower.endsWith(".png")
          );

        }}

        onClose={() =>
          setShowFolderBrowser(
            false
          )
        }
        onSelect={async (
          folder
        ) => {

          setConfiguration({
            ...configuration,

            photosFolderId:
              folder.id,

            photosFolderPath:
              folder.path,
          });

          const files =
            await trimbleProjectFilesService
              .discoverImagesInFolder(
                folder.id
              );

          setFolderPreview(
            folderPreviewService
              .buildPreview(
                files
              )
          );

        }}
        onExpandFolder={
          folder =>
            trimbleProjectFilesService
              .getFolderChildren(
                folder.id,
                folder.path
              )
        }

      />

      <ExplorerDialog
        isOpen={
          showFileBrowser
        }
        title="Select Pose CSV"
        fileFilter={item => {

          if (
            item.type === "folder"
          ) {
            return true;
          }

          return item.name
            .toLowerCase()
            .endsWith(".csv");

        }}
        items={browserItems}
        folderSelection={false}
        onClose={() =>
          setShowFileBrowser(
            false
          )
        }
        onSelect={async (
          file
        ) => {

          setConfiguration({
            ...configuration,

            poseCsvFileId:
              file.id,

            poseCsvName:
              file.name,
          });

          const csvContent =
            await trimbleProjectFilesService
              .loadCsvContentById(
                projectId,
                file.id
              );

          const rows =
            CsvService.parse(
              csvContent
            );

          setCsvPreview(
            csvPreviewService
              .buildPreview(
                rows
              )
          );

        }}
        onExpandFolder={
          folder =>
            trimbleProjectFilesService
              .getFolderChildren(
                folder.id,
                folder.path
              )
        }
      />
      <ImageViewerModal
        isOpen={
          showImageViewer &&
          !!selectedPhoto &&
          !!selectedPhotoUrl
        }
        imageUrl={selectedPhotoUrl}
        photoName={
          selectedPhoto?.imageName ?? ""
        }
        selectedPhotoIndex={
          selectedPhotoIndex
        }
        totalPhotos={filteredPhotos.length}
        onPrevious={() =>
          setSelectedPhoto(
            filteredPhotos[
            selectedPhotoIndex - 1
            ]
          )
        }
        onNext={() =>
          setSelectedPhoto(
            filteredPhotos[
            selectedPhotoIndex + 1
            ]
          )
        }
        onClose={() =>
          setShowImageViewer(false)
        }
      />
    </>

  );
}