# Formula Specification & Test Cases — Mobile Detailing Planner

- **Status:** Preparation specification — deterministic financial math for `job-costing-calculator.xlsx`
- **Product slug:** `mobile-detailing-planner`
- **Date:** 2026-11-24
- **Core rule:** All financial calculations are **100% deterministic**, derived solely from user-entered values. Never embed AI-guessed costs, assumed local tax rates, or unverified industry averages disguised as facts.

---

## 1. Canonical Variables & Units

| Symbol | Field Name | Unit | Valid Domain | Notes |
|---|---|---|---|---|
| `H` | `labor_hours` | `hours` | Finite number, `H >= 0` | Fractional hours allowed (e.g., `2.75`) |
| `R` | `hourly_labor_rate` | `USD/hour` | Finite number, `R >= 0` | User's own target wage or crew labor rate |
| `L` | `labor_cost` | `USD` | Derived: `H * R` | Entered labor component |
| `M` | `materials_cost` | `USD` | Finite number, `M >= 0` | Chemicals, pads, towels, consumables |
| `D` | `round_trip_miles` | `miles` | Finite number, `D >= 0` | Total travel distance for the job |
| `K` | `cost_per_mile` | `USD/mile` | Finite number, `K >= 0` | User-entered vehicle/fuel rate (not IRS tax advice) |
| `T` | `travel_cost` | `USD` | Derived: `D * K` | Travel component (or direct `USD >= 0` entry) |
| `O` | `allocated_overhead` | `USD` | Finite number, `O >= 0` | Direct entry OR `monthly_overhead / expected_monthly_jobs` where `expected_monthly_jobs > 0` |
| `C` | `total_cost` | `USD` | Derived: `L + M + T + O` | Total job cost before profit |
| `m_target` | `target_margin` | `%` (decimal `0..1`) | Finite number, `0 <= m_target < 1` | Rejects `< 0%` and `>= 100%` |
| `P_raw` | `target_price_unrounded` | `USD` | Derived: `C / (1 - m_target)` | Full floating-point precision |
| `P_quote` | `target_price_rounded` | `USD` | Derived: `ROUND(P_raw, 2)` | Rounded to nearest cent for quoting |
| `P_actual` | `actual_selling_price` | `USD` | Finite number, `P_actual >= 0` | Defaults to `P_quote` or user-entered override |
| `Profit` | `profit` | `USD` | Derived: `P_actual - C` | May be negative if `P_actual < C` (loss warning) |
| `m_actual` | `actual_margin` | `%` | Derived: `Profit / P_actual` if `P_actual > 0`, else `"N/A (Zero Revenue)"` | Never `#DIV/0!` |
| `u_actual` | `actual_markup` | `%` | Derived: `Profit / C` if `C > 0`, else `"N/A (Zero Cost)"` | Never `#DIV/0!` |

---

## 2. Deterministic Formulas

1. **Labor cost:**
   $$L = H \times R$$
2. **Travel cost:**
   $$T = D \times K$$
3. **Allocated overhead (when using monthly allocator):**
   $$O = \frac{\text{monthly\_fixed\_overhead}}{\text{expected\_monthly\_jobs}} \quad (\text{valid only when } \text{monthly\_fixed\_overhead} \ge 0 \text{ and } \text{expected\_monthly\_jobs} > 0)$$
4. **Total cost:**
   $$C = L + M + T + O$$
5. **Target selling price (unrounded):**
   $$P_{\text{raw}} = \frac{C}{1 - m_{\text{target}}} \quad (\text{valid only when } 0 \le m_{\text{target}} < 1)$$
6. **Quoted target selling price (rounded to nearest cent):**
   $$P_{\text{quote}} = \operatorname{ROUND}(P_{\text{raw}}, 2)$$
7. **Profit (at target quoted price or actual entered selling price $P$):**
   $$\text{Profit} = P - C$$
8. **Actual profit margin (only when $P > 0$):**
   $$m_{\text{actual}} = \begin{cases} \dfrac{P - C}{P} & \text{if } P > 0 \\ \text{"N/A (Zero Revenue)"} & \text{if } P = 0 \end{cases}$$
