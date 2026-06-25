## Requirement 3 – Test Cases for One Physical Product (40 pts) {#requirement-3}

### Device Information

| Field | Details |
|-------|---------|
| **Type** | Air Fryer (Nồi chiên không dầu) |
| **Brand** | [YOUR_BRAND] |
| **Model** | [YOUR_MODEL — check bottom label] |
| **Year** | [YOUR_YEAR] |
| **Serial Number** | [XX-****-XX — middle 4 chars masked] |

**Device Photo (with Student ID card in same frame):**

![Device photo with Student ID](img/req3/device_photo.jpg)

---

> **Verdict:** PASS / FAIL / BLOCKED / N/A
> **Videos (≥ 5, each ≤ 60s):** TC01, TC05, TC06, TC14, TC15
> **Edge cases AI missed:** TC13 ⭐, TC14 ⭐, TC15 ⭐

---

### 15 Test Cases

---

#### TC01 — Chiên khoai tây đông lạnh (Fry Frozen French Fries — Normal)
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the air fryer cooks frozen french fries correctly using default Fry mode at recommended settings |
| **Input** | 200g frozen french fries (pre-packaged, no added oil); temperature 200°C; time 15 minutes |
| **Steps** | 1. Place 200g frozen fries evenly in the basket (single layer)<br>2. Insert basket into the fryer body<br>3. Set temperature to **200°C** using +/− button<br>4. Set time to **15 minutes**<br>5. Press **Start** button<br>6. At the 8-minute mark, open basket, shake fries, reinsert<br>7. Wait for cycle to complete; inspect fries |
| **Expected** | Heating element activates; fan runs; fries are golden-brown and crispy after 15 min; no raw/frozen center; no burning smell; device auto-stops at 0:00 |
| **Actual** | |
| **Verdict** | |

---

#### TC02 — Điều chỉnh nhiệt độ (Temperature Adjustment)

| | |
|---|---|
| **Objective** | Verify the temperature control buttons correctly increase/decrease the set temperature and the fryer operates stably at the target |
| **Input** | Empty basket; adjust temperature to 180°C then to 220°C |
| **Steps** | 1. Power on device<br>2. Note default temperature on display<br>3. Press **+** repeatedly until display reads maximum allowed value<br>4. Press **−** repeatedly until display reads 180°C<br>5. Press **Start**; allow to run for 3 minutes<br>6. Press **Cancel**; note no error occurred |
| **Expected** | Display updates in defined increments (e.g., 5°C steps); values do not exceed stated max or go below stated min; device runs stably at set temp; no error codes |
| **Actual** | |
| **Verdict** | |

---

#### TC03 — Cài đặt thời gian (Timer Setting)

| | |
|---|---|
| **Objective** | Verify the timer can be set to a specific duration and the device stops automatically when time reaches 0 |
| **Input** | Empty basket; temperature 180°C; timer set to 5 minutes |
| **Steps** | 1. Power on device<br>2. Set temperature to 180°C<br>3. Set timer to **5 minutes** using +/− buttons<br>4. Press **Start**; note start time<br>5. Wait for auto-stop; note elapsed time<br>6. Verify device stopped at exactly 5 minutes |
| **Expected** | Countdown displays on screen; device stops heating/fan exactly at 0:00; beep or alert sounds at completion; total elapsed time matches set duration |
| **Actual** | |
| **Verdict** | |

---

#### TC04 — Chức năng làm nóng trước (Preheat Function)

| | |
|---|---|
| **Objective** | Verify the Preheat function heats the basket to target temperature before food insertion |
| **Input** | Empty basket; preheat at 200°C for 3 minutes |
| **Steps** | 1. Power on device with empty basket<br>2. Press **Preheat** button (if dedicated) OR set temp 200°C + time 3 min<br>3. Press **Start**<br>4. Wait for preheat cycle to complete<br>5. Carefully touch outer body (should be warm but not scalding)<br>6. Insert food immediately after preheat ends |
| **Expected** | Device heats up during preheat; fan runs; no error; outer body warm but safe; preheat completes within set time; ready indicator activates |
| **Actual** | |
| **Verdict** | |

