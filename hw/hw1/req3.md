# Requirement 3 – Test Cases for One Physical Product (40 pts)

### Device Information

| Field | Details |
|-------|---------|
| **Type** | Electric Rice Cooker (Nồi cơm điện) |
| **Brand** | Kangaroo |
| **Model** | [YOUR_MODEL — check bottom label] |
| **Year** | [YOUR_YEAR] |
| **Serial Number** | [XX-****-XX — middle 4 chars masked] |

**Device Photo (with Student ID card in same frame):**

![Device photo with Student ID](img/req3/device_photo.jpg)

---

### 15 Test Cases

> **Verdict:** PASS / FAIL / BLOCKED / N/A
> **Videos (≥ 5, each ≤ 60s):** TC01, TC05, TC08, TC13, TC15
> **Edge cases AI missed:** TC13 ⭐, TC14 ⭐, TC15 ⭐

---

#### TC01 — Nấu cơm trắng bình thường (Cook White Rice — Normal)
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the rice cooker cooks white rice correctly using the default Cook mode |
| **Input** | 2 cups white rice, water filled to the "2" mark on inner pot |
| **Steps** | 1. Rinse 2 cups of white rice until water runs clear<br>2. Place rice in inner pot, fill water to "2" line<br>3. Insert inner pot into cooker body<br>4. Close lid firmly<br>5. Press **Cook (Nấu)** button<br>6. Wait for auto-switch to Warm (Keep Warm LED activates)<br>7. Wait 10 more minutes, then open lid and inspect rice |
| **Expected** | Cook LED lights up; rice fully cooked (not mushy, not undercooked) after cycle completes; auto-switch to Warm occurs; no burning smell |
| **Actual** | |
| **Verdict** | |

---

#### TC02 — Chức năng Nấu nhanh (Quick Cook)

| | |
|---|---|
| **Objective** | Verify the Quick Cook mode reduces cooking time compared to normal Cook mode |
| **Input** | 1 cup white rice, water to "1" mark |
| **Steps** | 1. Place 1 cup rice + water to "1" line in inner pot<br>2. Close lid<br>3. Press **Nấu Nhanh (Quick Cook)** button<br>4. Record start time<br>5. Wait for auto-switch to Warm<br>6. Record end time; inspect rice quality |
| **Expected** | Quick Cook activates; cooking completes faster than normal mode; rice is edible (may be slightly less fluffy); total cycle shorter than normal Cook |
| **Actual** | |
| **Verdict** | |

---

#### TC03 — Chức năng Hâm nóng (Reheat)

| | |
|---|---|
| **Objective** | Verify the Reheat function warms leftover cold rice to a safe serving temperature |
| **Input** | 1 cup cold cooked rice (room temperature, stored overnight) |
| **Steps** | 1. Place cold cooked rice in inner pot<br>2. Insert pot, close lid<br>3. Press **Hâm Nóng (Reheat)** button<br>4. Wait for cycle to complete (LED indicator changes)<br>5. Open lid and check rice temperature |
| **Expected** | Reheat activates; rice reaches 65–75°C after cycle; rice evenly warmed; no burning smell; no dried-out texture |
| **Actual** | |
| **Verdict** | |

---

#### TC04 — Hẹn giờ nấu (Delay Timer Cook)

| | |
|---|---|
| **Objective** | Verify the delay timer starts cooking at the scheduled time |
| **Input** | 2 cups white rice + water to "2" mark; timer set to 30 minutes from now |
| **Steps** | 1. Place rice and water in inner pot, close lid<br>2. Press **Timer** button<br>3. Set delay time to 30 minutes using +/− buttons<br>4. Press **Cook** to confirm and activate timer<br>5. Note current time<br>6. Wait and verify cooker starts cooking after exactly 30 minutes |
| **Expected** | Timer display shows countdown; cooker stays in standby for 30 minutes; Cook mode activates automatically at scheduled time; Cook LED turns on at correct moment |
| **Actual** | |
| **Verdict** | |

---

