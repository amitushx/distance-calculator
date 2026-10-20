// Run with: node fees.test.js
const { payment } = require('./fees.js');

// Original implementation, copied verbatim, for comparison.
function feeByDistance(m) {
    if (m <= 100) return 3;
    let fee = 3;
    const tier = len => Math.ceil(len / 100);
    fee += tier(Math.min(Math.max(m - 100, 0), 900)) * 0.55;
    fee += tier(Math.min(Math.max(m - 1000, 0), 2000)) * 0.35;
    fee += tier(Math.min(Math.max(m - 3000, 0), 2000)) * 0.30;
    fee += tier(Math.max(m - 5000, 0)) * 0.20;
    return fee;
}
function feeForWalkers(m) {
    const tiers = [100, 150, 200, 250, 300, 350, 400, 450, 500, 550];
    for (let i = 0; i < tiers.length; i++) if (m <= tiers[i]) return 7 + i;
    return 16;
}
const original = (m, bonus, walker) =>
    Math.ceil((walker ? feeForWalkers(m) : feeByDistance(m)) * (1 + bonus / 100));

// Exhaustive comparison against the original
const diffs = [];
for (const walker of [false, true])
    for (const bonus of [0, 10, 20, 25, 30, 50])
        for (let m = 10; m <= 20000; m++) {
            const a = payment(m, bonus, walker), b = original(m, bonus, walker);
            if (a !== b) diffs.push({ m, bonus, walker, new: a, old: b,
                exact: (walker ? feeForWalkers(m) : feeByDistance(m)) * (1 + bonus / 100) });
        }
console.log(`Differences vs original: ${diffs.length}`);
console.table(diffs.slice(0, 15));

// Sample values
const rows = [];
for (const m of [50, 100, 101, 550, 551, 1000, 1300, 1700, 3000, 5000, 7350])
    rows.push({ meters: m, rider: payment(m), 'rider +20%': payment(m, 20),
                walker: payment(m, 0, true), 'walker +20%': payment(m, 20, true) });
console.table(rows);
