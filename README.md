# How to Build Customer Loyalty @Superstore

A Hex project for sales and marketing executives: who Superstore's loyal customers are (7+ orders), what turns a first-time buyer into one, and where to focus by market. Loyalty is never driven by discounts in this analysis.

| File | What it is |
|---|---|
| `Know_thy_customers.yaml` | Full Hex project export (notebook + Generative App) |
| `Know_thy_customers.ipynb` | Jupyter export of the notebook |
| `app/App.js` | Generative App layout code |

## Notebook → app lineage

Data flows in one direction: **CSV → 2 foundations → 1 dataframe per analysis → app chart**. Every app chart reads exactly one notebook dataframe, and each chart shows a `Source:` caption naming it.

### 1. Foundations (notebook only)

| Dataframe | Built from | One row is | Role |
|---|---|---|---|
| `superstore_sales` | `superstore.csv` | One product on an order | Raw source, column `column00` renamed to `line_id` |
| `customer_summary` | `superstore_sales` | One customer (market + customer ID) | Lifetime orders, sales and profit per customer |
| `order_lines_enriched` | `superstore_sales` + `customer_summary` | One product on an order | Order lines tagged with the customer's lifetime orders and a first-order flag |
| `customer_order_history` | `superstore_sales` | One order line for customer BS-1800 | Data check: one customer's history across markets |
| `order_id_shared_by_customers` | `superstore_sales` | One order ID | Data check: order IDs reused across customers |

### 2. Analysis dataframes and where they appear in the app

| App section | App chart | Dataframe | Built from | Global inputs | Local inputs |
|---|---|---|---|---|---|
| Headline | Loyal vs not loyal: customers and revenue | `loyal_revenue_by_year` | `order_lines_enriched` | Threshold, Market, Year | — |
| Geographic Distribution | Loyal rate by market | `market_loyalty` | `customer_summary` (+ `order_lines_enriched` for Year) | Threshold, Market, Year | — |
| What if | Added profit if Regulars convert to Loyal, by market | `market_conversion` (Python) | `customer_summary` (+ `order_lines_enriched` for Year) | Market, Year | Convert % |
| What drives loyalty | Loyal rate by first-purchase sub-category | `gateway_products` | `order_lines_enriched` | Threshold, Market, Year | — |
| What drives loyalty | Furniture-first lift by market | `gateway_lift_by_market` | `order_lines_enriched` | Threshold, Market, Year | — |
| What drives loyalty | Loyal customers' spend and margin by sub-category | `loyal_spend` | `order_lines_enriched` | Threshold, Market, Year | — |
| What drives loyalty | Loyal rate by time to second order | `second_order_speed` | `order_lines_enriched` + `customer_summary` | Threshold, Market, Year | — |
| Notebook only | — | `loyal_threshold` | `customer_summary` | Threshold | — |
| Notebook only | — | `segment_loyalty` | `customer_summary` (+ `order_lines_enriched` for Year) | Threshold, Market, Year | — |

### 3. Inputs

| Input | Variable | Scope | Default | Notes |
|---|---|---|---|---|
| Loyalty threshold | `loyal_order_threshold` | Global | 7 | Orders needed to count as loyal. Not used by What if, which uses fixed tiers (Regular 4–6, Loyal 7+) |
| Market | `market` | Global | All | Filters every chart |
| Year | `order_year` | Global | All | Filters every chart. Loyalty is still based on lifetime orders |
| Convert % | `convert_pct` | Local (What if) | 10 | Share of each market's Regulars moved to Loyal |

### How the app connects to the notebook

- **Controls** in the app set the notebook inputs.
- **Charts** read notebook dataframes by cell ID (`useHexData` in `charts.js`). Changing a cell's logic updates the chart; renaming a column the chart uses breaks it.
- **Section titles and takeaways** are text written in the app code.
