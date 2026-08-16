/**
 * Generate the endurance/soak plan: 300 VU, no think-time (tt_mult=0),
 * ramp 60s, sustained 720s (12 min). Reuses the shared workflow fragment so
 * the soak exercises the exact same E2E workflow, just at saturating load.
 * Usage: node testplans/gen-endurance.js
 */
const fs = require("fs");
const path = require("path");
const DIR = __dirname;
const fragment = fs.readFileSync(path.join(DIR, "_workflow-fragment.xml"), "utf8").trim();

const CONFIG = `<ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Request Defaults" enabled="true">
  <elementProp name="HTTPsampler.Arguments" elementType="Arguments"><collectionProp name="Arguments.arguments"/></elementProp>
  <stringProp name="HTTPSampler.domain">localhost</stringProp><stringProp name="HTTPSampler.port">3000</stringProp>
  <stringProp name="HTTPSampler.protocol">http</stringProp></ConfigTestElement>
<hashTree/>
<HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
  <collectionProp name="HeaderManager.headers"><elementProp name="" elementType="Header">
  <stringProp name="Header.name">Content-Type</stringProp><stringProp name="Header.value">application/json</stringProp></elementProp></collectionProp></HeaderManager>
<hashTree/>
<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV users" enabled="true">
  <stringProp name="delimiter">,</stringProp><stringProp name="filename">../data/users.csv</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp><boolProp name="recycle">true</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp><boolProp name="stopThread">false</boolProp>
  <stringProp name="variableNames">email,password</stringProp></CSVDataSet>
<hashTree/>
<CSVDataSet guiclass="TestBeanGUI" testclass="CSVDataSet" testname="CSV products" enabled="true">
  <stringProp name="delimiter">,</stringProp><stringProp name="filename">../data/products.csv</stringProp>
  <boolProp name="ignoreFirstLine">true</boolProp><boolProp name="recycle">true</boolProp>
  <stringProp name="shareMode">shareMode.all</stringProp><boolProp name="stopThread">false</boolProp>
  <stringProp name="variableNames">product_id,search_keyword,product_name,price</stringProp></CSVDataSet>
<hashTree/>`;

const TG = `<ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Endurance - 300 VU sustained (no think)" enabled="true">
  <stringProp name="ThreadGroup.on_sample_error">continue</stringProp>
  <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" testname="Loop Controller" enabled="true">
    <boolProp name="LoopController.continue_forever">false</boolProp><stringProp name="LoopController.loops">-1</stringProp></elementProp>
  <stringProp name="ThreadGroup.num_threads">300</stringProp><stringProp name="ThreadGroup.ramp_time">60</stringProp>
  <boolProp name="ThreadGroup.scheduler">true</boolProp><stringProp name="ThreadGroup.duration">720</stringProp>
  <stringProp name="ThreadGroup.delay">0</stringProp><boolProp name="ThreadGroup.same_user_on_next_iteration">false</boolProp></ThreadGroup>`;

const indent = (s, n) => s.split("\n").map((l) => (l.length ? " ".repeat(n) + l : l)).join("\n");

const out = `<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3"><hashTree>
<TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="23127334_Endurance_20260811" enabled="true">
  <boolProp name="TestPlan.functional_mode">false</boolProp><boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
  <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" testname="UDV"><collectionProp name="Arguments.arguments">
    <elementProp name="tt_mult" elementType="Argument"><stringProp name="Argument.name">tt_mult</stringProp><stringProp name="Argument.value">0</stringProp><stringProp name="Argument.metadata">=</stringProp></elementProp>
  </collectionProp></elementProp></TestPlan>
<hashTree>
${indent(CONFIG, 0)}
${indent(TG, 0)}
<hashTree>
${indent(fragment, 0)}
</hashTree>
</hashTree></hashTree></jmeterTestPlan>`;

fs.writeFileSync(path.join(DIR, "23127334_Endurance_20260811.jmx"), out);
console.log("wrote testplans/23127334_Endurance_20260811.jmx");