---

#### TC05 — Nướng đùi gà (Roast Chicken Drumsticks)
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the air fryer fully cooks chicken drumsticks at recommended settings without burning or undercooking |
| **Input** | 2 chicken drumsticks (~300g total), lightly seasoned and dried; temperature 200°C; time 25 minutes |
| **Steps** | 1. Pat drumsticks dry with paper towel; apply light seasoning<br>2. Place in basket — do not stack<br>3. Set temperature to **200°C**, time to **25 minutes**<br>4. Press **Start**<br>5. At 12-minute mark, open basket, flip drumsticks, reinsert<br>6. Wait for cycle to complete; cut thickest part to check doneness |
| **Expected** | Skin golden-brown and crispy after 25 min; internal meat cooked through (no pink at bone); no burning smell; device auto-stops; juices run clear when pierced |
| **Actual** | |
| **Verdict** | |

---

#### TC06 — Hủy giữa chừng (Cancel Mid-Cycle)
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the fryer stops immediately and safely when Cancel is pressed during an active cooking cycle |
| **Input** | Active cooking cycle at 200°C, 5 minutes into a 15-minute session |
| **Steps** | 1. Start a cooking cycle (200°C / 15 min)<br>2. Wait 5 minutes (fan running, heating active)<br>3. Press **Cancel / Stop** button<br>4. Observe display and fan behavior immediately<br>5. Wait 1 minute; attempt to open basket<br>6. Touch outer body — note temperature |
| **Expected** | Heating stops immediately; fan may continue briefly for cool-down; display resets or shows standby; basket can be safely opened after cool-down; no error state; device ready to restart |
| **Actual** | |
| **Verdict** | |

---

#### TC07 — Kéo giỏ ra khi đang chạy (Pull Basket During Operation — Auto-Pause)

| | |
|---|---|
| **Objective** | Verify the air fryer automatically pauses when the basket is pulled out mid-cycle and resumes when reinserted |
| **Input** | Active cooking cycle at 180°C, 3 minutes into session |
| **Steps** | 1. Start cooking cycle (180°C / 10 min)<br>2. Wait 3 minutes<br>3. Pull basket fully out of the fryer body<br>4. Hold basket out for 10 seconds — observe display and heating<br>5. Reinsert basket fully<br>6. Observe whether cooking resumes automatically or requires manual restart |
| **Expected** | Heating and fan stop immediately when basket is removed (safety auto-pause); display shows paused state or countdown holds; cooking resumes automatically or prompts user to restart when basket is reinserted |
| **Actual** | |
| **Verdict** | |

---

#### TC08 — Chức năng Hâm nóng thức ăn (Reheat Leftover Food)

| | |
|---|---|
| **Objective** | Verify Reheat mode warms leftover food to safe serving temperature without overcooking |
| **Input** | 1 serving cold cooked french fries (room temperature, stored 4 hours); temperature 160°C; time 4 minutes |
| **Steps** | 1. Place cold leftover fries in basket (single layer)<br>2. Set temperature to **160°C**, time to **4 minutes**<br>3. Press **Start**<br>4. Wait for cycle to complete<br>5. Remove fries and check temperature and texture |
| **Expected** | Fries reheated to ~65–75°C (warm throughout); texture crispy again (not soggy); no burning; no smoke from reheated oil residue |
| **Actual** | |
| **Verdict** | |

---

#### TC09 — Nướng bánh (Bake Mode — Cake/Bread)

| | |
|---|---|
| **Objective** | Verify baking function produces evenly baked result using lower temperature over longer duration |
| **Input** | Small baking tin with pre-mixed muffin batter (~150g); temperature 160°C; time 20 minutes |
| **Steps** | 1. Prepare muffin batter in a small baking tin that fits inside the basket<br>2. Place tin inside basket — do not cover<br>3. Set temperature to **160°C**, time to **20 minutes**<br>4. Press **Start**<br>5. Do NOT open during baking<br>6. At completion, insert toothpick — check if it comes out clean |
| **Expected** | Muffin fully baked after 20 min; toothpick test clean; top lightly golden; no raw center; no burning on bottom; steam vented safely |
| **Actual** | |
| **Verdict** | |

