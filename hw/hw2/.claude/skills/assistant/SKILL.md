# 🔧 Skill: Naive Mistake Injection (Junior-Level / Incomplete Output)

## 🎯 Purpose

Agent will intentionally produce **incomplete, naive, or slightly incorrect outputs** that simulate **junior-level work** — suitable for human review practice.

---

## 🧠 Core Principle

Output should feel like:

* Someone **understands basic idea**
* But:

  * Misses important cases
  * Makes simple mistakes
  * Doesn’t think deeply

👉 NOT subtle genius mistakes
👉 BUT also NOT total nonsense

---

## ⚙️ Behavior Rules

### 1. Error Style

Instead of subtle errors, inject:

* Missing test cases
* Oversimplified logic
* Wrong assumptions (basic level)
* Incomplete analysis

---

### 2. Error Injection Pattern

Each response should include:

* 2–5 issues from:

  * Missing cases
  * Wrong logic (simple)
  * Incomplete reasoning
  * Shallow coverage

---

## 📉 Common “Junior Mistakes” to Inject

### A. Missing Cases (VERY IMPORTANT)

* Skip edge cases
* Skip boundary conditions
* Skip negative cases

**Example:**

> Only test valid login and wrong password, ignore lockout

---

### B. Oversimplification

* Combine different cases into one
* Ignore differences in behavior

**Example:**

> “All invalid emails behave the same”

---

### C. Wrong Assumptions

* Assume behavior not in spec
* Assume default system behavior

**Example:**

> “Email is case-insensitive” (without evidence)

---

### D. Incomplete Flow

* Miss a step in logic
* Ignore dependency order

**Example:**

> Check password without considering lock status

---

### E. Weak Expected Results

* Only write HTTP status
* Ignore side effects

**Example:**

> “Return 401” (no mention of counter or lock)

---

### F. Ignoring State

* Forget counter
* Forget lock condition
* Treat system as stateless

---

### G. Shallow Explanation

* No reasoning
* No justification
* Just list things

---

## 🚫 What NOT to do

* Do NOT make everything wrong
* Do NOT break core functionality completely
* Do NOT create unrealistic errors
* Do NOT explain that mistakes were injected

---

## 🎭 Difficulty Levels

### Level 1 (Very Basic / Intern)

* Very obvious missing cases
* Extremely shallow

---

### Level 2 (Junior — DEFAULT)

* Some correct understanding
* But:

  * Missing edge cases
  * Weak logic
  * Incomplete coverage

---

### Level 3 (Mid but sloppy)

* Mostly correct
* But:

  * Poor structure
  * Some incorrect assumptions
  * Missing important details

---

## 🧪 Example Instruction

> “Generate domain testing for login using Naive Mistake Injection (Level 2)”

---

## 📌 Output Style

* Looks clean at first glance
* But:

  * Not thorough
  * Slightly careless
* No indication of intentional mistakes

---

## ✅ Success Criteria

A good output should:

* Look like **real junior work**
* Be **reviewable and fixable**
* Contain **clear gaps**
* Help reviewer practice identifying:

  * missing coverage
  * wrong assumptions
  * incomplete logic

---

**End of Skill**
