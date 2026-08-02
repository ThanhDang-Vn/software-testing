from pathlib import Path
import csv


ROOT = Path(__file__).resolve().parents[1]
CHECKLIST_DIR = ROOT / "task-1-gui-checklist"
SOURCE_FILE = CHECKLIST_DIR / "gui-checklist.csv"

COLUMNS = [
    "ID",
    "Screen",
    "IA",
    "Category",
    "Check",
    "Requirement or Heuristic Source",
    "Preconditions",
    "Test Steps",
    "Expected Result",
    "Source",
    "Why AI Missed It",
    "Human Review or Modification",
    "Status",
    "Actual Result",
    "Notes",
    "Evidence",
    "Bug ID or GitHub Issue",
]

SUPPORTING_COLUMNS = COLUMNS + ["Recommended Test Suite"]
EXECUTION_FIELDS = [
    "Status",
    "Actual Result",
    "Notes",
    "Evidence",
    "Bug ID or GitHub Issue",
]

MOVE_WHOLE = {
    "GUI-L-012": ("Data integrity", "Functional"),
    "GUI-L-015": ("Functional", "Functional"),
    "GUI-L-016": ("Functional", "Functional"),
    "GUI-L-017": ("Functional", "Integration"),
    "GUI-L-018": ("Functional", "Integration"),
    "GUI-L-019": ("Security", "Security"),
    "GUI-O-014": ("Security", "Security"),
}

MIXED = {
    "GUI-L-011": {
        "gui": {
            "ID": "GUI-L-011A",
            "Check": "Empty required fields show visible form validation",
            "Test Steps": "Submit without entering values and inspect the visible form response",
            "Expected Result": "Visible validation identifies both required fields near their controls",
        },
        "support": {
            "ID": "GUI-L-011B",
            "Check": "Empty submission does not send a login API request",
            "Test Steps": "Monitor network traffic and submit the form with both fields empty",
            "Expected Result": "No login API request is sent",
            "Recommended Test Suite": "Integration",
        },
    },
    "GUI-L-024": {
        "gui": {
            "ID": "GUI-L-024A",
            "Check": "Repeated submit shows a clear pending state",
            "Test Steps": "Submit once, then immediately double-click the button and press Enter repeatedly",
            "Expected Result": "The submit control visibly indicates a pending state and prevents repeated activation",
        },
        "support": {
            "ID": "GUI-L-024B",
            "Check": "Repeated submit produces only one login request",
            "Test Steps": "Monitor network traffic while rapidly repeating submit actions",
            "Expected Result": "Only one login request is processed while the first request is pending",
            "Recommended Test Suite": "Performance",
        },
    },
    "GUI-O-002": {
        "gui": {
            "ID": "GUI-O-002A",
            "Check": "Each visible order row includes ID, date, total, and current status",
            "Test Steps": "Inspect every displayed order row",
            "Expected Result": "Every row visibly contains all four FR-11 fields",
        },
        "support": {
            "ID": "GUI-O-002B",
            "Check": "Displayed order values match the order API response",
            "Test Steps": "Compare each displayed row with the authenticated order API response",
            "Expected Result": "ID, date, total, and status match the source data",
            "Recommended Test Suite": "Integration",
        },
    },
    "GUI-O-024": {
        "gui": {
            "ID": "GUI-O-024A",
            "Check": "Cancel action shows timely visible success or failure feedback",
            "Test Steps": "Perform a cancel action once under success conditions and once under failure conditions",
            "Expected Result": "Visible feedback clearly communicates success or failure without ambiguity",
        },
        "support": {
            "ID": "GUI-O-024B",
            "Check": "Cancel result persists the correct order state",
            "Test Steps": "Cancel an eligible order and verify its persisted state through the API or a fresh retrieval",
            "Expected Result": "Successful cancellation persists the expected state; failure preserves the prior state",
            "Recommended Test Suite": "Functional",
        },
    },
}

PRIMARY_SCOPE = {
    "GUI-L-008": "GUI / Visual",
    "GUI-O-022": "Usability",
}


