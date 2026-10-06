import "app/app.css";
import { React, render, useHexData } from "app/_data.js";
import { HexSlider, HexDropdown } from "app/controls.js";
import { TIERS } from "app/format.js";
import {
  Takeaway,
  HeadlineComparison,
  ProfitGainByMarket,
  GatewayProducts,
  SecondOrderSpeed,
  MarketLoyalty,
  GatewayLift,
  LoyalSpend,
} from "app/charts.js";

var h = React.createElement;

function Eyebrow({ children }) {
  return h("div", { className: "label", style: {
    color: "var(--color-accent-warm-text, var(--color-text-muted))",
    marginBottom: "var(--space-2)",
  } }, children);
}

function SectionHeading({ children }) {
  return h("h2", { className: "h2", style: { margin: 0, marginBottom: "var(--space-2)" } }, children);
}

function HeadlineHeading() {
  const state = useHexData("01a10530-cae2-737d-9155-4266068facfe");
  const rows = state.rows || [];
  const loyal = rows.find((r) => r.customer_group === "Loyal");
  const notLoyal = rows.find((r) => r.customer_group === "Not loyal");
  const loyalRpc = loyal ? Number(loyal.revenue_per_customer) : NaN;
  const notLoyalRpc = notLoyal ? Number(notLoyal.revenue_per_customer) : NaN;
  const hasMultiplier = Number.isFinite(loyalRpc) && Number.isFinite(notLoyalRpc) && notLoyalRpc > 0;
  const multiplier = hasMultiplier ? Math.round((loyalRpc / notLoyalRpc) * 10) / 10 : null;
  const style = { margin: 0, marginBottom: "var(--space-2)" };
  return hasMultiplier
    ? h("h2", { className: "h2", style }, `Loyal Customers Drive ${multiplier}x Revenue`)
    : h("h2", { className: "h2", style }, "Loyal Customers Drive More Revenue");
}

function GatewayHeading() {
  const state = useHexData("01a10379-0dd0-7643-a8ea-34f5a7d2318c");
  const rows = state.rows || [];
  const sorted = rows
    .filter((r) => r.sub_category != null && Number.isFinite(Number(r.loyal_rate)))
    .sort((a, b) => Number(b.loyal_rate) - Number(a.loyal_rate));
  const style = { margin: 0, marginBottom: "var(--space-2)" };
  const top = sorted[0];
  const second = sorted[1];
  if (top && second) {
    return h("h2", { className: "h2", style },
      `Customers whose first purchase is ${top.sub_category} or ${second.sub_category} are the most likely to become loyal`);
  }
  if (top) {
    return h("h2", { className: "h2", style },
      `Customers whose first purchase is ${top.sub_category} are the most likely to become loyal`);
  }
  return h("h2", { className: "h2", style }, "A customer's first purchase shapes how likely they are to become loyal");
}

function LoyalSpendHeading() {
  const state = useHexData("01a104c2-60c0-7248-97f9-eccd14264402");
  const rows = state.rows || [];
  const negatives = rows
    .filter((r) => r.sub_category != null && Number.isFinite(Number(r.loyal_profit)) && Number(r.loyal_profit) < 0)
    .sort((a, b) => Number(a.loyal_profit) - Number(b.loyal_profit))
    .map((r) => r.sub_category);
  const style = { margin: 0, marginBottom: "var(--space-2)" };
  const list = (arr) => arr.length <= 1
    ? (arr[0] || "")
    : arr.slice(0, -1).join(", ") + " and " + arr[arr.length - 1];
  if (negatives.length === 1) {
    return h("h2", { className: "h2", style },
      `Loyal customers are profitable in every sub-category except ${negatives[0]}, which loses money despite winning loyalty`);
  }
  if (negatives.length > 1) {
    return h("h2", { className: "h2", style },
      `Loyal customers are profitable in most sub-categories, but lose money on ${list(negatives)}`);
  }
  return h("h2", { className: "h2", style },
    "Loyal customers spend profitably across every sub-category");
}

function Section({ children, style }) {
  return h("section", { style: Object.assign({
    display: "flex", flexDirection: "column", gap: "var(--space-4)",
    paddingTop: "var(--space-12)",
  }, style || {}) }, children);
}

function Divider() {
  return h("div", { style: {
    height: 1, margin: "var(--space-12) 0 0",
    background: "linear-gradient(90deg, transparent, var(--color-border), transparent)",
  } });
}

function Source({ children }) {
  return h("div", { style: {
    marginTop: "var(--space-2)", fontSize: "var(--text-xs)",
    color: "var(--color-text-muted)",
  } }, "Source: ", h("code", null, children));
}

function TierLegend() {
  return h(
    "div",
    { style: { display: "flex", flexWrap: "wrap", gap: "var(--space-4)" } },
    TIERS.map((t) =>
      h("div", { key: t.label, style: { display: "flex", flexDirection: "column" } },
        h("span", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text)" } }, t.label),
        h("span", { style: { fontSize: "var(--text-xs)", color: "var(--color-text-muted)" } }, t.range),
      ),
    ),
  );
}

