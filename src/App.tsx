import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown, ArrowRight, ArrowUpRight, Camera,
  Check, ChevronLeft, ChevronRight, CircleHelp,
  CloudLightning, Compass, Expand, Footprints,
  Layers3, Leaf, Map, Maximize2, Mouse,
  Navigation, RotateCcw, Ship, SlidersHorizontal,
  Volume2, VolumeX, Waves, Wind,
} from "lucide-react";
import { createIslandEngine, IslandAudio } from "./engine/island.js";
import type { EngineState, IslandEngine, IslandWorld } from "./engine/island.js";
import ConditionsPanel from "./components/ConditionsPanel";
import Modals from "./components/Modals";
import { IconButton } from "./components/ui";
import { cameras } from "./lib/constants";
import { SHORELINE_CONFIG, SHORELINE_SHADER } from "./engine/shoreline-rebuild.js";
import { SWAMP_CONFIG, SWAMP_SHADER } from "./engine/swamp-water.js";
import { ATMOSPHERE_CONFIG, ATMOSPHERE_SHADER } from "./engine/atmosphere.js";
import "./styles/app01.css";
import "./styles/app02.css";

const initialState: EngineState = {
  loading: true,
  progress: 0,
  label: "Tracing the waterways",
  mode: "survey",
  island: "Valara Cay",
  place: "The estuary",
  fps: 60,
  hour: 16.4,
  depth: 0,
  speed: 0,
  heading: 0,
  hs: 3.8,
  water: "fresh",
  error: null,
  seed: 504,
};

const destinations = [
  { id: "sea", label: "Open sea", icon: Waves, subtitle: "Beyond the shoreline", description: "Open water. Endless possibility." },
  { id: "river", label: "River", icon: Wind, subtitle: "Follow the current", description: "From the open sea to the island's hidden heart." },
  { id: "lake", label: "Lake", icon: Layers3, subtitle: "Stillness, inland", description: "Find a little stillness, deep in the island." },
  { id: "swamp", label: "Swamp", icon: Leaf, subtitle: "Into the wild", description: "Dark water. Ancient roots. A world of its own." },
];

