---
'magawa': patch
---

Replace Small Store, Immer, and RxJS with a Signals-based game store while
preserving action subscriptions and development logging. Replace Preact Router
and History with native hash routing, including browser navigation and
normalization of query strings and trailing slashes. Freeze the timer when a
game ends and prevent stale highscore responses after restarting.
