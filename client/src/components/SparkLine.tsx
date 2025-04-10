import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface SparkLineProps {
  data: number[];
}

const SparkLine = ({ data }: SparkLineProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [pathData, setPathData] = useState<string>('');
  const [lineColor, setLineColor] = useState<string>('#2196F3');

  useEffect(() => {
    if (!data || data.length === 0 || !svgRef.current) return;

    // Determine line color based on first and last values
    if (data.length > 1) {
      const firstValue = data[0];
      const lastValue = data[data.length - 1];
      setLineColor(lastValue >= firstValue ? '#4CAF50' : '#F44336');
    }

    // Get SVG dimensions
    const width = svgRef.current.clientWidth;
    const height = svgRef.current.clientHeight;
    const padding = { top: 10, right: 10, bottom: 10, left: 10 };
    
    // Set up scales with padding
    const xScale = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([padding.left, width - padding.right]);
    
    const yScale = d3.scaleLinear()
      .domain([d3.min(data) || 0, d3.max(data) || 0])
      .range([height - padding.bottom, padding.top]);
    
    // Create line generator
    const line = d3.line<number>()
      .x((_: number, i: number) => xScale(i))
      .y((d: number) => yScale(d));
    
    // Generate the path data string
    const pathString = line(data) || '';
    setPathData(pathString);

  }, [data]);

  return (
    <svg 
      ref={svgRef}
      width="100%" 
      height="100%" 
      style={{ minHeight: '47px' }}
    >
      {pathData && (
        <path
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          d={pathData}
        />
      )}
    </svg>
  );
};

export default SparkLine;
