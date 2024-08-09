// src/components/TransactionPieChart.tsx
import React, { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Transaction } from "@/types/types";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { useTheme } from "next-themes";

const TransactionPieChart: React.FC<{
  transactions: Transaction[];
  onCategorySelect: (category: string) => void;
}> = ({ transactions, onCategorySelect }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    if (!transactions.length || !chartRef.current) return;

    const categoryData = d3.rollup(
      transactions,
      (v) => d3.sum(v, (d) => Math.abs(parseFloat(d.amount))),
      (d) => d.category
    );

    const data = Array.from(categoryData, ([category, amount]) => ({
      category,
      amount,
    }));

    data.sort((a, b) => b.amount - a.amount);

    const width = 600;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3
      .select(chartRef.current)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d.category))
      .range(d3.schemeCategory10);

    const pie = d3
      .pie<{ category: string; amount: number }>()
      .value((d) => d.amount);

    const arc = d3
      .arc<d3.PieArcDatum<{ category: string; amount: number }>>()
      .innerRadius(radius * 0.4)
      .outerRadius(radius * 0.8);

    const arcs = svg
      .selectAll("arc")
      .data(pie(data))
      .enter()
      .append("g")
      .attr("class", "arc");

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (d) => color(d.data.category) as string)
      .attr("stroke", theme === "dark" ? "#333" : "#fff")
      .attr("stroke-width", 2)
      .style("opacity", 0.8)
      .on("click", (event, d) => onCategorySelect(d.data.category))
      .attr(
        "aria-label",
        (d) => `Category ${d.data.category} with amount ${d.data.amount}`
      );

    const legend = svg
      .selectAll(".legend")
      .data(data)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr(
        "transform",
        (d, i) => `translate(-${width / 2},${-height / 2 + i * 20})`
      );

    legend
      .append("rect")
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (d) => color(d.category) as string);

    legend
      .append("text")
      .attr("x", 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .attr("class", "text-sm dark:text-gray-100 text-gray-800")
      .attr(
        "aria-label",
        (d) => `Legend: ${d.category} with amount ${d.amount}`
      )
      .text((d) => `${d.category}: $${d.amount.toFixed(2)}`);
  }, [transactions, onCategorySelect, theme]);

  return <svg ref={chartRef} className="w-full h-full"></svg>;
};

export default TransactionPieChart;
