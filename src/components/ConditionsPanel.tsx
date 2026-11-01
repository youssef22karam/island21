import type { Dispatch, SetStateAction, RefObject } from "react";
import { ArrowUpRight, Cloud, CloudLightning, Pause, Play, RotateCcw, Settings2, Sun, Waves, X } from "lucide-react";
import type { EngineState, IslandEngine } from "../engine/island.js";
import { cameras } from "../lib/constants";
import { IconButton, Range } from "./ui";

export interface ConditionsPanelProps {
  cameraMode: string;
  engine: RefObject<IslandEngine | null>;
  hour: number;
  maximumStorm: () => void;
  mist: number;
  notify: (message: string) => void;
  panel: boolean;
  panelTab: string;
  playing: boolean;
  quality: string;
  ready: RefObject<boolean>;
  reset: () => void;
  setCameraMode: Dispatch<SetStateAction<string>>;
  setHourValue: (v: number) => void;
  setMistValue: (v: number) => void;
  setPanel: Dispatch<SetStateAction<boolean>>;
  setPanelTab: Dispatch<SetStateAction<string>>;
  setPlaying: Dispatch<SetStateAction<boolean>>;
  setQuality: Dispatch<SetStateAction<string>>;
  setStormValue: (v: number) => void;
  setThrottle: Dispatch<SetStateAction<number>>;
  setVegetation: Dispatch<SetStateAction<boolean>>;
  setWaveValue: (v: number) => void;
  state: EngineState;
  storm: number;
  throttle: number;
  time: string;
  vegetation: boolean;
  wave: number;
}

