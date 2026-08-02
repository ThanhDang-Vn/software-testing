from pathlib import Path
import csv

from openpyxl import load_workbook


root = Path(__file__).resolve().parents[1]
checklist_dir = root / "task-1-gui-checklist"
xlsx_path = checklist_dir / "gui-checklist-v1-reviewed.xlsx"
csv_path = checklist_dir / "gui-checklist-v1-reviewed.csv"
removed = {
    "Source",
    "Why AI Missed It",
    "Human Review or Modification",
}

workbook = load_workbook(xlsx_path)
sheet = workbook["V1 - Reviewed"]
headers = [cell.value for cell in sheet[1]]
for index in range(len(headers), 0, -1):
    if headers[index - 1] in removed:
        sheet.delete_cols(index)
workbook.save(xlsx_path)

with csv_path.open(encoding="utf-8-sig", newline="") as handle:
    reader = csv.DictReader(handle)
    columns = [column for column in reader.fieldnames if column not in removed]
    rows = list(reader)

with csv_path.open("w", encoding="utf-8-sig", newline="") as handle:
    writer = csv.DictWriter(handle, fieldnames=columns, extrasaction="ignore")
    writer.writeheader()
    writer.writerows(rows)

print(columns)
