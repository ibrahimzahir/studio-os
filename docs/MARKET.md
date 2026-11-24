# Market intelligence
Initial hypotheses: mobile detailing, residential cleaning, home bakery and guesthouse operations. Historical scores and prices are hypotheses, not verified current demand. Use authorized APIs and permitted research only.
Weights: search growth 25%, marketplace demand 20%, social velocity 20%, purchase intent 15%, cross-platform momentum 10%, competitive opportunity 10%.
Current implementation averages observations per metric, applies weights, and separately computes confidence. Production review requires all metrics, at least two declared platforms, confidence >=0.7 and score >=80. Freshness window: 30 days. These are initial engineering policy choices requiring calibration, not probability estimates. Platform names are caller-declared; verified source adapters and domain deduplication remain necessary.
No live trend/virality classifier exists yet. Add time-series baselines and compare cross-source velocity before labeling a niche trending or viral. Engagement never establishes purchase intent by itself.

## 24 November evidence refresh
Read BUYER-RESEARCH-2026-11-24.md before using earlier niche rankings. Public item-level reviews support investigation of editable host guides and caregiver organizers; the sampled detailing listings do not substantiate strong demand. US is a geographic test priority based on broad Etsy spending, not measured PDF demand. No reliable PDF-buyer age distribution was found; proposed age bands must stay labeled hypotheses. Validate our own paid demand before expanding volume.

European update: original video transcript retrieved directly; its 4:09–5:20 recommendation concerns paid acquisition in Netherlands/Sweden/Ireland and New Zealand (not Europe). Independent Eurostat data supports testing European online/digital buyers. See EUROPE-MARKET-UPDATE.md. Rank product × geography × channel; avoid treating US Etsy spending share as an ad-efficiency ranking.
