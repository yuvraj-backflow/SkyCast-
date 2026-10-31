import fs from "node:fs/promises";
import { FileBlob, PresentationFile } from "file:///C:/Users/yuvra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const deck = await PresentationFile.importPptx(await FileBlob.load("C:\\Users\\yuvra\\Downloads\\Skycast\\.ppt_work\\staging\\skycast-candidate.pptx"));
const output = "C:\\Users\\yuvra\\Downloads\\Skycast\\.ppt_work\\rendered";
await fs.mkdir(output, { recursive: true });
for (let i = 0; i < deck.slides.items.length; i++) {
  const png = await deck.slides.getItem(i).export({ format: "png", scale: 1 });
  await fs.writeFile(`${output}/slide-${String(i + 1).padStart(2, "0")}.png`, new Uint8Array(await png.arrayBuffer()));
}
const inspection = await deck.inspect({ select: "$.slides[*]", include: ["id", "index", "title", "elements.id", "elements.kind", "elements.text", "elements.position"] });
console.log(JSON.stringify({ slides: deck.slides.items.length, inspection: inspection.ndjson }));