#### TC05 — Chức năng Cháo (Porridge Mode)
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the Porridge mode produces correct consistency rice porridge |
| **Input** | 1 cup white rice + water to the Porridge mark (approx. 1:8 rice-to-water ratio) |
| **Steps** | 1. Place 1 cup rice in inner pot<br>2. Fill water to the Porridge level mark (or ~8x water by volume)<br>3. Close lid<br>4. Press **Cháo (Porridge)** button<br>5. Wait for full cycle to complete<br>6. Open lid, stir, and check consistency |
| **Expected** | Porridge mode activates; cycle longer than normal Cook; result is soft runny porridge (not solid rice); no burning or overflow from steam vent |
| **Actual** | |
| **Verdict** | |

---

#### TC06 — Chức năng Hấp (Steam Mode)

| | |
|---|---|
| **Objective** | Verify the Steam mode successfully steams food using the steam basket |
| **Input** | 2 cups water in inner pot; 2 eggs placed in steam basket |
| **Steps** | 1. Pour 2 cups of water into the inner pot (no rice)<br>2. Place 2 eggs in the steam basket/tray<br>3. Insert basket above water level, close lid<br>4. Press **Hấp (Steam)** button<br>5. Set time to 15 minutes<br>6. Wait for completion; check if eggs are hard-boiled |
| **Expected** | Steam mode activates; steam visible from vent during operation; eggs fully hard-boiled after 15 minutes; water partially remains in pot (not fully evaporated) |
| **Actual** | |
| **Verdict** | |

---

#### TC07 — Giữ ấm sau khi nấu xong (Auto Keep-Warm After Cooking)

| | |
|---|---|
| **Objective** | Verify the cooker auto-switches to Keep-Warm and maintains safe rice temperature for 60 minutes |
| **Input** | Completed Cook cycle with 2 cups cooked rice inside |
| **Steps** | 1. After any Cook cycle completes and Warm LED activates<br>2. Leave in Warm mode for 60 minutes without opening lid<br>3. At 30-minute mark, open lid and measure rice surface temperature<br>4. At 60-minute mark, open lid and measure again<br>5. Inspect rice for excessive dryness or burning |
| **Expected** | Warm LED stays ON continuously; rice temperature between 60–80°C at both checkpoints; rice not burned or excessively dried |
| **Actual** | |
| **Verdict** | |

---

#### TC08 — Hủy giữa chừng (Cancel Mid-Cycle)
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the cooker stops immediately and safely when Cancel is pressed during an active Cook cycle |
| **Input** | Active Cook cycle, 5 minutes in progress, 1 cup rice + water |
| **Steps** | 1. Start Cook mode with 1 cup rice + water<br>2. Wait 5 minutes (rice partially cooking, steam visible)<br>3. Press **Cancel / Warm** button<br>4. Observe LED status change immediately<br>5. Wait 1 minute; carefully touch outer body<br>6. Open lid after 2 minutes; inspect state of rice |
| **Expected** | Cook LED turns off immediately upon pressing Cancel; Warm LED may activate; no burning smell; outer body temperature stops rising; rice is partially cooked (raw center) — expected behavior for mid-cancel |
| **Actual** | |
| **Verdict** | |

---

#### TC09 — Nấu Gạo lứt (Brown Rice Mode)

| | |
|---|---|
| **Objective** | Verify Brown Rice mode cooks brown rice to a fully edible texture |
| **Input** | 1 cup brown rice (soaked 30 min beforehand) + water to Brown Rice "1" mark |
| **Steps** | 1. Soak 1 cup brown rice in water for 30 minutes<br>2. Drain, place in inner pot, fill water to Brown Rice "1" mark<br>3. Close lid<br>4. Press **Gạo Lứt (Brown Rice)** button<br>5. Wait for full cycle + auto-switch to Warm<br>6. Wait 10 additional minutes; open lid and inspect |
| **Expected** | Brown Rice mode activates; cycle duration longer than white rice (~50–60 min); rice fully cooked, chewy but not hard; no burning smell |
| **Actual** | |
| **Verdict** | |

---

#### TC10 — Chức năng Sữa chua (Yogurt Mode)

