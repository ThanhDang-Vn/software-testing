# Human Candidate Decision History

## Decision 001 — 2026-08-17

- **User statement (verbatim):** "tôi thấy oke tôi đã đọc và duyệt oke hết bỏ prd-c04"
- **Interpretation applied:** approve every proposed candidate except PRD-C04.
- **Register:** REG-C01..REG-C07 selected → REG-H-001..REG-H-007.
- **Coupon:** CPN-C01..CPN-C07 selected → CPN-H-001..CPN-H-007.
- **Product selected:** PRD-C01, PRD-C02, PRD-C03, PRD-C05, PRD-C06, PRD-C07 → PRD-H-001..PRD-H-006.
- **Product removed:** PRD-C04 (description invalid-type candidate). It is not written as a human-added test and its ID is not reused.
- **Execution state:** none of the selected cases has been executed.
- **Audit state:** these are human-added cases; AI audit verdict is N/A.

## Decision 002 — 2026-08-17

- **User statement (verbatim):** "thiếu thì bổ sung đi"
- **Context:** P4 strict gate found fewer than 5 qualifying, non-overlapping human-added cases per selected POST endpoint.
- **Authorized additions:** two new Register logics, three new Coupon logics and three new Product logics.
- **New IDs:** REG-H-008..009, CPN-H-008..010, PRD-H-007..009.
- **Constraint honored:** previously removed candidate PRD-C04 was not restored.
- **Primary endpoint rule:** every new case directly tests its selected POST endpoint; setup/supporting requests are not counted as separate cases.
- **Execution state:** not executed.