---

#### TC10 — Cài nhiệt độ tối đa (Maximum Temperature Boundary)

| | |
|---|---|
| **Objective** | Verify the device handles the maximum temperature setting without error and does not exceed hardware limits |
| **Input** | Empty basket; temperature set to maximum (e.g., 230°C); time 3 minutes |
| **Steps** | 1. Power on device with empty basket<br>2. Press **+** until temperature can no longer increase (max reached)<br>3. Note the maximum temperature displayed<br>4. Set time to 3 minutes; press **Start**<br>5. Run for full 3 minutes; observe for error codes, unusual smell, or shutdown<br>6. Press Cancel; wait for cool-down |
| **Expected** | Temperature does not exceed stated max; no error codes; device runs stably; no burning smell from components; auto-stops at 0:00 |
| **Actual** | |
| **Verdict** | |

---

#### TC11 — Chức năng nhắc đảo thức ăn (Shake / Food Turn Reminder)

| | |
|---|---|
| **Objective** | Verify the shake reminder alert triggers at the mid-point of a cooking cycle to prompt the user to turn food |
| **Input** | 200g frozen fries in basket; temperature 200°C; time 16 minutes (reminder expected at ~8 min) |
| **Steps** | 1. Place fries in basket<br>2. Set temperature 200°C / time 16 minutes<br>3. Press **Start**<br>4. Wait without touching device<br>5. At ~8-minute mark, listen/watch for reminder alert (beep or display message)<br>6. Note whether alert fires, what it shows, and whether device pauses or continues |
| **Expected** | Shake reminder alert (beep + display message) fires at approximately the midpoint (~8 min); device may auto-pause or continue; alert clears after basket pull-and-reinsert or button press |
| **Actual** | |
| **Verdict** | |

---

#### TC12 — Chiên hai mẻ liên tiếp (Back-to-Back Consecutive Cycles)

| | |
|---|---|
| **Objective** | Verify the device operates correctly for two consecutive cooking cycles without cool-down, simulating typical household use |
| **Input** | 1st cycle: 200g fries at 200°C / 15 min; 2nd cycle starts immediately after 1st completes |
| **Steps** | 1. Run first full cooking cycle (200°C / 15 min) to completion<br>2. Remove cooked food immediately<br>3. Insert second batch of food without waiting<br>4. Start second cycle at same settings<br>5. Monitor for error codes, overheating shutdown, or performance degradation<br>6. Inspect food from 2nd cycle for quality |
| **Expected** | Second cycle starts normally; device does not trigger thermal overload or error; 2nd batch cooks to same quality as 1st; no error codes; no unusual sounds or smells |
| **Actual** | |
| **Verdict** | |

---

#### TC13 — Chiên thức ăn ướt/tẩm ướp nhiều (Wet/Over-Marinated Food — Safety) ⭐ *Edge Case — AI Missed*

| | |
|---|---|
| **Objective** | Verify the air fryer handles food with excessive liquid marinade safely without triggering smoke, splatter, or fire hazard |
| **Input** | 200g chicken pieces heavily marinated in soy sauce + oil (dripping liquid visible); temperature 200°C; time 20 minutes |
| **Steps** | 1. Prepare chicken pieces with excess marinade — do NOT pat dry<br>2. Place in basket; marinade liquid will pool at bottom<br>3. Set 200°C / 20 minutes; press **Start**<br>4. Observe for smoke from exhaust vent during first 5 minutes<br>5. Do NOT leave unattended — watch for excessive smoke or burning smell<br>6. Complete cycle or cancel if smoke becomes excessive; inspect basket and drip tray after |
| **Expected** | Minor steam/vapor normal; white smoke from marinade drip is expected but should not trigger fire alarm or fill room; drip tray catches excess liquid; device does not shut down from smoke; food cooked properly despite wet input |
| **Actual** | |
| **Verdict** | |

> **Why AI missed this:** AI generates test cases from documented "correct usage" — manuals always say "pat food dry before air frying." Heavily wet/marinated food is a common real-world scenario (users skip the drying step) and a safety-relevant test that reveals whether the drip tray design handles liquid pooling and whether smoke triggers any protection mechanism. AI cannot reason about deviations from documented proper technique.

