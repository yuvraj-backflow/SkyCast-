import { FileBlob, PresentationFile } from "file:///C:/Users/yuvra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const input = "C:\\Users\\yuvra\\Downloads\\Skycast\\.ppt_work\\PRESENTATION_FORMAT.pptx";
const deck = await PresentationFile.importPptx(await FileBlob.load(input));
const info = await deck.inspect({
  select: "$.slides[*]",
  include: ["id", "index", "layout", "title", "elements.id", "elements.kind", "elements.text", "elements.position", "elements.style", "notes.text"],
});
console.log(info.ndjson);
