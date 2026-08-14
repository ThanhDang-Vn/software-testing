/**
 * gen-from-fragment.js — ráp một workflow fragment dùng chung thành nhiều
 * test plan JMeter (Load/Stress/Spike...) cho một nhóm endpoint bất kỳ.
 *
 * Cách dùng:
 *   1. Sửa CONFIG bên dưới cho đúng bài của bạn (studentId, ngày, domain/port,
 *      biến CSV, danh sách scenario).
 *   2. Viết workflow vào file fragment (mặc định ../templates/workflow-fragment.template.xml).
 *   3. node gen-from-fragment.js
 * Ra các file .jmx theo tên {studentId}_{Scenario}_{date}.jmx ở thư mục hiện tại.
 *
 * Chỉ dùng element JMeter gốc, không cần plugin. Think-time nén bằng property tt_mult.
 */
const fs = require("fs");
const path = require("path");

// ===== CONFIG: sửa phần này cho bài của bạn =====
const CONFIG = {
  studentId: "23127334",
  date: "20260811",
  fragmentPath: path.resolve(__dirname, "../templates/workflow-fragment.template.xml"),
  outDir: process.cwd(),
  domain: "localhost",
  port: "3000",
  csv: [
    { name: "users", file: "../data/users.csv", vars: "email,password" },
    { name: "products", file: "../data/products.csv", vars: "product_id,search_keyword,product_name,price" },
  ],
  // Mỗi scenario: 1 hoặc nhiều thread group. listener gán ở group cuối.
  scenarios: [
    { name: "Load", ttMult: 1, listener: "SummaryReport",
      groups: [{ name: "Load 50 VU", threads: 50, ramp: 60, duration: 360, delay: 0 }] },
    { name: "Stress", ttMult: 0.3, listener: "StatVisualizer",
      groups: [0, 60, 120, 180, 240, 300].map((d, i) => ({ name: `Stress step ${i + 1}`, threads: 50, ramp: 10, duration: 370 - d, delay: d })) },
    { name: "Spike", ttMult: 0.3, listener: "ViewResultsFullVisualizer",
      groups: [
        { name: "Spike baseline", threads: 10, ramp: 5, duration: 245, delay: 0 },
        { name: "Spike burst", threads: 290, ramp: 5, duration: 60, delay: 60 },
      ] },
  ],
};
// ================================================

const fragment = fs.readFileSync(CONFIG.fragmentPath, "utf8").trim();
const indent = (s, n) => s.split("\n").map((l) => (l.length ? " ".repeat(n) + l : l)).join("\n");

function configBlock() {
  let x = `<ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Request Defaults" enabled="true">
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments"><collectionProp name="Arguments.arguments"/></elementProp>
  <stringProp name="HTTPSampler.domain">${CONFIG.domain}</stringProp><stringProp name="HTTPSampler.port">${CONFIG.port}</stringProp>
  <stringProp name="HTTPSampler.protocol">http</stringProp></ConfigTestElement>
<hashTree/>
<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
  <collectionProp name="HeaderManager.headers"><elementProp name="" elementType="Header">
  <stringProp name="Header.name">Content-Type</stringProp><stringProp name="Header.value">application/json</stringProp></elementProp></collectionProp></HeaderManager>
<hashTree/>`;
  for (const c of CONFIG.csv) {
    x += `\n<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV ${c.name}" enabled="true">
  <stringProp name="delimiter">,</stringProp><stringProp name="filename">${c.file}</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp><boolProp name="recycle">true</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp><boolProp name="stopThread">false</boolProp>
  <stringProp name="variableNames">${c.vars}</stringProp></CSVDataSet>
<hashTree/>`;
  }
  return x;
}

function threadGroup(g) {
  return `<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="${g.name}" enabled="true">
  <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
    <boolProp name="LoopController.continue_forever">false</boolProp><stringProp name="LoopController.loops">-1</stringProp></elementProp>
  <stringProp name="ThreadGroup.num_threads">${g.threads}</stringProp><stringProp name="ThreadGroup.ramp_time">${g.ramp}</stringProp>
  <boolProp name="ThreadGroup.scheduler">true</boolProp><stringProp name="ThreadGroup.duration">${g.duration}</stringProp>
  <stringProp name="ThreadGroup.delay">${g.delay}</stringProp><boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp></ThreadGroup>`;
}

function listener(guiclass, name) {
  return `<ResultCollector guiclass="${guiclass}" testclass="ResultCollector" testname="${name}" enabled="true">
  <boolProp name="ResultCollector.error_logging">false</boolProp>
  <objProp><name>saveConfig</name><value class="SampleSaveConfiguration">
    <time>true</time><latency>true</latency><timestamp>true</timestamp><success>true</success><label>true</label>
    <code>true</code><message>true</message><threadName>true</threadName><dataType>true</dataType><assertions>true</assertions>
    <subresults>true</subresults><responseData>false</responseData><fieldNames>true</fieldNames><bytes>true</bytes>
    <sentBytes>true</sentBytes><url>true</url><threadCounts>true</threadCounts><idleTime>true</idleTime><connectTime>true</connectTime>
  </value></objProp>
  <stringProp name="filename"></stringProp></ResultCollector>
<hashTree/>`;
}

for (const sc of CONFIG.scenarios) {
  let body = "";
  sc.groups.forEach((g, i) => {
    const last = i === sc.groups.length - 1;
    const lis = last ? "\n" + listener(sc.listener, sc.listener) : "";
    body += indent(`${threadGroup(g)}\n<hashTree>\n${indent(fragment, 2)}\n</hashTree>${lis}`, 6) + "\n";
  });
  const name = `${CONFIG.studentId}_${sc.name}_${CONFIG.date}`;
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="${name}" enabled="true">
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="UDV">
        <collectionProp name="Arguments.arguments">
          <elementProp name="tt_mult" elementType="Argument"><stringProp name="Argument.name">tt_mult</stringProp><stringProp name="Argument.value">${sc.ttMult}</stringProp><stringProp name="Argument.metadata">=</stringProp></elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
${indent(configBlock(), 6)}
${body}    </hashTree>
  </hashTree>
</jmeterTestPlan>
`;
  fs.writeFileSync(path.join(CONFIG.outDir, `${name}.jmx`), xml);
  console.log("wrote", `${name}.jmx`);
}
