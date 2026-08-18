# AI Critique

The AI was productive at generating breadth, but its output was not reliable enough to become a test oracle without human audit. The workbook contains 120 AI-generated cases, of which 89 were VALID, 7 INVALID, and 24 INCOMPLETE. These verdicts show a recurring weakness: the model often converted an unstated assumption into an exact boundary or expected status.

`REG-AI-002` is a concrete example. The AI described a one-character name as the minimum boundary and expected HTTP 200, although the supplied contract did not define a minimum name length. The student marked the case INCOMPLETE, changed its technique from BVA to an equivalence partition for a valid non-empty string under the current contract, renamed the test accordingly, and retained the observable success and persistence checks. Similarly, `REG-AI-003` assumed that an emoji must be accepted. The correction removed the emoji, used the clearly representable Unicode name “Nguyễn Ánh,” and preserved UTF-8 round-trip verification.

The audit also refused to repair unsupported expectations silently. `CPN-AI-016` remained INVALID because it demanded exact fractional monetary values while acknowledging that no rounding policy existed. It was not used as the oracle for the verified percentage-calculation defect; that defect instead used 500,000, whose 10% result is exact.

The main lesson is that AI is useful for proposing partitions, state paths, and security hypotheses, but not for deciding missing requirements. Each proposed oracle must be traced to a contract, ambiguous cases must remain visible, and execution evidence must be separated from test-quality verdicts. Human review should narrow scope, correct technique labels, and reject invented boundaries before automation or bug reporting.

Evidence: [`23127334_HW06_AI_Audit.md`](../../23127334_HW06_AI_Audit.md) and [`23127334_HW06_API_TestCases.xlsx`](../../testcases/23127334_HW06_API_TestCases.xlsx).
