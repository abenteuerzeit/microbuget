// src/components/TransactionBarChart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { Transaction } from '@/types/types';

const TransactionBarChart: React.FC<{ 
  transactions: Transaction[],
  onCategorySelect: (category: string) => void 
}> = ({ transactions, onCategorySelect }) => {
  const chartRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!transactions.length || !chartRef.current) return;

    const categoryData = d3.rollup(
      transactions,
      v => d3.sum(v, d => Math.abs(parseFloat(d.amount))),
      d => d.category
    );

    const data = Array.from(categoryData, ([category, amount]) => ({ category, amount }));

    data.sort((a, b) => b.amount - a.amount);

    const margin = { top: 30, right: 30, bottom: 90, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    d3.select(chartRef.current).selectAll("*").remove();

    const svg = d3.select(chartRef.current)
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleBand()
      .range([0, width])
      .padding(0.1);

    const y = d3.scaleLinear()
      .range([height, 0]);

    x.domain(data.map(d => d.category));
    y.domain([0, d3.max(data, d => d.amount) as number]);

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => x(d.category) as number)
      .attr("width", x.bandwidth())
      .attr("y", d => y(d.amount))
      .attr("height", d => height - y(d.amount))
      .attr("fill", "steelblue")
      .on("click", (event, d) => onCategorySelect(d.category));

    svg.append("g")
      .attr("transform", `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em");

    svg.append("g")
      .call(d3.axisLeft(y)
        .ticks(10)
        .tickFormat(d => `$${d3.format(",.0f")(d as number)}`));

    svg.append("text")
      .attr("x", width / 2)
      .attr("y", height + margin.bottom - 10)
      .attr("text-anchor", "middle")
      .text("Category");

    svg.append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left)
      .attr("x", 0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .text("Amount ($)");


    svg.selectAll(".label")
      .data(data)
      .enter().append("text")
      .attr("class", "label")
      .attr("x", d => (x(d.category) as number) + x.bandwidth() / 2)
      .attr("y", d => y(d.amount) - 5)
      .attr("text-anchor", "middle")
      .text(d => `$${d3.format(",.0f")(d.amount)}`);

  }, [transactions, onCategorySelect]);

  return <svg ref={chartRef}></svg>;
};

export default TransactionBarChart;