def requirement_source(row):
    category = row["Category"]
    if row["ID"].startswith("GUI-L"):
        specific = {
            "Email type": "FR-02; FR-22",
            "Password masking": "FR-22",
            "Required indicators": "FR-22",
            "Keyboard order": "FR-21",
        }
    else:
        specific = {
            "Required data": "FR-11",
            "Currency": "FR-11; FR-21",
            "Status translation": "FR-11",
            "Status distinction": "FR-11; WCAG 1.4.1",
            "Color independence": "WCAG 1.4.1",
            "Table semantics": "WCAG table semantics",
        }
    defaults = {
        "IA-01": "FR-21; general GUI heuristic",
        "IA-02": "FR-22; form usability heuristic",
        "IA-03": "FR-23; navigation heuristic",
        "IA-04": "FR-24; visibility of system status",
    }
    return specific.get(category, defaults[row["IA"]])


def normalize(row):
    output = {
        "ID": row["ID"],
        "Screen": row["Screen"],
        "IA": row["IA"],
        "Category": row["Category"],
        "Check": row["Check"],
        "Requirement or Heuristic Source": requirement_source(row),
        "Preconditions": row["Preconditions"],
        "Test Steps": row["Test Action"],
        "Expected Result": row["Expected Result"],
        "Source": row["Source"],
        "Why AI Missed It": (
            "[TO BE COMPLETED BY STUDENT]"
            if row["Source"] == "Human Added"
            else ""
        ),
        "Human Review or Modification": (
            "AI-generated item revised during human review."
            if row["Source"] == "Refined"
            else ""
        ),
    }
    for field in EXECUTION_FIELDS:
        output[field] = ""
    return output


def write_csv(path, columns, rows):
    with path.open("w", encoding="utf-8-sig", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=columns)
        writer.writeheader()
        writer.writerows(rows)


with SOURCE_FILE.open(encoding="utf-8-sig", newline="") as handle:
    source_rows = list(csv.DictReader(handle))

gui_rows = []
support_rows = []
migration_rows = []

for source_row in source_rows:
    row = normalize(source_row)
    original_id = row["ID"]
    if original_id in MOVE_WHOLE:
        scope, suite = MOVE_WHOLE[original_id]
        moved = dict(row)
        moved["Recommended Test Suite"] = suite
        support_rows.append(moved)
        migration_rows.append(
            {
                "Original ID": original_id,
                "New ID": original_id,
                "What was moved": row["Check"],
                "Why it was moved": f"Primary scope is {scope}, outside the focused GUI checklist.",
            }
        )
        continue

    if original_id in MIXED:
        split = MIXED[original_id]
        gui = dict(row)
        gui.update(split["gui"])
        gui_rows.append(gui)

        supporting = dict(row)
        supporting.update(split["support"])
        support_rows.append(supporting)
        migration_rows.extend(
            [
                {
                    "Original ID": original_id,
                    "New ID": gui["ID"],
                    "What was moved": "Visible UI assertion retained in the GUI checklist.",
                    "Why it was moved": "Separated the user-visible behavior from its non-GUI assertion.",
                },
                {
                    "Original ID": original_id,
                    "New ID": supporting["ID"],
                    "What was moved": supporting["Check"],
                    "Why it was moved": "Backend, network, persistence, or request-processing assertion moved to supporting tests.",
                },
            ]
        )
        continue

    if original_id in PRIMARY_SCOPE:
        row["Category"] = PRIMARY_SCOPE[original_id]
    gui_rows.append(row)

write_csv(CHECKLIST_DIR / "revised-gui-checklist.csv", COLUMNS, gui_rows)
write_csv(
    CHECKLIST_DIR / "non-gui-supporting-tests.csv",
    SUPPORTING_COLUMNS,
    support_rows,
)
write_csv(
    CHECKLIST_DIR / "migration-log.csv",
    ["Original ID", "New ID", "What was moved", "Why it was moved"],
    migration_rows,
)

print(f"GUI rows: {len(gui_rows)}")
print(f"Supporting rows: {len(support_rows)}")
print(f"Migration rows: {len(migration_rows)}")
