import { ArrowRight, ArrowUpRight, Leaf, Map, Navigation, Waves } from "lucide-react";
import type { EngineState, IslandWorld } from "../engine/island.js";
import { Dialog } from "./ui";

export interface ModalsProps {
  closeModal: () => void;
  mapImage: string;
  modal: "atlas" | "help" | "notes" | null;
  state: EngineState;
  visit: (type: string, name?: string | undefined, first?: boolean) => void;
  world: IslandWorld | null;
}

export default function Modals({
  closeModal, mapImage, modal, state, visit, world,
}: ModalsProps) {
  return (
    <>
    {modal === "atlas" && (
      <Dialog
        title="The island, connected."
        eyebrow={`FIELD ATLAS / ${world?.name || "VALARA CAY"}`}
        onClose={closeModal}
        className="atlas-dialog"
      >
        <div className="atlas-layout">
          <div className="atlas-map">
            {mapImage ? (
              <img
                src={mapImage}
                alt="Topographic map showing the connected river, lake, and wetland network"
              />
            ) : (
              <div className="atlas-empty">
                <Map size={36} />
                <p>The atlas is being charted.</p>
              </div>
            )}
            <span className="atlas-compass">
              N<Navigation size={23} />
            </span>
            <span className="atlas-scale">
              0 <span /> 1 km
            </span>
          </div>
          <div className="atlas-directory">
            <p>
              Trace the water from the sea to the heart of the island. Choose
              a place to step into it.
            </p>
            {world &&
              [
                [
                  "Rivers",
                  world.rivers.filter((r) => r.length > 250).slice(0, 6),
                  "river",
                ],
                ["Lakes", world.lakes, "lake"],
                ["Wetlands", world.marshes.slice(0, 4), "swamp"],
              ].map(([label, features, type]) => (
                <section key={label as string}>
                  <h3>
                    {label as string}
                    <span>{(features as IslandWorld["rivers"]).length}</span>
                  </h3>
                  {(features as IslandWorld["rivers"]).map((feature) => (
                    <button
                      key={feature.name}
                      onClick={() => visit(type as string, feature.name)}
                    >
                      <span>{feature.name}</span>
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
                </section>
              ))}
            <div className="atlas-seed">
              ISLAND SEED {state.seed}
              <br />
              {world
                ? `${(world.landArea / 1e6).toFixed(1)} square kilometers of possibility`
                : "A world is taking shape"}
            </div>
          </div>
        </div>
      </Dialog>
    )}
    {modal === "help" && (
      <Dialog
        title="Find your own way."
        eyebrow="A FIELD GUIDE"
        onClose={closeModal}
        className="help-dialog"
      >
        <p className="dialog-intro">
          There is no destination. Just a living island, and a little
          curiosity.
        </p>
        <div className="help-controls">
          {[
            ["W / S", "Move forward / back, or adjust boat throttle"],
            ["A / D", "Move sideways, or steer the boat"],
            ["Mouse", "Drag to look. Scroll to move closer in free look"],
            ["C", "Cycle through six boat cameras"],
            ["R", "Recover a capsized boat"],
            ["Space", "Return the boat throttle to neutral"],
            ["H", "Hide the interface and stay a while"],
            ["Esc", "Return to free look"],
          ].map(([key, description]) => (
            <div key={key}>
              <kbd>{key}</kbd>
              <span>{description}</span>
            </div>
          ))}
        </div>
        <button className="primary-action" onClick={closeModal}>
          Back to the wild
          <ArrowRight size={16} />
        </button>
      </Dialog>
    )}
    {modal === "notes" && (
      <Dialog
        title="Everything flows."
        eyebrow="FIELD NOTES / 001"
        onClose={closeModal}
        className="notes-dialog"
      >
        <div className="notes-illustration">
          <Waves size={60} strokeWidth={0.8} />
          <span>SEA / RIVER / LAKE / WETLAND</span>
        </div>
        <p className="notes-lead">
          An island is not a collection of places.
          <br />
          It is a connected, living system.
        </p>
        <p>
          The open ocean is driven by three layers of wind and swell. Along
          the coast, that energy softens into sheltered estuaries. Rivers wind
          through the interior, joining lake basins and quiet, tannin-rich
          wetlands.
        </p>
        <p>
          The boat rides the same waves you see. Change the weather and give
          the sea a moment to respond. Inland, roots shelter dark water and
          the current carries on.
        </p>
        <div className="notes-footnote">
          <Leaf size={16} />
          <span>
            Procedural terrain. Connected waterways. A world worth getting
            lost in.
          </span>
        </div>
        <button className="primary-action" onClick={closeModal}>
          Keep exploring
          <ArrowRight size={16} />
        </button>
      </Dialog>
    )}
    </>
  );
}
