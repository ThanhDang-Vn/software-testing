# AI Critique (245 words)

The AI was useful for translating repetitive test-case structure into typed,
data-driven Playwright code, but its first result was incomplete in an important
way: it automated only FR-02 and treated a successful three-browser run as if
the assignment were nearly complete. The rubric actually requires the same
three features selected in HW02, one from each of Pools A, B, and C, and at
least twelve logical cases for every feature. This omission happened because
the initial context focused on one feature and the AI did not first build a
rubric-to-deliverable checklist or inspect HW02. A generic “complete the
automation” interpretation therefore optimized the visible code instead of the
submission as a whole.

The AI also initially risked making tests agree with defective behavior. Human
review preserved the specification as the oracle: the login attempt counter
must increase by one, lockout starts after three failures, and expires after
thirty seconds even though the implementation behaves differently. Similar
care is necessary for FR-11 shipping-order cancellation and FR-14 validation.
Passing tests are not automatically good tests; changing an assertion to match
a bug merely hides evidence.

Another limitation is that AI cannot produce attributable evidence required by
the course. It must not fabricate an execution report, GitHub Issue,
multi-day commit history, narrated video, voice, face-cam, `whoami`, or
`hostname` evidence. Those outputs require real student action and actual
execution. My main lesson is to collaborate with AI through explicit stages:
extract the rubric, locate the authoritative specification, map every
deliverable, generate one feature at a time, review selectors and state setup,
then validate discovery and real reports. AI accelerates implementation, while
the student remains responsible for scope, oracle quality, evidence integrity,
and final judgment.
