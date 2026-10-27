// Existing checkout and feed tests exercise the plaques as if on sale.
// scripts/plaques-coming-soon.test.ts covers the hidden state with an explicit "false".
// Plain JavaScript so Node 18 can load it via --import. Node 18 rejects a
// .ts --import before the tsx hook is registered (ERR_UNKNOWN_FILE_EXTENSION).
process.env.KEEPSAKE_PLAQUES_ON_SALE ??= "true"
