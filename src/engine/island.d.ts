export interface Waterway {
  name: string;
  x: number;
  z: number;
  r: number;
  area: number;
  maxDepth: number;
  length: number;
  pts: number[];
  hw: number[];
  kind: string;
  outlet: string;
  navigable: boolean;
}
export interface IslandWorld {
  name: string;
  seed: number;
  N: number;
  cell: number;
  half: number;
  h: Float32Array;
  wet: Uint8Array;
  inl: Float32Array;
  swamp: Float32Array;
  fresh: Float32Array;
  rivers: Waterway[];
  lakes: Waterway[];
  marshes: Waterway[];
  landArea: number;
  maxHeight: number;
}
export interface EngineState {
  loading: boolean;
  progress: number;
  label: string;
  mode: string;
  island: string;
  place: string;
  fps: number;
  hour: number;
  depth: number;
  speed: number;
  heading: number;
  hs: number;
  water: string;
  error: string | null;
  seed: number;
  storm?: number;
  waveHeight?: number;
}
export interface IslandEngine {
  regenerate(seed: number): void;
  setMode(mode: string): void;
  teleport(type: string, name?: string): void;
  setKey(key: string, pressed: boolean): void;
  setStorm(value: number): void;
  setWeather(value: number): void;
  setWaveHeight(value: number): void;
  setHour(value: number): void;
  setMist(value: number): void;
  setPlaying(playing: boolean): void;
  setQuality(quality: string): void;
  setVegetation(enabled: boolean): void;
  setAutoOrbit(enabled: boolean): void;
  getCamera(): { x: number; y: number; z: number };
  setCameraMode(mode: string): void;
  setThrottle(value: number): void;
  rightBoat(): void;
  capture(): string;
  setPaused(value: boolean): void;
  getFreshwaterView(
    type: string,
    name?: string,
  ): { x: number; z: number; lx: number; lz: number; name: string } | null;
  debugView(
    mode: string,
    x: number,
    z: number,
    yaw: number,
    pitch: number,
    height?: number,
  ): void;
  debugBoat(x: number, z: number, heading: number): void;
  getBoatState(): {
    speed: number;
    power: number;
    roll: number;
    pitch: number;
    capsized: boolean;
    camera: string;
  };
  world: IslandWorld | null;
  currentCenter: { x: number; z: number } | null;
  renderer: { domElement: HTMLCanvasElement };
  shaderError: string | null;
  dispose(): void;
}
export function createIslandEngine(
  element: HTMLElement,
  onState: (state: Partial<EngineState>) => void,
): IslandEngine;
export class IslandAudio {
  setMuted(muted: boolean): Promise<void>;
  update(state: unknown): void;
  dispose(): void;
}