function Header() {
  return h(
    "header",
    {
      style: {
        position: "sticky", top: 0, zIndex: "var(--z-sticky, 10)",
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        padding: "var(--space-4) var(--space-6)",
        display: "flex", flexWrap: "wrap", alignItems: "center",
        justifyContent: "space-between", gap: "var(--space-6)",
      },
    },
    h("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)" } },
    ),
  );
}

function App() {
  return h(
    React.Fragment,
    null,
    h(Header),
    h(
      "main",
      { className: "app-container", style: { paddingBottom: "var(--space-16)" } },

      // Intro
      h(Section, { style: { paddingTop: "var(--space-10)" } },
        h("h1", { className: "h1", style: { margin: 0, maxWidth: "18ch" } }, "How to Build Customer Loyalty @Superstore 🛒"),
        h("p", { style: { margin: 0, maxWidth: "62ch", color: "var(--color-text-muted)", fontSize: "var(--text-lg)", lineHeight: "var(--leading-relaxed)" } },
          "Loyal customers (7+ orders) make up a third of Superstore\u0027s customer base and 55% of revenue. This analysis looks at each market to show how first-time buyers become loyal, and where to focus next"),
        h(TierLegend),
      ),

      h(Divider),

      // Headline comparison
      h(Section, null,
        h("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "var(--space-6)" } },
          h("div", { style: { display: "flex", flexDirection: "column", gap: "var(--space-1)", minWidth: 240, maxWidth: 360 } },
            h(HexSlider, {
              cellRef: "01a102fe-bec2-76ba-9aaa-a60a8f24ac81",
              label: "Orders needed to count as loyal",
              formatValue: (v) => v + (v === 1 ? " order" : " orders"),
            }),
            h("span", { style: { fontSize: "var(--text-xs)", color: "var(--color-text-muted)" } },
              "Loyalty is based on lifetime orders; the Year and Market filters apply to every chart"),
          ),
          h(HexDropdown, { cellRef: "01a1086b-420b-70e8-bc12-99eb6a7fedaa", label: "Year" }),
          h(HexDropdown, { cellRef: "01a10506-86b9-72e4-bdfb-50b6b42a2f23", label: "Market" }),
        ),
        h(HeadlineHeading),
        h(HeadlineComparison),
        h(Source, null, "loyal_revenue_by_year"),
      ),

      h(Divider),

      // Drill-down
      h(Section, null,
        h(SectionHeading, null, "Geographic Distribution"),
        h("div", null,
          h(MarketLoyalty),
          h(Source, null, "market_loyalty"),
        ),
      ),

      h(Divider),

      // What-if
      h(Section, null,
        h(SectionHeading, null, "Turning Regulars into Loyal customers adds the most profit in EU and APAC"),
        h("p", { style: { margin: 0, maxWidth: "62ch", color: "var(--color-text-muted)", fontSize: "var(--text-sm)" } },
          "This view uses the fixed Regular (4–6) and Loyal (7+) tiers"),
        h("div", {
          style: {
            display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(220px, 1fr)",
            gap: "var(--space-6)", alignItems: "start",
          },
        },
          h("div", null, h(ProfitGainByMarket), h(Source, null, "market_conversion")),
          h("div", {
            style: {
              background: "var(--color-bg-muted)", borderRadius: "var(--radius)",
              padding: "var(--space-5)", display: "flex", flexDirection: "column", gap: "var(--space-2)",
            },
          },
            h("span", { style: { fontSize: "var(--text-sm)", fontWeight: "var(--font-weight-semibold)", color: "var(--color-text)" } }, "Scenario"),
            h("p", { style: { margin: 0, fontSize: "var(--text-sm)", color: "var(--color-text-muted)" } },
              "Move this share of each market's Regular customers up into the Loyal tier."),
            h(HexSlider, {
              cellRef: "01a10525-69d5-709f-a028-fd76bf27c22f",
              label: "Regulars converted",
              formatValue: (v) => v + "%",
            }),
          ),
        ),
      ),

      h(Divider),

      // What drives loyalty
      h(Section, null,
        h(GatewayHeading),
        h(GatewayProducts),
        h(Source, null, "gateway_products"),
        h("div", { style: { marginTop: "var(--space-8)" }, "data-testid": "gateway-lift-wrap" },
          h(GatewayLift),
          h(Source, null, "gateway_lift_by_market"),
        ),
        h("div", { style: { marginTop: "var(--space-8)" } },
          h(LoyalSpendHeading),
          h(LoyalSpend),
          h(Source, null, "loyal_spend"),
        ),
        h("div", {
          style: {
            display: "grid", gridTemplateColumns: "minmax(0, 1fr)", gap: "var(--space-4)",
            marginTop: "var(--space-8)",
          },
        },
          h(SecondOrderSpeed),
          h(Source, null, "second_order_speed"),
        ),
      ),
    ),
  );
}

render(h(App));
