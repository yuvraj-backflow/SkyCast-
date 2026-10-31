import fs from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { FileBlob, PresentationFile } from "file:///C:/Users/yuvra/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/@oai/artifact-tool/dist/artifact_tool.mjs";

const workspaceDir = "C:\\Users\\yuvra\\Downloads\\Skycast";
const templatePath = path.join(workspaceDir, ".ppt_work", "PRESENTATION_FORMAT.pptx");
const finalPath = path.join(workspaceDir, "output", "Skycast_Project_Presentation.pptx");
const stagingDir = path.join(workspaceDir, ".ppt_work", "staging");
const skillDir = "C:\\Users\\yuvra\\.codex\\plugins\\cache\\openai-primary-runtime\\presentations\\26.1029.11837\\skills\\presentations";
const runtimePython = "C:\\Users\\yuvra\\.cache\\codex-runtimes\\codex-primary-runtime\\dependencies\\python\\python.exe";
await fs.mkdir(stagingDir, { recursive: true });
await fs.mkdir(path.dirname(finalPath), { recursive: true });

const deck = await PresentationFile.importPptx(await FileBlob.load(templatePath));
const inspect = await deck.inspect({
  select: "$.slides[*]",
  include: ["id", "index", "elements.id", "elements.kind", "elements.text", "elements.position"],
});
const records = inspect.records;