export default function ConditionsPanel({
  cameraMode, engine, hour, maximumStorm, mist, notify, panel, panelTab, playing, quality, ready, reset, setCameraMode, setHourValue, setMistValue, setPanel, setPanelTab, setPlaying, setQuality, setStormValue, setThrottle, setVegetation, setWaveValue, state, storm, throttle, time, vegetation, wave,
}: ConditionsPanelProps) {
  return (
    <aside
      className={`conditions-panel ui-layer ${panel ? "panel-open" : ""}`}
      aria-label="Environment conditions"
      aria-hidden={!panel}
      inert={!panel}
    >
      <div className="panel-title">
        <div>
          <span className="eyebrow">THE ELEMENTS</span>
          <h2>Conditions</h2>
        </div>
        <IconButton label="Close conditions" onClick={() => setPanel(false)}>
          <X size={17} />
        </IconButton>
      </div>
      <div
        className="panel-tabs"
        role="tablist"
        aria-label="Condition categories"
      >
        {[
          ["atmosphere", "Atmosphere"],
          ["water", "Water"],
          ["system", "System"],
        ].map(([id, label]) => (
          <button
            key={id}
            role="tab"
            aria-selected={panelTab === id}
            className={panelTab === id ? "selected" : ""}
            onClick={() => setPanelTab(id)}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="panel-content" role="tabpanel">
        {panelTab === "atmosphere" && (
          <>
            <div className="weather-presets">
              {[
                { icon: Sun, label: "Clear", value: 0 },
                { icon: Cloud, label: "Overcast", value: 0.45 },
                { icon: CloudLightning, label: "Storm", value: 1 },
              ].map(({ icon: Icon, label, value }) => (
                <button
                  key={label}
                  className={Math.abs(storm - value) < 0.14 ? "selected" : ""}
                  onClick={() => setStormValue(value)}
                >
                  <Icon size={20} strokeWidth={1.4} />
                  <span>{label}</span>
                </button>
              ))}
            </div>
            <Range
              label="Storm intensity"
              value={storm}
              display={`${Math.round(storm * 100)}%`}
              onChange={setStormValue}
              ends={["CALM", "EXTREME"]}
            />
            <Range
              label="Wave height"
              value={wave}
              min={0.2}
              max={2.5}
              display={`${wave.toFixed(1)}x`}
              onChange={setWaveValue}
              ends={["GENTLE", "POWERFUL"]}
            />
            <div className="time-control">
              <Range
                label="Time of day"
                value={hour}
                min={0}
                max={23.99}
                display={time}
                onChange={setHourValue}
              />
              <div className="time-presets">
                <button onClick={() => setHourValue(6.2)}>Dawn</button>
                <button onClick={() => setHourValue(12)}>Noon</button>
                <button
                  onClick={() => setHourValue(17.4)}
                  className={hour > 15 && hour < 19 ? "golden" : ""}
                >
                  Golden hour
                </button>
                <button
                  aria-label={playing ? "Pause daylight" : "Animate daylight"}
                  onClick={() => {
                    setPlaying((v) => !v);
                    engine.current?.setPlaying(!playing);
                  }}
                >
                  {playing ? <Pause size={12} /> : <Play size={12} />}
                </button>
              </div>
            </div>
            <Range
              label="Mist & atmosphere"
              value={mist}
              display={`${Math.round(mist * 100)}%`}
              onChange={setMistValue}
            />
          </>
        )}
        {panelTab === "water" && (
          <>
            <div className="panel-section-title">
              <Waves size={22} />
              <span>One connected water world</span>
            </div>
            <p className="panel-explanation">
              Ocean swell gives way to sheltered currents, deep lakes, and
              tannin-rich backwaters.
            </p>
            <Range
              label="Ocean wave scale"
              value={wave}
              min={0.2}
              max={2.5}
              display={`${wave.toFixed(1)}x`}
              onChange={setWaveValue}
            />
            <div className="water-readout">
              <span>SIGNIFICANT WAVE HEIGHT</span>
              <strong>
                {state.hs.toFixed(1)}
                <small> m</small>
              </strong>
            </div>
            <label className="select-label">
              Boat camera
              <select
                value={cameraMode}
                onChange={(e) => {
                  setCameraMode(e.target.value);
                  engine.current?.setCameraMode(e.target.value);
                }}
              >
                {cameras.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </label>
            <button
              className="subtle-action"
              onClick={() => {
                engine.current?.rightBoat();
                notify("Boat recovery initiated.");
              }}
            >
              <RotateCcw size={15} /> Right the boat
            </button>
          </>
        )}
        {panelTab === "system" && (
          <>
            <div className="panel-section-title">
              <Settings2 size={21} />
              <span>Make yourself at home</span>
            </div>
            <label className="select-label">
              Rendering quality
              <select
                value={quality}
                onChange={(e) => {
                  setQuality(e.target.value);
                  ready.current = false;
                  engine.current?.setQuality(e.target.value);
                }}
              >
                {[
                  ["lower", "Performance"],
                  ["low", "Balanced"],
                  ["medium", "High"],
                  ["high", "Ultra"],
                ].map(([id, name]) => (
                  <option value={id} key={id}>
                    {name}
                  </option>
                ))}
              </select>
            </label>
            <label className="toggle-row">
              Living vegetation
              <button
                className={`toggle ${vegetation ? "on" : ""}`}
                role="switch"
                aria-checked={vegetation}
                aria-label="Living vegetation"
                onClick={() => {
                  setVegetation((v) => !v);
                  engine.current?.setVegetation(!vegetation);
                }}
              >
                <i />
              </button>
            </label>
            <button
              className="subtle-action"
              onClick={() => {
                ready.current = false;
                const seed = Math.floor(Math.random() * 999999);
                engine.current?.regenerate(seed);
                notify(`Growing a new island. Seed ${seed}.`);
              }}
            >
              <RotateCcw size={15} /> Discover a new island
            </button>
            <button
              className="subtle-action"
              onClick={async () => {
                try {
                  await navigator.clipboard.writeText(
                    `${window.location.origin}${window.location.pathname}?seed=${state.seed}`,
                  );
                  notify("Island link copied to your clipboard.");
                } catch {
                  notify(`Your island seed is ${state.seed}.`);
                }
              }}
            >
              <ArrowUpRight size={15} /> Share this island
            </button>
            <p className="panel-explanation small">
              Locally simulated. No account, no boundaries. Your exploration
              stays yours.
            </p>
          </>
        )}
        {panelTab === "water" && state.mode === "boat" && (
          <Range
            label="Throttle lever"
            value={throttle}
            min={-3}
            max={8}
            step={0.1}
            display={throttle === 0 ? "Neutral" : `${throttle.toFixed(1)} kn`}
            ends={["REVERSE", "AHEAD"]}
            onChange={(v) => {
              setThrottle(v);
              engine.current?.setThrottle(v);
            }}
          />
        )}
      </div>
      <div className="panel-footer">
        <button className="storm-action" onClick={maximumStorm}>
          <CloudLightning size={16} /> Experience the full storm
          <ArrowUpRight size={15} />
        </button>
        <button className="reset-action" onClick={reset}>
          <RotateCcw size={11} /> Reset to natural conditions
        </button>
      </div>
    </aside>
  );
}
