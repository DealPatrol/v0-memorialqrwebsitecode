// Existing checkout and feed tests exercise the plaques as if on sale.
// scripts/plaques-coming-soon.test.ts covers the hidden state with an explicit "false".
process.env.KEEPSAKE_PLAQUES_ON_SALE ??= "true"