function replaceText(elementId, text) {
  const node = deck.resolve(elementId);
  node.text = text;
}
function addText(slide, text, left, top, width, height, fontSize = 25, options = {}) {
  const shape = slide.shapes.add({
    geometry: "textbox",
    position: { left, top, width, height },
    fill: "none",
    line: { style: "solid", fill: "none", width: 0 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize,
    fontFamily: options.fontFamily || "Verdana",
    color: options.color || "#222222",
    bold: options.bold || false,
    alignment: options.alignment || "left",
  };
  return shape;
}
function addBox(slide, text, left, top, width, height, options = {}) {
  const shape = slide.shapes.add({
    geometry: options.geometry || "roundRect",
    position: { left, top, width, height },
    fill: options.fill || "#EAF4FB",
    line: { style: "solid", fill: options.line || "#4A90C2", width: options.lineWidth || 1.5 },
  });
  shape.text = text;
  shape.text.style = {
    fontSize: options.fontSize || 20,
    fontFamily: "Verdana",
    color: options.color || "#16324A",
    bold: options.bold ?? true,
    alignment: "center",
  };
  return shape;
}
function clearTemplateContent(record, keepTitle = true) {
  for (const el of record.elements || []) {
    if (el.kind !== "textbox") continue;
    const pos = el.position || {};
    const isFooter = (pos.top ?? 0) >= 640;
    const isTitle = (pos.top ?? 999) < 160 && (pos.width ?? 0) > 600;
    if (isFooter) {
      if ((el.text || "").toUpperCase().includes("PROJECT NAME")) replaceText(el.id, "SKYCAST WEATHER FORECAST APPLICATION");
      continue;
    }
    if (isTitle && keepTitle) continue;
    replaceText(el.id, "");
  }
}
function setTitle(record, title) {
  const candidates = (record.elements || []).filter(el => el.kind === "textbox" && (el.position?.top ?? 999) < 160 && (el.position?.width ?? 0) > 600);
  if (candidates.length) replaceText(candidates[0].id, title);
}
function note(slide, text) { slide.speakerNotes.text = text; }

// Slide 1: cover
{
  const r = records[0];
  clearTemplateContent(r, false);
  const texts = r.elements.filter(e => e.kind === "textbox");
  replaceText(texts[0].id, "SKYCAST\nWEATHER FORECAST APPLICATION");
  deck.resolve(texts[0].id).position = { ...deck.resolve(texts[0].id).position, top: 112, height: 140 };
  replaceText(texts[1].id, "Team Member:-\n[Student Name 1] [Enrollment No.]\n[Student Name 2] [Enrollment No.]\n[Student Name 3] [Enrollment No.]");
  replaceText(texts[2].id, "Internal Guide:-\n[Guide Name]");
  replaceText(texts[4].id, "SKYCAST WEATHER FORECAST APPLICATION");
  note(deck.slides.getItem(0), "Introduce Skycast as a full-stack weather forecast application. Replace student and guide details before presenting.");
}

// Slide 2: index
{
  const r = records[1]; clearTemplateContent(r); setTitle(r, "INDEX");
  replaceText(r.elements[1].id, "");
  addText(deck.slides.getItem(1), "Introduction\nProject Profile and Scope\nModules and Users\nTools and Technology\nNeed for the System\nSystem Flow Diagram\nUML Diagrams\nData Dictionary\nUser Interface Design\nReports\nTest Plan and Test Cases\nFuture Work\nBibliography", 90, 150, 760, 490, 24);
  note(deck.slides.getItem(1), "This presentation follows the supplied college format.");
}

// Slide 3: Introduction
{
  const r = records[2]; clearTemplateContent(r); setTitle(r, "Introduction");
  addText(deck.slides.getItem(2), "Skycast is a web-based weather forecast application. It provides current weather details for a searched city through a simple dashboard.\n\nThe application shows temperature, humidity, wind speed, weather condition, hourly temperature data, a city map, favourite cities, and recent search history.", 90, 175, 760, 360, 27);
  note(deck.slides.getItem(2), "Explain that Skycast gathers live weather information and presents it in one dashboard.");
}

// Slide 4: Project profile and scope
{
  const r = records[3]; clearTemplateContent(r); setTitle(r, "Project Profile and Scope");
  addText(deck.slides.getItem(3), "Project type: Full-stack web application\n\nScope:\n• City-based current weather search\n• Hourly temperature forecast\n• Map location for the selected city\n• Persistent favourite cities and search history\n• Light and dark theme preference", 95, 165, 750, 405, 27);
  note(deck.slides.getItem(3), "The current project focuses on city searches and uses live services. Internet and database connectivity are needed.");
}

// Slide 5: modules and users
{
  const r = records[4]; clearTemplateContent(r); setTitle(r, "Modules and Users");
  const s = deck.slides.getItem(4);
  addBox(s, "Weather Search\nCurrent conditions", 85, 165, 230, 100);
  addBox(s, "Hourly Forecast\nTemperature chart", 365, 165, 230, 100);
  addBox(s, "Weather Map\nCity location", 645, 165, 230, 100);
  addBox(s, "Favourite Cities\nSave and remove", 225, 330, 230, 100);
  addBox(s, "Search History\nView and delete", 505, 330, 230, 100);
  addText(s, "Primary user: Any visitor who wants to search and review weather information.", 105, 500, 720, 55, 24, { alignment: "center" });
  note(s, "Skycast currently has a single end-user role. The system does not implement user authentication.");
}

// Slide 6: technologies
{
  const r = records[5]; clearTemplateContent(r); setTitle(r, "Tools and Technology");
  const s = deck.slides.getItem(5);
  const table = s.tables.add({ rows: 6, columns: 2, left: 95, top: 160, width: 740, height: 390, values: [
    ["Layer", "Technology"],
    ["Frontend", "React, Vite, JavaScript"],
    ["Backend", "Java and Spring Boot"],
    ["Database", "MySQL with Spring Data JPA"],
    ["Visualisation", "React Leaflet, Recharts, Lucide React"],
    ["External APIs", "OpenWeather, Nominatim, OpenStreetMap"],
  ]});
  table.styleOptions = { headerRow: true, bandedRows: true };
  for (let c = 0; c < 2; c++) table.getCell(0, c).fill = "#245B80";
  table.cells.block({ row: 0, column: 0, rowCount: 1, columnCount: 2 }).assign({ textStyle: { color: "#FFFFFF", bold: true, fontSize: 22, fontFamily: "Verdana" } });
  table.cells.block({ row: 1, column: 0, rowCount: 5, columnCount: 2 }).assign({ textStyle: { color: "#222222", fontSize: 20, fontFamily: "Verdana" } });
  note(s, "The frontend and backend are separate applications. Spring Boot provides REST endpoints and MySQL stores favourites and history.");
}

// Slide 7: Need for system
{
  const r = records[6]; clearTemplateContent(r); setTitle(r, "Need for the System");
  addText(deck.slides.getItem(6), "Users often check weather through separate websites or applications. Skycast combines the frequently needed information in one place.\n\nThe system helps users:\n• Search a city quickly\n• Review current conditions and hourly temperature\n• Keep favourite cities and recent searches\n• Find the selected city on a map", 95, 165, 755, 410, 27);
  note(deck.slides.getItem(6), "This slide explains the problem addressed by Skycast: weather data and personal locations are easier to access in one focused dashboard.");
}

// Slide 8: system flow
{
  const r = records[7]; clearTemplateContent(r); setTitle(r, "System Flow Diagram");
  const s = deck.slides.getItem(7);
  const a = addBox(s, "User\nsearches city", 65, 245, 145, 85, { fontSize: 20 });
  const b = addBox(s, "React\nfrontend", 245, 245, 145, 85, { fontSize: 20 });
  const c = addBox(s, "Spring Boot\nREST API", 425, 245, 145, 85, { fontSize: 20 });
  const d = addBox(s, "OpenWeather\nAPI", 605, 190, 155, 85, { fontSize: 20, fill: "#EDF7E9", line: "#6B9D54" });
  const e = addBox(s, "MySQL\ndatabase", 605, 360, 155, 85, { fontSize: 20, fill: "#FFF4DF", line: "#BD8A34" });
  const arrow = { kind: "straight", fromSide: "right", toSide: "left", line: { style: "solid", fill: "#4A90C2", width: 2 }, head: { type: "triangle", width: "sm", length: "sm" } };
  s.shapes.connect(a, b, arrow);
  s.shapes.connect(b, c, arrow);
  s.shapes.connect(c, d, { ...arrow, toSide: "left" });
  s.shapes.connect(c, e, { ...arrow, toSide: "left" });
  addText(s, "Nominatim provides city coordinates. OpenStreetMap tiles display the selected location.", 120, 540, 720, 38, 21, { alignment: "center" });
  note(s, "Walk through the request flow from the browser to the Spring Boot API. The backend contacts OpenWeather and stores favourites and history in MySQL.");
}

// Slide 9: UML
{
  const r = records[8]; clearTemplateContent(r); setTitle(r, "UML Diagrams");
  const s = deck.slides.getItem(8);
  addText(s, "Use Case Diagram", 110, 170, 290, 35, 26, { bold: true, alignment: "center" });
  addText(s, "User searches city\nUser views weather details\nUser views hourly forecast and map\nUser adds or removes favourite city\nUser deletes search history", 105, 220, 310, 250, 22);
  addText(s, "Sequence Diagram", 530, 170, 290, 35, 26, { bold: true, alignment: "center" });
  addText(s, "User → Frontend: submit city\nFrontend → Backend: GET /api/{city}\nBackend → OpenWeather: request live data\nBackend → MySQL: save successful search\nBackend → Frontend: weather response", 500, 220, 340, 250, 22);
  note(s, "Describe the use cases first, then explain the main search sequence.");
}

// Slide 10: Data Dictionary
{
  const r = records[9]; clearTemplateContent(r); setTitle(r, "Data Dictionary");
  const s = deck.slides.getItem(9);
  const table = s.tables.add({ rows: 7, columns: 3, left: 70, top: 155, width: 820, height: 430, values: [
    ["Entity", "Field", "Description"],
    ["Favourite", "id", "Generated primary identifier"],
    ["Favourite", "city", "Saved city name, required"],
    ["Favourite", "createdAt", "Time when the city is saved"],
    ["SearchHistory", "id", "Generated primary identifier"],
    ["SearchHistory", "city", "Searched city name, required"],
    ["SearchHistory", "searchAt", "Time when the city is searched"],
  ]});
  table.styleOptions = { headerRow: true, bandedRows: true };
  for (let c = 0; c < 3; c++) table.getCell(0, c).fill = "#245B80";
  table.cells.block({ row: 0, column: 0, rowCount: 1, columnCount: 3 }).assign({ textStyle: { color: "#FFFFFF", bold: true, fontSize: 19, fontFamily: "Verdana" } });
  table.cells.block({ row: 1, column: 0, rowCount: 6, columnCount: 3 }).assign({ textStyle: { color: "#222222", fontSize: 17, fontFamily: "Verdana" } });
  note(s, "The project persists two entities: Favourite and SearchHistory. Weather responses are retrieved live and are not stored in these entities.");
}

// Slide 11: Interface
{
  const r = records[10]; clearTemplateContent(r); setTitle(r, "User Interface Design");
  const s = deck.slides.getItem(10);
  addBox(s, "Header\nTheme switch", 100, 185, 205, 95, { fontSize: 21 });
  addBox(s, "Search Bar\nCity input", 375, 185, 205, 95, { fontSize: 21 });
  addBox(s, "Weather Card\nCurrent conditions", 650, 185, 205, 95, { fontSize: 21 });
  addBox(s, "Map and Chart\nLocation and hourly trend", 235, 355, 230, 105, { fontSize: 21 });
  addBox(s, "Saved Places\nFavourites and history", 545, 355, 230, 105, { fontSize: 21 });
  addText(s, "The React dashboard updates after a successful city search and presents weather information in focused sections.", 125, 535, 710, 45, 22, { alignment: "center" });
  note(s, "Replace this overview with your own verified application screenshots if your guide requires screen captures.");
}

// Slide 12: Reports and tests
{
  const r = records[11]; clearTemplateContent(r); setTitle(r, "Reports and Test Cases");
  const s = deck.slides.getItem(11);
  addText(s, "Application Outputs", 90, 165, 330, 35, 26, { bold: true, alignment: "center" });
  addText(s, "• Current weather for selected city\n• Hourly temperature chart\n• Favourite cities list\n• Search history list", 115, 220, 320, 230, 23);
  addText(s, "Test Cases", 540, 165, 250, 35, 26, { bold: true, alignment: "center" });
  addText(s, "• Valid city search\n• Invalid city message\n• Add and remove favourite\n• Delete search history\n• Theme preference after reload\n• Weather API unavailable", 515, 220, 320, 250, 23);
  note(s, "Explain each test by stating its input and expected behaviour. Record actual results in the written report after executing tests.");
}

// Slide 13: Future work
{
  const r = records[12]; clearTemplateContent(r); setTitle(r, "Future Work");
  addText(deck.slides.getItem(12), "• Use browser geolocation for current-location weather\n• Add daily forecast and weather alerts\n• Add account login for personal saved locations\n• Add unit selection for Celsius and Fahrenheit\n• Add structured backend error responses\n• Add automated unit and integration tests\n• Add accessibility and multi-language support", 105, 175, 750, 365, 27);
  note(deck.slides.getItem(12), "These are possible next steps. They are not implemented features in the current version.");
}

// Slide 14: references
{
  const r = records[13]; clearTemplateContent(r); setTitle(r, "Bibliography");
  addText(deck.slides.getItem(13), "OpenWeather API Documentation\nhttps://openweathermap.org/api\n\nSpring Boot Documentation\nhttps://docs.spring.io/spring-boot/\n\nReact Documentation\nhttps://react.dev/\n\nOpenStreetMap and Nominatim\nhttps://www.openstreetmap.org/\nhttps://nominatim.org/", 110, 155, 745, 440, 24);
  note(deck.slides.getItem(13), "These web references support the technologies and services used in Skycast.");
}

// Export a candidate and run final validation.
const candidatePath = path.join(stagingDir, "skycast-candidate.pptx");
await (await PresentationFile.exportPptx(deck)).save(candidatePath);
console.log(JSON.stringify({ candidatePath, slides: deck.slides.items.length }, null, 2));