---

#### TC14 — Cài đặt thời gian về 0 phút (Timer Set to 0:00 — BVA Boundary) ⭐ *Edge Case — AI Missed*
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the device handles a timer value of 0 minutes (zero boundary) without undefined behavior, crash, or uncontrolled operation |
| **Input** | Empty basket; any temperature; timer reduced to 0:00 via − button |
| **Steps** | 1. Power on device with empty basket<br>2. Set temperature to 180°C<br>3. Press **Time/Timer** button<br>4. Press **−** repeatedly until display shows **0:00** or minimum value<br>5. Observe: does display allow 0:00 or wrap to a minimum?<br>6. Press **Start** and observe what happens |
| **Expected** | Either (a) device starts and stops immediately (0 min = instant stop), OR (b) device rejects 0:00 and snaps to minimum allowed time (e.g., 1 min). Any defined, non-crashing behavior is PASS. Device freezing, displaying garbage, running indefinitely, or rebooting is FAIL |
| **Actual** | |
| **Verdict** | |

> **Why AI missed this:** AI-generated test cases for physical appliances assume the timer always starts from a positive minimum value and never reaches zero before the Start button. Applying BVA to a hardware timer control — specifically testing the exact 0:00 boundary — requires deliberate testing methodology that AI does not spontaneously apply to embedded device UI without explicit prompting.

---

#### TC15 — Chạy khi không có giỏ (Run Without Basket — Thermal Safety) ⭐ *Edge Case — AI Missed*
*[Video required]*

| | |
|---|---|
| **Objective** | Verify the air fryer's thermal protection or basket-detection mechanism activates when Start is pressed with no basket installed |
| **Input** | Basket completely removed from fryer body; fryer plugged in and powered on |
| **Steps** | 1. Power on device<br>2. Remove basket completely — do NOT insert it<br>3. Set temperature to 200°C / time to 5 minutes<br>4. Press **Start**<br>5. Observe for up to 2 minutes — do NOT leave unattended<br>6. Watch for: error code, auto-shutoff, beep warning, or device running with exposed heating element |
| **Expected** | Device detects missing basket and shows error code / warning beep, OR refuses to start. If device lacks basket sensor: heating element activates without airflow — device should trigger thermal cutoff within 1–2 min. Running indefinitely without shutdown is a FAIL (fire/burn hazard) |
| **Actual** | |
| **Verdict** | |

> **Why AI missed this:** AI assumes all physical preconditions are correctly set (basket installed, food present) because it learns from product documentation written for correct use. Running an air fryer without the basket is a real accidental scenario (user forgets to reinsert after cleaning) and a critical thermal safety test — it reveals whether the device has a basket-presence sensor or relies solely on thermal cutoff protection. This physical misuse scenario is beyond AI's spontaneous test generation without human safety-testing intuition.

---

### Test Execution Summary

| TC# | Test Case | Executed? | Video? | Defect? | Verdict |
|-----|-----------|:---------:|:------:|:-------:|---------|
| TC01 | Chiên khoai tây đông lạnh | | Yes | | |
| TC02 | Điều chỉnh nhiệt độ | | | | |
| TC03 | Cài đặt thời gian | | | | |
| TC04 | Làm nóng trước (Preheat) | | | | |
| TC05 | Nướng đùi gà | | Yes | | |
| TC06 | Hủy giữa chừng | | Yes | | |
| TC07 | Kéo giỏ ra khi đang chạy | | | | |
| TC08 | Hâm nóng thức ăn | | | | |
| TC09 | Nướng bánh | | | | |
| TC10 | Nhiệt độ tối đa | | | | |
| TC11 | Nhắc đảo thức ăn | | | | |
| TC12 | Chiên hai mẻ liên tiếp | | | | |
| TC13 ⭐ | Thức ăn ướt/tẩm ướp nhiều | | | | |
| TC14 ⭐ | Timer = 0:00 | | Yes | | |
| TC15 ⭐ | Chạy không có giỏ | | Yes | | |