9. **Actual markup (only when $C > 0$):**
   $$u_{\text{actual}} = \begin{cases} \dfrac{P - C}{C} & \text{if } C > 0 \\ \text{"N/A (Zero Cost)"} & \text{if } C = 0 \end{cases}$$

### Margin vs. Markup Distinction (Required Explanation)
- **Margin** is profit as a percentage of **selling price**: $\text{Margin} = \frac{\text{Price} - \text{Cost}}{\text{Price}}$.
- **Markup** is profit as a percentage of **cost**: $\text{Markup} = \frac{\text{Price} - \text{Cost}}{\text{Cost}}$.
- For a `$100.00` job cost and a **40% target margin**:
  - Correct target-margin price: `100 / (1 - 0.40) = $166.666666...` -> rounds to **`$166.67`** (`$66.67` profit, **`66.67%` markup**).
  - Common mistake (40% markup): `100 * (1 + 0.40) = $140.00` (`$40.00` profit, only **`28.57%` margin** — underprices the job by `$26.67`).

---

## 3. Rounding Policy & Displayed vs. Calculated Values

1. **Intermediate precision:** All intermediate terms (`L`, `T`, `O`, `C`, `P_raw`) retain full unrounded floating-point precision inside spreadsheet formulas. Do **not** round `L`, `T`, or `O` individually before summing `C` (prevents compounding penny drift on fractional hours/miles).
2. **Quoted selling price rounding:** `P_quote = ROUND(P_raw, 2)` uses standard spreadsheet half-away-from-zero rounding to 2 decimal places (`$0.01`).
3. **Profit & actual margin from quoted price:** Because customers pay the rounded quoted price (`$166.67`), **Quoted Profit** is computed as `ROUND(P_quote - C, 2)` (e.g., `$166.67 - $100.00 = $66.67`), and **Actual Margin at Quoted Price** is `(P_quote - C) / P_quote` (e.g., `66.67 / 166.67 = 0.40001199976...`, displayed to 1 decimal place as `40.0%` or 2 decimal places as `40.00%`).
4. **Display formatting:**
   - Currency cells: `$#,##0.00;-$#,##0.00;$0.00`
   - Percentage cells: `0.0%` (or `0.00%` in audit/comparison views)
   - Hours & Miles: `0.00`
5. **Audit transparency:** The calculator shows `P_quote` prominently and notes in helper text that `$0.01` rounding on the quoted price can shift displayed actual margin by `< 0.01%`.

---

## 4. Input Validation & Error-Handling Rules

Every calculated output checks input validity first using standard Excel functions (`ISNUMBER`, `< 0`, `>= 1`) so invalid inputs **never** silently produce misleading numbers or raw `#DIV/0!` / `#VALUE!` errors:

| Invalid Condition | Expected Output Behavior |
|---|---|
| Any cost/quantity input (`H`, `R`, `M`, `D`, `K`, `O`, `P_actual`) is `< 0` | `"ERR: Negative input"` |
| Any numeric input is non-numeric / text / non-finite (`NOT(ISNUMBER(x))` or error cell) | `"ERR: Invalid number"` |
| `target_margin < 0` or `target_margin >= 1` (i.e., `< 0%` or `>= 100%`) | `"ERR: Margin must be 0% to <100%"` |
| `expected_monthly_jobs <= 0` (when using monthly overhead allocator) | `"ERR: Jobs/month must be > 0"` |
| `selling_price == 0` (valid non-negative comped/zero-revenue job) | Profit = `-C`; Actual Margin = `"N/A (Zero Revenue)"` (no `#DIV/0!`) |
| `total_cost == 0` (valid zero-cost edge case) | Target Price = `$0.00`; Markup = `"N/A (Zero Cost)"` (no `#DIV/0!`) |

### Explicit Omissions
- No sales tax, VAT, GST, income tax, or self-employment tax calculations.
- No assumed local tax rates or official mileage-deduction advice.
- No payment-processing fees or tips unless explicitly entered by the user.

---

## 5. Hand-Calculated Test Fixtures (11 Required Cases)

All expected values below are hand-calculated and must be verified against an independent spreadsheet engine recalculation in Step 7 (QA).

