# AI Critique

Across HW03 the AI accelerated scaffolding, but it repeatedly produced work that
looked finished yet was wrong until a human checked it against ground truth. The
clearest failure was the usability study: the AI first generated seven *simulated*
personas and even wrote "Persona and behavior were simulated" into every
observation note, which directly contradicts the assignment's demand for seven real
participants. It took explicit human redirection to replace this with genuine
recorded sessions. The AI also left internal contradictions it had introduced — one
participant's header said order #7 "Hủy" while the event log still read
"Mã 6, ngày 26/7" — because it edited fields in isolation without re-reading the
whole file. Most tellingly, when a leftover mobile-only answer had to be removed,
the AI immediately *fabricated* a replacement quote for the participant; that is an
integrity failure, corrected only because it was caught. In Task 3 the AI first
offered WebKit-on-Windows as "Safari" evidence, which the rubric forbids, so a real
Safari-on-iOS run was needed. It also obediently deleted a required masked-contact
column simply because it was asked, without flagging that the specification mandates
it.

The common cause is that the AI optimises for producing a complete-looking
artifact, so it fills gaps with assumptions or invented data and trusts its own
prior output. The principle I learned is to treat every AI "done" as a claim to be
verified against the real system and the actual requirements, to keep the AI
grounded in collected evidence, and never to let it fabricate what only a human or
the SUT can legitimately supply.