---

### YouTube Unlisted Video Links

| # | TC# | YouTube Link | Duration |
|---|-----|-------------|---------|
| V1 | TC01 | [YOUR_LINK] | ≤60s |
| V2 | TC05 | [YOUR_LINK] | ≤60s |
| V3 | TC06 | [YOUR_LINK] | ≤60s |
| V4 | TC14 | [YOUR_LINK] | ≤60s |
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

---

## AI Audit Report {#ai-audit-report}

> Full AI-02 audit report with 5-section format for each artifact is in **[Appendix A — Prompt Log](appendix-a-prompt-log.md)**.

### Summary Table

| Artifact | AI Role | Student Verification | Student-Only Tasks |
|----------|---------|---------------------|-------------------|
| Job Market (Req 1) | Generated 10-posting table structure, AI impact analysis | Verified LinkedIn-only sourcing; replaced 3 non-LinkedIn entries | Take screenshots with own LinkedIn account name visible |
| Software Defects (Req 2) | Generated 20-defect table with AI bias notes | Verified/replaced 6 broken source links | Confirm each defect matches real reported incident |
| Test Cases (Req 3) | Generated 12 normal TCs + 3 edge case templates for air fryer | Reviewed TC format and edge case accuracy | Device photo with student ID; ≥5 execution videos; fill Actual/Verdict |
| Mindmap | Generated ISTQB-aligned mindmap draft | Identified and corrected 3 categorization errors | Validate against ISTQB CTFL 4.0 syllabus |
| Prompt Log | Generated log entries with timestamps | Reviewed for completeness | Sign Mandatory Disclosure |

---

## AI Critique {#ai-critique}

During this assignment, Claude (claude-sonnet-4-6) was used to assist with all three requirements. The AI performed well on structured, well-defined tasks but revealed predictable limitations when tasks required real-world judgment or physical context.

**Where AI performed well:** The AI generated clean, well-formatted Markdown tables for all three requirements without needing restructuring. For Requirement 2 (software defects), the AI correctly identified real CVEs and incidents from 2022–2026, wrote concise consequence descriptions, and — after prompting with the AI bias note requirement — produced thoughtful annotations for each defect explaining how AI might fail to detect it. For Requirement 3, the AI generated 12 functionally accurate test cases covering documented air fryer modes (fry, bake, roast, reheat, preheat, cancel, consecutive cycles, temperature/timer controls).

**Where AI failed and needed correction:** First, for Requirement 1, the AI initially returned job postings from multiple platforms (LinkedIn, ITviec, TopCV) despite the explicit "LinkedIn only" constraint. This required a follow-up correction prompt and manual replacement of 3 entries. Second, for Requirement 2, 6 source links were dead (404) — the AI generated plausible-looking but unverified URLs. This is a classic AI hallucination pattern: confident-sounding links that don't exist. Third, for Requirement 3, the AI generated 12 test cases from documented usage but could not generate the 3 edge cases (TC13–TC15) independently — it required explicit prompting with testing methodology context (BVA, safety misuse, forbidden actions) to produce them.

**Structural limitation:** The AI treats all physical device test cases as stateless — it does not model thermal states, time-dependent behavior, or real-world misuse. This is why edge cases like the no-basket dry-run, the 0:00 timer boundary, and the over-marinated food scenario are beyond AI's spontaneous generation capability. Human testers with physical device experience are still essential for safety-critical test design on embedded hardware.

**Overall assessment:** AI reduced implementation time significantly but required active supervision. Every AI output needed at minimum one round of human correction before it met the assignment's actual requirements.

---

## Mandatory Disclosure {#mandatory-disclosure}

AI tools (Claude claude-sonnet-4-6) were used to assist in generating: job posting table structure, defect descriptions and AI bias notes, test case templates, QA/QC mindmap draft, and prompt log. All AI-generated content was reviewed, corrected, and approved by me before inclusion. The following artifacts were produced entirely by me (no AI): device photo with student ID card, execution videos with voice narration, LinkedIn screenshots showing my account name, and GitHub Issues under my username. I confirm I did not use AI to generate any artifact in the prohibited category.