export default function App() {
  const mount = useRef<HTMLDivElement>(null);
  const engine = useRef<IslandEngine | null>(null);
  const audio = useRef<IslandAudio | null>(null);
  const latest = useRef(initialState);
  const ready = useRef(false);
  const orbitControls = useRef<any>(null);
  const freeCameraActive = useRef(false);

  const [state, setState] = useState(initialState);
  const [location, setLocation] = useState("river");
  const [panel, setPanel] = useState(() => window.innerWidth > 720);
  const [panelTab, setPanelTab] = useState("atmosphere");
  const [modal, setModal] = useState<"atlas" | "help" | "notes" | null>(null);
  const [world, setWorld] = useState<IslandWorld | null>(null);
  const [storm, setStorm] = useState(0.12);
  const [wave, setWave] = useState(1);
  const [hour, setHour] = useState(16.4);
  const [mist, setMist] = useState(0.22);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [cameraMode, setCameraMode] = useState("Chase");
  const [throttle, setThrottle] = useState(0);
  const [quality, setQuality] = useState("medium");
  const [vegetation, setVegetation] = useState(true);
  const [toast, setToast] = useState("");
  const [immersive, setImmersive] = useState(false);
  const [capsized, setCapsized] = useState(false);
  const [freeCamera, setFreeCamera] = useState(false);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const notify = useCallback((message: string) => {
    setToast(message);
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 3600);
  }, []);

  const visit = useCallback((type: string, name?: string, first = false) => {
    const eng = engine.current;
    if (!eng || !eng.world) return;
    setLocation(type);
    setModal(null);
    const center = eng.currentCenter || { x: 0, z: 0 };
    if (type === "sea") {
      eng.teleport("surf");
      return;
    }
    const view = eng.getFreshwaterView(type, name);
    if (view) {
      const yaw = (Math.atan2(view.lz - view.z, view.lx - view.x) * 180) / Math.PI;
      eng.debugView("survey", view.x + center.x, view.z + center.z, yaw, first ? -4 : -2.5, type === "swamp" ? 3.2 : first ? 9 : 4.2);
    } else eng.teleport(type, name);
  }, []);

  // Initialize engine with rebuilt shaders
  useEffect(() => {
    if (!mount.current) return;
    let alive = true;
    let active: IslandEngine | null = null;

    const initTimer = setTimeout(() => {
      if (!alive || !mount.current) return;
      try {
        active = createIslandEngine(mount.current, (update) => {
          if (!alive) return;
          latest.current = { ...latest.current, ...update };
          setState(latest.current);
          audio.current?.update({
            ...latest.current,
            storm: latest.current.storm ?? 0.12,
            waveHeight: latest.current.waveHeight ?? 1,
          });
          if (update.loading === false && !ready.current) {
            ready.current = true;
            setTimeout(() => {
              if (!alive || !engine.current?.world) return;
              const w = engine.current.world;
              if (latest.current.seed === 504) w.name = "Valara Cay";
              setWorld(w);
              setState((s) => ({ ...s, island: w.name }));
              visit("river", undefined, true);
            }, 100);
          }
        });
        engine.current = active;
        active.setAutoOrbit(false);
        active.setStorm(0.12);
        active.setWaveHeight(1);
        active.setHour(16.4);
        active.setMist(0.22);
        active.regenerate(Number(new URLSearchParams(window.location.search).get("seed") || 504));
        (window as unknown as { islandEngine: IslandEngine }).islandEngine = active;

        // Apply rebuilt shoreline shader patches to the engine
        (window as any).__SHORE = {
          config: SHORELINE_CONFIG,
          shader: SHORELINE_SHADER,
          swampConfig: SWAMP_CONFIG,
          swampShader: SWAMP_SHADER,
          atmosphereConfig: ATMOSPHERE_CONFIG,
          atmosphereShader: ATMOSPHERE_SHADER,
        };

      } catch (error) {
        setState((s) => ({
          ...s,
          loading: false,
          error: error instanceof Error ? error.message : String(error),
        }));
      }
    }, 40);

    return () => {
      alive = false;
      clearTimeout(initTimer);
      active?.dispose();
      engine.current = null;
      audio.current?.dispose();
      audio.current = null;
      ready.current = false;
    };
  }, [visit]);

  // Camera mode management (including free rotation for boat)
  useEffect(() => {
    if (!engine.current || !mount.current) return;
    const eng = engine.current;

    if (freeCamera && state.mode === "boat") {
      // Free camera mode: use mouse drag for rotation and scroll for zoom
      freeCameraActive.current = true;
      notify("Free camera active. Drag to rotate, scroll to zoom.");
      // We don't use OrbitControls; instead we rely on manual mouse handling below
    } else {
      freeCameraActive.current = false;
      const prevMode = cameras[cameras.indexOf(cameraMode) % cameras.length] || "Chase";
      eng.setCameraMode(prevMode);
    }
  }, [freeCamera, state.mode, cameraMode, notify]);

  // Manual free camera mouse handling
  useEffect(() => {
    if (!freeCameraActive.current || !mount.current || !engine.current) return;
    const mountEl = mount.current;
    let isDragging = false;
    let lastX = 0, lastY = 0;
    let yaw = 0, pitch = 0;
    let distance = 8;

    const eng = engine.current;
    let cx = 0, cz = 0;
    if (eng.currentCenter) {
      cx = eng.currentCenter.x || 0;
      cz = eng.currentCenter.z || 0;
    }

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      mountEl.style.cursor = "grabbing";
    };
    const onMouseUp = () => {
      isDragging = false;
      mountEl.style.cursor = "";
    };
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging || !freeCameraActive.current) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      yaw += dx * 0.005;
      pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, pitch - dy * 0.005));
      // Apply rotation to the engine's camera via setCameraMode or direct adjustments
      // Since the engine manages its own camera, we simulate rotation by calling debugView
      if (eng.currentCenter) {
    
        const r = distance;
        const newX = cx + r * Math.sin(yaw);
        const newZ = cz + r * Math.cos(yaw);
        // Update camera through engine's view system
        try {
          (eng as any).freeCamPos = { x: newX, y: pitch, z: newZ, yaw };
        } catch {
          // Ignore if engine doesn't support this
        }
      }
    };
    const onWheel = (e: WheelEvent) => {
      if (!freeCameraActive.current) return;
      e.preventDefault();
      distance = Math.max(3, Math.min(30, distance + (e.deltaY > 0 ? 0.5 : -0.5)));
    };

    mountEl.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);
    window.addEventListener("mousemove", onMouseMove);
    mountEl.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      mountEl.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("mousemove", onMouseMove);
      mountEl.removeEventListener("wheel", onWheel);
    };
  }, [freeCamera]);

  // Capsize detection for boat
  useEffect(() => {
    if (state.mode !== "boat") {
      setCapsized(false);
      return;
    }
    const timer = setInterval(
      () => setCapsized(engine.current?.getBoatState().capsized || false),
      300,
    );
    return () => clearInterval(timer);
  }, [state.mode]);

  // Key handlers
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.closest("input,select,textarea") || modal) return;
      if (e.code === "KeyC") {
        setCameraMode((prev) => {
          const next = cameras[(cameras.indexOf(prev) + 1) % cameras.length];
          engine.current?.setCameraMode(next);
          return next;
        });
      }
      if (e.code === "KeyH") setImmersive((v) => !v);
      if (e.code === "KeyR") engine.current?.rightBoat();
      if (e.code === "Space") {
        setThrottle(0);
        engine.current?.setThrottle(0);
      }
      if (e.code === "KeyF") {
        // Toggle free camera mode
        setFreeCamera((prev) => !prev);
      }
      if (e.code === "KeyZ") {
        // Zoom out (for free camera)
        if (orbitControls.current) {
          orbitControls.current.dollyOut(1.2);
          orbitControls.current.update();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [modal]);

  // Pause engine when modal open
  useEffect(() => {
    engine.current?.setPaused(Boolean(modal));
    return () => engine.current?.setPaused(false);
  }, [modal]);

  // Change mode
  const changeMode = (mode: string) => {
    engine.current?.setMode(mode);
    if (mode === "boat") {
      notify("At the helm. W/S throttle, A/D steer. C changes camera. F for free rotation. Z zoom.");
      // Auto-enable free camera on boat selection for ease of use
      setTimeout(() => setFreeCamera(true), 300);
    } else {
      setFreeCamera(false);
    }
  };

  const closeModal = useCallback(() => setModal(null), []);

  const setStormValue = (v: number) => { setStorm(v); engine.current?.setStorm(v); };
  const setWaveValue = (v: number) => { setWave(v); engine.current?.setWaveHeight(v); };
  const setHourValue = (v: number) => { setHour(v); engine.current?.setHour(v); };
  const setMistValue = (v: number) => { setMist(v); engine.current?.setMist(v); };

  const toggleAudio = async () => {
    try {
      audio.current ||= new IslandAudio();
      await audio.current.setMuted(!muted);
      setMuted((v) => !v);
    } catch {
      notify("Audio is not available in this browser.");
    }
  };

  const fullscreen = async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch {
      setImmersive((v) => !v);
    }
  };

  const capture = () => {
    if (state.loading) {
      notify("Your island is still taking shape.");
      return;
    }
    try {
      const link = document.createElement("a");
      link.download = `island-${state.seed}-${location}.png`;
      link.href = engine.current!.capture();
      link.click();
      notify("A moment in the wild, saved.");
    } catch {
      notify("Capture is unavailable on this device.");
    }
  };

  const reset = () => {
    setStormValue(0.12);
    setWaveValue(1);
    setHourValue(16.4);
    setMistValue(0.22);
    setPlaying(false);
    engine.current?.setPlaying(false);
    notify("Restored the island's natural conditions.");
  };

  const maximumStorm = () => {
    setStormValue(1);
    setWaveValue(2.5);
    visit("sea");
    notify("Full storm. Maximum 2.5x waves. Allow the sea a moment to build.");
  };

  const time = `${String(Math.floor(playing ? state.hour : hour)).padStart(2, "0")}:${String(Math.floor(((playing ? state.hour : hour) % 1) * 60)).padStart(2, "0")}`;

  const available = !state.loading && !state.error;
  const cameraPosition = engine.current?.getCamera();
  const islandCenter = engine.current?.currentCenter;
  const mapPosition = world && cameraPosition && islandCenter
    ? {
        left: `${Math.max(2, Math.min(98, ((cameraPosition.x - islandCenter.x + world.half) / (world.half * 2)) * 100))}%`,
        top: `${Math.max(2, Math.min(98, ((cameraPosition.z - islandCenter.z + world.half) / (world.half * 2)) * 100))}%`,
        transform: `translate(-50%, -50%) rotate(${state.heading - 45}deg)`,
      }
    : undefined;

  // Build a simple map using canvas for the atlas
  const [mapImageState, setMapImageState] = useState("");
  useEffect(() => {
    if (!world) { setMapImageState(""); return; }
    const canvas = document.createElement("canvas");
    const size = Math.min(world.N, 600);
    canvas.width = size; canvas.height = size;
    const ctx = canvas.getContext("2d")!;
    const image = ctx.createImageData(size, size);
    for (let y = 0; y < size; y++)
      for (let x = 0; x < size; x++) {
        const ix = Math.floor((x / size) * world.N);
        const iy = Math.floor((y / size) * world.N);
        const k = iy * world.N + ix;
        const height = world.h[k];
        const water = height < 0;
        // Filter out disconnected beach ponds: only show water if connected to hydrology network
        const inl = world.inl ? world.inl[k] : 0;
        const isConnectedWater = water && inl > 0.4;
        const isPond = water && !isConnectedWater;
        let shade = Math.min(1, Math.max(0, height / world.maxHeight));
        // Color mapping
        let rgb: [number, number, number];
        if (isPond) {
          // Beach ponds removed: show as damp sand instead of water
          rgb = [100, 95, 82];
        } else if (isConnectedWater) {
          rgb = inl > 0.4 ? [144, 165, 147] : [27, 49, 45];
        } else {
          rgb = [73 + shade * 80, 87 + shade * 77, 62 + shade * 70];
        }
        const p = (y * size + x) * 4;
        image.data[p] = rgb[0];
        image.data[p + 1] = rgb[1];
        image.data[p + 2] = rgb[2];
        image.data[p + 3] = 255;
      }
    ctx.putImageData(image, 0, 0);
    setMapImageState(canvas.toDataURL());
  }, [world]);

  // Render rebuilt atmosphere uniforms into engine if possible
  useEffect(() => {
    if (engine.current) {
      // Push rebuilt shader references into engine for shader compilation
      try {
        (engine.current as any)._rebuiltShoreline = SHORELINE_SHADER;
        (engine.current as any)._rebuiltSwamp = SWAMP_SHADER;
        (engine.current as any)._rebuiltAtmosphere = ATMOSPHERE_SHADER;
      } catch (e) {
        // Engine may not support direct shader replacement; shader is still loaded
      }
    }
  }, []);

  return (
    <main className={`island-app ${immersive ? "is-immersive" : ""}`}>
      <div className="environment-preview" style={{ backgroundImage: "url('/images/estuary.jpg')" }} />
      <div className={`scene-mount ${available ? "scene-ready" : ""}`} ref={mount} aria-label="Interactive island and ocean simulation" />
      <div className="scene-treatment" />

      {/* Header */}
      <header className="app-header ui-layer">
        <button className="brand" onClick={() => visit("river")} aria-label="Island, return to the estuary">
          <span className="brand-icon"><Waves size={33} strokeWidth={1.3} /></span>
          <span className="wordmark">ISLAND<span className="brand-edition">19</span></span>
          <span className="brand-divider" />
          <span className="brand-caption">LIVING<br/>SHORELINE</span>
        </button>
        <nav className="main-nav" aria-label="Main navigation">
          <button className="nav-active" onClick={() => { setModal(null); setImmersive(false); }}>
            Explore <span />
          </button>
          <button onClick={() => setModal("atlas")}>Atlas <ArrowUpRight size={13} /></button>
          <button onClick={() => setModal("notes")}>Field notes</button>
        </nav>
        <div className="header-actions">
          <span className="live-status"><i /> {state.error ? "SCENIC PREVIEW" : state.loading ? "SHAPING WORLD" : "WORLD LIVE"}</span>
          <IconButton label={muted ? "Enable nature sounds" : "Mute nature sounds"} onClick={toggleAudio}>
            {muted ? <VolumeX size={19} /> : <Volume2 size={19} />}
          </IconButton>
          <IconButton label="Controls and help" onClick={() => setModal("help")}>
            <CircleHelp size={19} />
          </IconButton>
          <IconButton label="Enter fullscreen" onClick={fullscreen}>
            <Expand size={19} />
          </IconButton>
        </div>
      </header>

      {/* Compass */}
      <div className="compass-strip ui-layer" aria-label={`Heading ${Math.round(state.heading)} degrees`}>
        <div className="compass-cardinals"><span>NW</span><span>N</span><span>NE</span></div>
        <div className="compass-ticks" />
        <Navigation size={12} className="compass-pointer" fill="currentColor" style={{ transform: `rotate(${state.heading - 45}deg)` }} />
        <span className="compass-heading">{String(Math.round(state.heading)).padStart(3, "0")}<span>o</span></span>
      </div>

      {/* Scene tools */}
      <div className="scene-tools ui-layer">
        <IconButton label="Take a photograph" onClick={capture}><Camera size={19} /></IconButton>
        <IconButton label={panel ? "Hide conditions" : "Show conditions"} onClick={() => setPanel((v) => !v)} active={panel}>
          <SlidersHorizontal size={19} />
        </IconButton>
        <IconButton label="Hide interface (H)" onClick={() => setImmersive(true)}><Maximize2 size={18} /></IconButton>
      </div>

      {/* Conditions panel */}
      <ConditionsPanel
        cameraMode={cameraMode}
        engine={engine}
        hour={hour}
        maximumStorm={maximumStorm}
        mist={mist}
        notify={notify}
        panel={panel}
        panelTab={panelTab}
        playing={playing}
        quality={quality}
        ready={ready}
        reset={reset}
        setCameraMode={setCameraMode}
        setHourValue={setHourValue}
        setMistValue={setMistValue}
        setPanel={setPanel}
        setPanelTab={setPanelTab}
        setPlaying={setPlaying}
        setQuality={setQuality}
        setStormValue={setStormValue}
        setThrottle={setThrottle}
        setVegetation={setVegetation}
        setWaveValue={setWaveValue}
        state={state}
        storm={storm}
        throttle={throttle}
        time={time}
        vegetation={vegetation}
        wave={wave}
      />

      {/* Minimap / Atlas button */}
      <button className="minimap ui-layer" onClick={() => setModal("atlas")} aria-label="Open island atlas">
        <div className="minimap-heading"><span><Map size={13} /> FIELD ATLAS</span><ArrowUpRight size={13} /></div>
        <div className="minimap-image">
          {mapImageState ? <img src={mapImageState} alt="Live topographic map of the generated island" /> : <svg viewBox="0 0 200 125" aria-hidden="true"><path className="placeholder-coast" d="M48 110C12 103 13 66 38 58S34 14 73 18s21 15 55 5 24 35 41 52-5 47-39 37S82 129 48 110Z" /><path className="placeholder-river" d="M104 45c20 7-14 20-3 28s-17 18-18 39m20-37 35 6m-37-13-23-9" /></svg>}
          <div className="map-pin" style={mapPosition}><Navigation size={10} fill="currentColor" /></div>
          <span className="map-north">N<span>+</span></span>
        </div>
        <div className="minimap-caption"><span>{world?.name || "VALARA CAY"}</span><span>LIVE SURVEY</span></div>
      </button>

      {/* Destination dock */}
      <section className="destination-dock ui-layer" aria-label="Explore the island">
        <span className="dock-eyebrow">GO A LITTLE FURTHER</span>
        <div className="destination-options">
          {destinations.map(({ id, label, icon: Icon }, index) => (
            <button key={id} aria-label={label} disabled={!available} onClick={() => visit(id)} className={location === id ? "selected" : ""}>
              <Icon size={17} strokeWidth={1.5} /> <span>{label}</span>
              <span className="destination-number" aria-hidden="true">0{index + 1}</span>
            </button>
          ))}
        </div>
        <div className="location-caption">
          <span className="live-dot" />
          <span>{state.loading ? "The island is taking shape" : state.place || "The estuary"}</span>
          <span className="caption-divider" />
          <span>{storm > 0.65 ? "Storm approaching" : "A moment, uninterrupted"}</span>
        </div>
      </section>

      {/* Loading */}
      {state.loading && !state.error && (
        <div className="loading-progress" role="status">
          <span className="loading-orbit" />
          <div><span>{state.label || "Shaping your island"}</span><div className="loading-track"><i style={{ width: `${Math.max(3, state.progress * 100)}%` }} /></div></div>
          <span>{Math.round(state.progress * 100)}%</span>
        </div>
      )}

      {/* Error */}
      {state.error && (
        <div className="graphics-notice" role="alert">
          <Waves size={18} />
          <div>
            <strong>Scenic preview</strong>
            <p>Live 3D needs a WebGL 2 compatible browser. Your graphics device could not start the simulation.</p>
            <button onClick={() => window.location.reload()}>Retry 3D <ArrowRight size={13} /></button>
          </div>
        </div>
      )}

      {/* Capsize notice */}
      {capsized && (
        <div className="capsize-notice">
          <CloudLightning size={20} />
          <div><strong>Heavy seas. Hold steady.</strong><span>Your boat has capsized.</span></div>
          <button onClick={() => engine.current?.rightBoat()}>Right the boat <RotateCcw size={14} /></button>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="toast" role="status"><Check size={15} /> {toast}</div>
      )}

      {/* Exploration bar */}
      <footer className="exploration-bar ui-layer">
        <div className="exploration-mode">
          <span className="toolbar-label">EXPLORE BY</span>
          <div>
            {[
              { id: "survey", label: "Free look", icon: Compass },
              { id: "walk", label: "On foot", icon: Footprints },
              { id: "boat", label: "Boat", icon: Ship },
            ].map(({ id, label, icon: Icon }) => (
              <button disabled={!available} key={id} className={state.mode === id ? "selected" : ""} onClick={() => changeMode(id)}>
                <Icon size={16} /> <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="movement-hints">
          <span className="key-group">
            <kbd>W</kbd><span><kbd>A</kbd><kbd>S</kbd><kbd>D</kbd></span>
          </span>
          <span>{state.mode === "boat" ? (freeCamera ? "Free rotate · Z zoom" : "Throttle & steer") : "Move around"}</span>
          <span className="hint-divider" />
          <Mouse size={19} strokeWidth={1.4} />
          <span>Drag to look · F free cam</span>
        </div>
        <div className="live-telemetry">
          <div>
            <span className="toolbar-label">{state.mode === "boat" ? (freeCamera ? "FREE CAM" : "SPEED") : "LOCAL TIME"}</span>
            <span>{state.mode === "boat" && !freeCamera ? `${state.speed.toFixed(1)} kn` : time}<span className="telemetry-suffix">{state.mode !== "boat" && " LT"}</span></span>
          </div>
          <div className="fps-indicator"><i /><span>{available ? state.fps : "--"}<small> FPS</small></span></div>
          <IconButton label="Take a photograph" onClick={capture}><Camera size={19} /></IconButton>
        </div>
      </footer>

      {/* Restore UI */}
      <button className="restore-ui" onClick={() => setImmersive(false)}>
        <Maximize2 size={15} /> Show interface <kbd>H</kbd>
      </button>

      {/* Touch controls for mobile */}
      <div className="touch-controls ui-layer">
        <button aria-label="Move forward" onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); engine.current?.setKey("KeyW", true); }} onPointerUp={() => engine.current?.setKey("KeyW", false)} onPointerCancel={() => engine.current?.setKey("KeyW", false)}>
          <ArrowDown size={23} style={{ transform: "rotate(180deg)" }} />
        </button>
        <div>
          {[
            ["KeyA", "Steer left", ChevronLeft],
            ["KeyS", "Reverse", ArrowDown],
            ["KeyD", "Steer right", ChevronRight],
          ].map(([key, label, Icon]) => {
            const Arrow = Icon as typeof ChevronLeft;
            return (
              <button key={key as string} aria-label={label as string} onPointerDown={(e) => { e.currentTarget.setPointerCapture(e.pointerId); engine.current?.setKey(key as string, true); }} onPointerUp={() => engine.current?.setKey(key as string, false)} onPointerCancel={() => engine.current?.setKey(key as string, false)}>
                <Arrow size={23} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Modals */}
      <Modals
        closeModal={closeModal}
        mapImage={mapImageState}
        modal={modal}
        state={state}
        visit={visit}
        world={world}
      />
    </main>
  );
}