| | |
|---|---|
| **Objective** | Verify Yogurt mode maintains a consistent low temperature (~40–45°C) suitable for fermentation |
| **Input** | 500ml fresh milk + 2 tbsp plain yogurt starter, mixed in a glass jar inside the pot |
| **Steps** | 1. Warm milk to ~40°C, mix with yogurt starter in a glass jar<br>2. Place jar inside inner pot (no water needed)<br>3. Close lid<br>4. Press **Sữa Chua (Yogurt)** button<br>5. Set time to 8 hours<br>6. After 8 hours, check yogurt texture (should be firm/set) |
| **Expected** | Yogurt mode activates at ~40–45°C; after 8 hours yogurt is set and spoonable; no burning; display shows remaining time throughout |
| **Actual** | |
| **Verdict** | |

---

#### TC11 — Chức năng Hâm nóng đơn lẻ (Standalone Reheat — Cold Start)

| | |
|---|---|
| **Objective** | Verify Reheat works correctly when activated directly from cold start, without a prior Cook cycle |
| **Input** | Cold inner pot (room temp); 1 cup cold cooked rice from refrigerator |
| **Steps** | 1. Plug in cooker (cold start — not previously used)<br>2. Place cold rice from fridge directly in inner pot<br>3. Insert pot, close lid<br>4. Press **Hâm Nóng (Reheat)** directly — do NOT press Cook first<br>5. Wait for full Reheat cycle to complete<br>6. Open lid and check rice temperature |
| **Expected** | Reheat activates without requiring a prior Cook cycle; rice warmed evenly to 65–75°C; no error message; cycle completes normally |
| **Actual** | |
| **Verdict** | |

---

#### TC12 — Thay đổi thời gian nấu thủ công (Manual Cook Time Adjustment)

| | |
|---|---|
| **Objective** | Verify that the +/− buttons correctly adjust the cooking duration and the adjusted time is used |
| **Input** | 1 cup white rice + water; manual time reduced by 5 minutes from default |
| **Steps** | 1. Place rice and water in pot, close lid<br>2. Press **Cook** button<br>3. Before cycle locks in, press **−** button once to reduce time by 5 min<br>4. Confirm display updates (e.g., 30 → 25 minutes)<br>5. Press **Cook** again to confirm adjusted time<br>6. Wait for cycle; inspect rice |
| **Expected** | Display updates correctly when −/+ pressed; confirmed time is used for cooking; rice is cooked (may be slightly firmer at −5 min — acceptable) |
| **Actual** | |
| **Verdict** | |

---

#### TC13 — Mở nắp ngay khi đang nấu ⭐ *Edge Case — AI Missed*
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the cooker's safety behavior when lid is opened during an active Cook cycle |
| **Input** | Active Cook cycle with 1 cup rice + water, 10 minutes into cooking |
| **Steps** | 1. Start Cook mode (1 cup rice + water)<br>2. Wait 10 minutes (active boiling phase, steam visible)<br>3. Using a cloth to protect hands from steam, carefully open the lid<br>4. Leave lid open for 30 seconds — observe all behavior<br>5. Close lid again<br>6. Observe if cooking continues or stops |
| **Expected** | Cooker continues heating (basic models have no lid sensor); steam escapes safely — no burst or explosion; after lid is closed, cooking resumes and completes normally; no error code; no burning smell |
| **Actual** | |
| **Verdict** | |

> **Why AI missed this:** AI only generates test cases from documented intended usage. Opening the lid mid-cook is explicitly discouraged in every rice cooker manual, so AI skips it. However this is a critical real-world safety scenario — users frequently open the lid to check water absorption. Testing it reveals whether the cooker has a lid sensor (smart models) or continues heating unguarded (basic models).

---

#### TC14 — Đặt hẹn giờ 0 giờ 0 phút ⭐ *Edge Case — AI Missed*

| | |
|---|---|
| **Objective** | Verify the cooker handles a timer value of 0:00 (zero boundary input) without crashing or undefined behavior |
| **Input** | 1 cup rice + water; Timer button pressed; delay reduced to 0 hours 0 minutes |
| **Steps** | 1. Place rice and water in pot, close lid<br>2. Press **Timer** button<br>3. Press **−** repeatedly until display shows 0:00<br>4. Observe display at 0:00 (does it allow this value?)<br>5. Press **Cook** to confirm<br>6. Observe what the cooker does next |
| **Expected** | Either (a) cooker starts cooking immediately (0 delay = cook now), OR (b) cooker rejects 0:00 and jumps to minimum value (e.g., 0:30 min). Any defined, non-crashing behavior is acceptable. An undefined display, freeze, or reboot is a FAIL |
| **Actual** | |
| **Verdict** | |