| Case ID | Scenario | Inputs (`H`, `R`, `M`, `D`, `K`, `O`, `m_target`, `P_actual_override`) | Expected `C` (Total Cost) | Expected `P_raw` (Unrounded) | Expected `P_quote` (Rounded) | Expected `Profit` | Expected `m_actual` | Expected `u_actual` | Expected Status |
|---|---|---|---|---|---|---|---|---|---|
| `TC-01` | **Canonical `$100 @ 40%` margin** | `H=2, R=25` (`L=50`), `M=20`, `D=20, K=0.50` (`T=10`), `O=20`, `m_target=40%`, no override | `$100.00` | `$166.666666...` | `$166.67` | `$66.67` | `40.00%` (`0.400012`) | `66.67%` (`0.6667`) | `OK` |
| `TC-02` | **Fractional quantities** | `H=2.75, R=32.50` (`L=89.375`), `M=18.45`, `D=14.5, K=0.67` (`T=9.715`), `O=22.50` (`$900/40`), `m_target=35%`, no override | `$140.04` | `$215.4461538...` | `$215.45` | `$75.41` | `35.00%` (`0.350012`) | `53.85%` (`0.538489`) | `OK` |
| `TC-03` | **Zero cost** | `H=0, R=0, M=0, D=0, K=0, O=0`, `m_target=40%`, no override | `$0.00` | `$0.00` | `$0.00` | `$0.00` | `"N/A (Zero Revenue)"` | `"N/A (Zero Cost)"` | `OK` |
| `TC-04` | **Zero selling price (comped job)** | `H=1.5, R=30` (`L=45`), `M=15`, `D=10, K=0.50` (`T=5`), `O=10`, `m_target=40%`, `P_actual=0` | `$75.00` | `$125.00` (target) | `$125.00` (target) | `-$75.00` (at `P_actual=0`) | `"N/A (Zero Revenue)"` | `-100.00%` (`-1.0`) | `OK` (loss warning) |
| `TC-05` | **Zero target margin (breakeven)** | `L=60, M=15, T=10, O=15` (`C=100`), `m_target=0%`, no override | `$100.00` | `$100.00` | `$100.00` | `$0.00` | `0.00%` | `0.00%` | `OK` |
| `TC-06` | **High valid target margin (`99%`)** | `L=60, M=15, T=10, O=15` (`C=100`), `m_target=99%`, no override | `$100.00` | `$10,000.00` | `$10,000.00` | `$9,900.00` | `99.00%` | `9,900.00%` | `OK` |
| `TC-07` | **Large valid values (fleet/RV job)** | `H=24, R=75` (`L=1800`), `M=450`, `D=120, K=1.25` (`T=150`), `O=600`, `m_target=45%`, no override | `$3,000.00` | `$5,454.545454...` | `$5,454.55` | `$2,454.55` | `45.00%` (`0.45000046`) | `81.82%` (`0.818183`) | `OK` |
| `TC-08` | **Loss-making actual quote (`P < C`)** | `C=120.00`, `m_target=30%`, `P_actual=100.00` | `$120.00` | `$171.428571...` | `$171.43` (target) | `-$20.00` (at `P_actual=100`) | `-20.00%` (`-0.20`) | `-16.67%` (`-0.166667`) | `OK` (loss warning) |
| `TC-09` | **Invalid negative inputs** | Any of `H=-1`, `R=-25`, `M=-5`, `D=-10`, `K=-0.5`, `O=-10`, `P_actual=-50`, or `m_target=-5%` | `"ERR: Negative input"` (or margin err for `m_target<0`) | Rejected | Rejected | Rejected | Rejected | Rejected | `ERROR` |
| `TC-10` | **Invalid target margin `>= 100%`** | `C=100.00`, `m_target=100%` (`1.0`) and `m_target=120%` (`1.2`) | `$100.00` | `"ERR: Margin must be 0% to <100%"` | Rejected | Rejected | Rejected | Rejected | `ERROR` |
| `TC-11` | **Non-numeric / zero-jobs overhead** | `H="abc"` OR `expected_monthly_jobs=0` in allocator | `"ERR: Invalid number"` / `"ERR: Jobs/month must be > 0"` | Rejected | Rejected | Rejected | Rejected | Rejected | `ERROR` |
