import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

import "maplibre-gl/dist/maplibre-gl.css";

import {
  workspaceService,
} from "./services/WorkspaceService";

workspaceService
  .connect()
  .then(() =>
    console.log(
      "WORKSPACE CONNECTED"
    )
  )
  .catch(error =>
    console.error(
      "WORKSPACE FAILED",
      error
    )
  );

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