> **Why AI missed this:** AI-generated test cases for physical appliances rarely apply zero-boundary testing to hardware UI controls. Timer inputs are assumed to start from some minimum (1 or 30 minutes). Testing exactly 0:00 is a Boundary Value Analysis (BVA) technique applied to physical device controls — AI does not spontaneously apply BVA to hardware unless explicitly prompted with testing methodology context.

---

#### TC15 — Nấu khi nồi không có nước/gạo (Empty Pot Dry-Run) ⭐ *Edge Case — AI Missed*
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the cooker's thermal protection activates when Cook mode is started with a completely empty, dry inner pot |
| **Input** | Completely empty and dry inner pot (no rice, no water) |
| **Steps** | 1. Insert a completely empty and dry inner pot<br>2. Close lid<br>3. Press **Cook** button<br>4. Observe behavior for up to 3 minutes — do NOT leave unattended<br>5. Watch for: auto-shutoff, error code on display, unusual sounds, burning smell<br>6. If cooker shuts off automatically, record the time elapsed |
| **Expected** | Within 1–3 minutes, the thermal cutoff (thermostat) triggers and cooker auto-switches to Warm or shuts off; OR an error/warning is displayed. No burning smell from inner pot or heating element; no permanent damage to the device |
| **Actual** | |
| **Verdict** | |

> **Why AI missed this:** AI assumes all test preconditions are properly met (rice + water present) because it learns from product documentation that always describes correct usage. The empty-pot dry-run is a real accidental scenario (user forgets water) and a critical thermal safety test — it reveals whether the thermostat/thermal fuse protects against overheating when there is no liquid to absorb heat. AI cannot reason about accidental misuse scenarios involving physical thermal stress on hardware.

---

### Test Execution Summary

| TC# | Test Case | Executed? | Video? | Defect? | Verdict |
|-----|-----------|:---------:|:------:|:-------:|---------|
| TC01 | Nấu cơm trắng | | Yes | | |
| TC02 | Nấu nhanh | | | | |
| TC03 | Hâm nóng | | | | |
| TC04 | Hẹn giờ nấu | | | | |
| TC05 | Cháo | | Yes | | |
| TC06 | Hấp | | | | |
| TC07 | Giữ ấm | | | | |
| TC08 | Hủy giữa chừng | | Yes | | |
| TC09 | Gạo lứt | | | | |
| TC10 | Sữa chua | | | | |
| TC11 | Hâm nóng đơn lẻ | | | | |
| TC12 | Thay đổi thời gian | | | | |
| TC13 ⭐ | Mở nắp khi đang nấu | | Yes | | |
| TC14 ⭐ | Hẹn giờ 0:00 | | | | |
| TC15 ⭐ | Nấu nồi trống | | Yes | | |

---

### YouTube Unlisted Video Links

| # | TC# | YouTube Link | Duration |
|---|-----|-------------|---------|
| V1 | TC01 | [YOUR_LINK] | ≤60s |
| V2 | TC05 | [YOUR_LINK] | ≤60s |
| V3 | TC08 | [YOUR_LINK] | ≤60s |
| V4 | TC13 | [YOUR_LINK] | ≤60s |
| V5 | TC15 | [YOUR_LINK] | ≤60s |

---

### Defects Found During Execution

> Logged as **GitHub Issues** in this repository.
> Attach screenshot of Issues page showing your GitHub username.

| Bug # | TC# | Description | Severity | GitHub Issue Link |
|-------|-----|-------------|----------|------------------|
| BUG-01 | | | | |
| BUG-02 | | | | |
| BUG-03 | | | | |
| BUG-04 | | | | |
| BUG-05 | | | | |

**GitHub Issues Screenshot:**

![GitHub Issues page showing username](img/req3/github_issues.png)
