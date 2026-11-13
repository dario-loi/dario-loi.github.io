// The working models a paper page can show beside its header, by the name its front matter gives.
import TtaGate from "./TtaGate.astro";
import AdThreshold from "./AdThreshold.astro";
import AutobenchLoop from "./AutobenchLoop.astro";
import IsoOperator from "./IsoOperator.astro";
import ClipFrequency from "./ClipFrequency.astro";
import TdlLifting from "./TdlLifting.astro";

export const widgets = {
  "tta-gate": TtaGate,
  "ad-threshold": AdThreshold,
  "autobench-loop": AutobenchLoop,
  "iso-operator": IsoOperator,
  "clip-frequency": ClipFrequency,
  "tdl-lifting": TdlLifting,
};
