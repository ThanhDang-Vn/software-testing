/**
 * Generate the 3 JMeter test plans (Load / Stress / Spike) from ONE shared
 * workflow fragment (_workflow-fragment.xml). Guarantees the E2E workflow is
 * byte-identical across all three plans; only the Thread Group profile and the
 * listener type differ. Stock JMeter elements only (no jpgc plugin dependency).
 *
 * Usage: node hw5/testplans/generate-plans.js
 */
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const fragment = fs.readFileSync(path.join(DIR, "_workflow-fragment.xml"), "utf8").trim();

const SAVECONFIG = `      <objProp>
        <name>saveConfig</name>
        <value class="SampleSaveConfiguration">
          <time>true</time><latency>true</latency><timestamp>true</timestamp><success>true</success>
          <label>true</label><code>true</code><message>true</message><threadName>true</threadName>
          <dataType>true</dataType><encoding>false</encoding><assertions>true</assertions>
          <subresults>true</subresults><responseData>false</responseData><samplerData>false</samplerData>
          <xml>false</xml><fieldNames>true</fieldNames><responseHeaders>false</responseHeaders>
          <requestHeaders>false</requestHeaders><responseDataOnError>false</responseDataOnError>
          <saveAssertionResultsFailureMessage>true</saveAssertionResultsFailureMessage>
          <assertionsResultsToSave>0</assertionsResultsToSave><bytes>true</bytes><sentBytes>true</sentBytes>
          <url>true</url><threadCounts>true</threadCounts><idleTime>true</idleTime><connectTime>true</connectTime>
        </value>
      </objProp>`;

function listener(guiclass, name) {
  return `<ResultCollector guiclass="${guiclass}" testclass="ResultCollector" testname="${name}" enabled="true">
  <boolProp name="ResultCollector.error_logging">false</boolProp>
${SAVECONFIG}
  <stringProp name="filename"></stringProp>
</ResultCollector>
<hashTree/>`;
}

const CONFIG = `<ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Request Defaults" enabled="true">
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments">
    <collectionProp name="Arguments.arguments"/>
  </elementProp>
  <stringProp name="HTTPSampler.domain">localhost</stringProp>
  <stringProp name="HTTPSampler.port">3000</stringProp>
  <stringProp name="HTTPSampler.protocol">http</stringProp>
  <stringProp name="HTTPSampler.contentEncoding">UTF-8</stringProp>
</ConfigTestElement>
<hashTree/>
<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
  <collectionProp name="HeaderManager.headers">
    <elementProp name="" elementType="Header">
      <stringProp name="Header.name">Content-Type</stringProp>
      <stringProp name="Header.value">application/json</stringProp>
    </elementProp>
  </collectionProp>
</HeaderManager>
<hashTree/>
<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV users" enabled="true">
  <stringProp name="delimiter">,</stringProp>
  <stringProp name="fileEncoding">UTF-8</stringProp>
  <stringProp name="filename">../data/users.csv</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp>
  <boolProp name="quotedData">false</boolProp>
  <boolProp name="recycle">true</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp>
  <boolProp name="stopThread">false</boolProp>
  <stringProp name="variableNames">email,password</stringProp>
</CSVDataSet>
<hashTree/>
<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV products" enabled="true">
  <stringProp name="delimiter">,</stringProp>
  <stringProp name="fileEncoding">UTF-8</stringProp>
  <stringProp name="filename">../data/products.csv</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp>
  <boolProp name="quotedData">false</boolProp>
  <boolProp name="recycle">true</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp>
  <boolProp name="stopThread">false</boolProp>
  <stringProp name="variableNames">product_id,search_keyword,product_name,price</stringProp>
</CSVDataSet>
<hashTree/>`;

function threadGroup(name, threads, ramp, duration, delay) {
  return `<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="${name}" enabled="true">
  <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
    <boolProp name="LoopController.continue_forever">false</boolProp>
    <stringProp name="LoopController.loops">-1</stringProp>
  </elementProp>
  <stringProp name="ThreadGroup.num_threads">${threads}</stringProp>
  <stringProp name="ThreadGroup.ramp_time">${ramp}</stringProp>
  <boolProp name="ThreadGroup.scheduler">true</boolProp>
  <stringProp name="ThreadGroup.duration">${duration}</stringProp>
  <stringProp name="ThreadGroup.delay">${delay}</stringProp>
  <boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp>
</ThreadGroup>`;
}

function wrap(planName, bodyBlocks, ttMult) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="${planName}" enabled="true">
      <stringProp name="TestPlan.comments">HW05 23127334 - E2E buyer workflow (login-search-detail-cart-checkout)</stringProp>
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.tearDown_on_shutdown">true</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="User Defined Variables" enabled="true">
        <collectionProp name="Arguments.arguments">
          <elementProp name="tt_mult" elementType="Argument">
            <stringProp name="Argument.name">tt_mult</stringProp>
            <stringProp name="Argument.value">${ttMult}</stringProp>
            <stringProp name="Argument.metadata">=</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
      <stringProp name="TestPlan.user_define_classpath"></stringProp>
    </TestPlan>
    <hashTree>
${indent(CONFIG, 6)}
${bodyBlocks}
    </hashTree>
  </hashTree>
</jmeterTestPlan>
`;
}

function indent(s, n) {
  const pad = " ".repeat(n);
  return s.split("\n").map((l) => (l.length ? pad + l : l)).join("\n");
}

function tgWithWorkflow(tgXml, listenerXml) {
  // A thread group element, followed by its hashTree containing the workflow.
  return indent(`${tgXml}
<hashTree>
${indent(fragment, 2)}
</hashTree>${listenerXml ? "\n" + listenerXml : ""}`, 6);
}

// ---- LOAD ----
const load = wrap(
  "23127334_Load_20260811",
  tgWithWorkflow(
    threadGroup("Load - 50 VU; 60s ramp + 300s hold", 50, 60, 360, 0),
    listener("SummaryReport", "Summary Report"),
  ),
  1,
);

// ---- STRESS ----
const stressGroups = [0, 60, 120, 180, 240, 300].map((delay, index) =>
  tgWithWorkflow(
    threadGroup(`Stress step ${index + 1} - add 50 VU`, 50, 10, 370 - delay, delay),
    index === 5 ? listener("StatVisualizer", "Aggregate Report") : "",
  ),
).join("\n");
const stress = wrap("23127334_Stress_20260811", stressGroups, 0.3);

// ---- SPIKE (two thread groups: baseline + burst) ----
const spikeBaseline = tgWithWorkflow(threadGroup("Spike - baseline 10 VU", 10, 5, 245, 0), "");
const spikeBurst = tgWithWorkflow(threadGroup("Spike - burst +290 VU", 290, 5, 60, 60), listener("ViewResultsFullVisualizer", "View Results Tree"));
const spike = wrap("23127334_Spike_20260811", spikeBaseline + "\n" + spikeBurst, 0.3);

fs.writeFileSync(path.join(DIR, "23127334_Load_20260811.jmx"), load);
fs.writeFileSync(path.join(DIR, "23127334_Stress_20260811.jmx"), stress);
fs.writeFileSync(path.join(DIR, "23127334_Spike_20260811.jmx"), spike);
console.log("Generated 3 .jmx files in", DIR);
