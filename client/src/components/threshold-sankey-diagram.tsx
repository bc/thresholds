import { useEffect, useRef, useState } from "react";
import { CSVRow } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPercentage } from "@/lib/utils";
import * as d3 from "d3";
import { sankey, sankeyLinkHorizontal } from "d3-sankey";

interface ThresholdSankeyDiagramProps {
  data: CSVRow[];
  threshold: number;
}

interface SankeyNode {
  name: string;
  category: string;
  value: number;
  x0?: number;
  y0?: number;
  x1?: number;
  y1?: number;
  index?: number;
  depth?: number;
  height?: number;
}

interface SankeyLink {
  source: number | SankeyNode;
  target: number | SankeyNode;
  value: number;
  width?: number;
  path?: string; 
  color?: string;
}

export function ThresholdSankeyDiagram({
  data,
  threshold
}: ThresholdSankeyDiagramProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Calculate dimensions when component mounts or window resizes
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: 300 // Fixed height
        });
      }
    };

    window.addEventListener("resize", updateDimensions);
    updateDimensions();

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Render Sankey diagram when data or dimensions change
  useEffect(() => {
    if (!data.length || !dimensions.width || !svgRef.current) return;

    // Prepare data for Sankey diagram
    const correctAboveThreshold = data.filter(row => row.confidence >= threshold && row.was_correct).length;
    const correctBelowThreshold = data.filter(row => row.confidence < threshold && row.was_correct).length;
    const incorrectAboveThreshold = data.filter(row => row.confidence >= threshold && !row.was_correct).length;
    const incorrectBelowThreshold = data.filter(row => row.confidence < threshold && !row.was_correct).length;

    // Define nodes
    const nodes: SankeyNode[] = [
      { name: "All Samples", category: "source", value: data.length },
      { name: "Correct", category: "correctness", value: correctAboveThreshold + correctBelowThreshold },
      { name: "Incorrect", category: "correctness", value: incorrectAboveThreshold + incorrectBelowThreshold },
      { name: "Above Threshold (Correct)", category: "threshold", value: correctAboveThreshold },
      { name: "Below Threshold (Correct)", category: "threshold", value: correctBelowThreshold },
      { name: "Above Threshold (Incorrect)", category: "threshold", value: incorrectAboveThreshold },
      { name: "Below Threshold (Incorrect)", category: "threshold", value: incorrectBelowThreshold }
    ];

    // Define links
    const links: SankeyLink[] = [
      { source: 0, target: 1, value: correctAboveThreshold + correctBelowThreshold },
      { source: 0, target: 2, value: incorrectAboveThreshold + incorrectBelowThreshold },
      { source: 1, target: 3, value: correctAboveThreshold },
      { source: 1, target: 4, value: correctBelowThreshold },
      { source: 2, target: 5, value: incorrectAboveThreshold },
      { source: 2, target: 6, value: incorrectBelowThreshold }
    ];

    // Clear previous diagram
    d3.select(svgRef.current).selectAll("*").remove();

    // Create Sankey generator
    const sankeyGenerator = sankey<SankeyNode, SankeyLink>()
      .nodeId((d: SankeyNode) => d.index as number)
      .nodeWidth(20)
      .nodePadding(10)
      .extent([[1, 5], [dimensions.width - 1, dimensions.height - 5]]);

    // Generate Sankey data
    const sankeyData = sankeyGenerator({
      nodes: nodes.map((node, i) => ({ ...node, index: i })),
      links: links.map(link => ({
        ...link,
        source: typeof link.source === 'number' ? link.source : link.source.index as number,
        target: typeof link.target === 'number' ? link.target : link.target.index as number
      }))
    });

    // Create SVG element
    const svg = d3.select(svgRef.current)
      .attr("width", dimensions.width)
      .attr("height", dimensions.height)
      .attr("viewBox", [0, 0, dimensions.width, dimensions.height])
      .attr("style", "max-width: 100%; height: auto;");
      
    // Define color scales
    const colorScale = d3.scaleOrdinal<string>()
      .domain(["source", "correctness", "threshold"])
      .range(["#64748b", "#64748b", "#64748b"]);

    const linkColorScale = d3.scaleOrdinal<string>()
      .domain(["correct-above", "correct-below", "incorrect-above", "incorrect-below"])
      .range(["#10b981", "#86efac", "#ef4444", "#fca5a5"]);

    // Add links
    svg.append("g")
      .attr("fill", "none")
      .selectAll("path")
      .data(sankeyData.links)
      .join("path")
      .attr("d", sankeyLinkHorizontal())
      .attr("stroke", (d) => {
        try {
          // Get source and target
          const source = sankeyData.nodes[d.source as number];
          const target = sankeyData.nodes[d.target as number];
          
          if (!source || !target) return "#94a3b8"; // safeguard
          
          // Assign colors based on the flow
          if (target.name.includes("Above") && target.name.includes("Correct")) {
            return "#10b981"; // darker green
          } else if (target.name.includes("Below") && target.name.includes("Correct")) {
            return "#86efac"; // lighter green
          } else if (target.name.includes("Above") && target.name.includes("Incorrect")) {
            return "#ef4444"; // darker red
          } else if (target.name.includes("Below") && target.name.includes("Incorrect")) {
            return "#fca5a5"; // lighter red
          } else if (source.name === "All Samples" && target.name === "Correct") {
            return "#10b981"; // green for correct
          } else if (source.name === "All Samples" && target.name === "Incorrect") {
            return "#ef4444"; // red for incorrect
          }
          return "#94a3b8"; // default gray
        } catch (error) {
          console.error("Error setting stroke color:", error);
          return "#94a3b8"; // default gray on error
        }
      })
      .attr("stroke-width", d => Math.max(1, (d.width as number)))
      .attr("stroke-opacity", 0.5)
      .attr("stroke-linecap", "round");

    // Add nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(sankeyData.nodes)
      .join("g");

    // Add node rectangles
    node.append("rect")
      .attr("x", d => d.x0 as number)
      .attr("y", d => d.y0 as number)
      .attr("height", d => Math.max(1, (d.y1 as number) - (d.y0 as number)))
      .attr("width", d => Math.max(1, (d.x1 as number) - (d.x0 as number)))
      .attr("fill", d => {
        try {
          if (!d || !d.name) return "#64748b"; // safeguard
          
          if (d.name === "Correct") return "#10b981";
          if (d.name === "Incorrect") return "#ef4444";
          if (d.name.includes("Above") && d.name.includes("Correct")) return "#10b981";
          if (d.name.includes("Below") && d.name.includes("Correct")) return "#86efac";
          if (d.name.includes("Above") && d.name.includes("Incorrect")) return "#ef4444";
          if (d.name.includes("Below") && d.name.includes("Incorrect")) return "#fca5a5";
          return "#64748b"; // default gray
        } catch (error) {
          console.error("Error setting fill color:", error);
          return "#64748b"; // default gray on error
        }
      })
      .attr("rx", 3) // Rounded corners
      .attr("ry", 3);

    // Add node labels
    node.append("text")
      .attr("x", d => {
        if (d.depth === 0) return (d.x1 as number) + 6;
        if (d.depth === 2) return (d.x0 as number) - 6;
        return (d.x0 as number) + ((d.x1 as number) - (d.x0 as number)) / 2;
      })
      .attr("y", d => (d.y0 as number) + ((d.y1 as number) - (d.y0 as number)) / 2)
      .attr("dy", "0.35em")
      .attr("text-anchor", d => {
        if (d.depth === 0) return "start";
        if (d.depth === 2) return "end";
        return "middle";
      })
      .text(d => {
        try {
          if (!d || !d.name) return ""; // safeguard
          
          // Simplify node names
          if (d.name === "All Samples") return "All Samples";
          if (d.name === "Correct") return "Correct";
          if (d.name === "Incorrect") return "Incorrect";
          if (d.name.includes("Above Threshold (Correct)")) return "Above Threshold";
          if (d.name.includes("Below Threshold (Correct)")) return "Below Threshold";
          if (d.name.includes("Above Threshold (Incorrect)")) return "Above Threshold";
          if (d.name.includes("Below Threshold (Incorrect)")) return "Below Threshold";
          return d.name;
        } catch (error) {
          console.error("Error setting node label:", error);
          return ""; // empty string on error
        }
      })
      .attr("fill", "currentColor")
      .attr("font-size", "10px")
      .filter(d => (d.y1 as number) - (d.y0 as number) < 20) // For small nodes
      .attr("opacity", 0); // Hide if too small

    // Add value labels
    node.append("text")
      .attr("x", d => {
        if (d.depth === 0) return (d.x1 as number) + 6;
        if (d.depth === 2) return (d.x0 as number) - 6;
        return (d.x0 as number) + ((d.x1 as number) - (d.x0 as number)) / 2;
      })
      .attr("y", d => {
        const height = (d.y1 as number) - (d.y0 as number);
        return (d.y0 as number) + height / 2 + 12;
      })
      .attr("dy", "0.35em")
      .attr("text-anchor", d => {
        if (d.depth === 0) return "start";
        if (d.depth === 2) return "end";
        return "middle";
      })
      .text(d => {
        try {
          if (!d || d.value === undefined || d.value === 0) return ""; // Don't show 0 or undefined values
          const percentage = formatPercentage(d.value / Math.max(1, data.length) * 100, 1);
          return `${d.value} (${percentage})`;
        } catch (error) {
          console.error("Error setting value label:", error);
          return ""; // empty string on error
        }
      })
      .attr("fill", "currentColor")
      .attr("font-size", "9px")
      .filter(d => (d.y1 as number) - (d.y0 as number) < 30) // For small nodes
      .attr("opacity", 0); // Hide if too small

  }, [data, dimensions, threshold]);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm sm:text-base font-semibold">Threshold Sankey Diagram</CardTitle>
      </CardHeader>
      <CardContent className="p-0" ref={containerRef}>
        <svg ref={svgRef} className="w-full" style={{ minHeight: 300 }}></svg>
      </CardContent>
    </Card>
  );
}