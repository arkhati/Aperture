"use client";

import dynamic from 'next/dynamic';
import { useMemo } from 'react';

// Dynamically import ForceGraph2D with no SSR to avoid window errors
const ForceGraph2D = dynamic(() => import('react-force-graph-2d'), { ssr: false });

interface Node {
    id: string;
    group: number;
    description?: string;
}

interface Link {
    source: string;
    target: string;
    value: number;
    description?: string;
}

interface GraphData {
    nodes: Node[];
    links: Link[];
}

interface WordWebGraphProps {
    data: GraphData;
}

const WordWebGraph = ({ data }: WordWebGraphProps) => {
    // Memoize data to prevent re-renders on parent state changes
    const graphData = useMemo(() => {
        // Clone to avoid mutation errors from the library
        return {
            nodes: data.nodes.map(n => ({ ...n })),
            links: data.links.map(l => ({ ...l }))
        };
    }, [data]);

    return (
        <div className="bg-slate-950 border border-white/10 rounded-2xl overflow-hidden h-[600px] w-full relative">
            <div className="absolute top-4 left-4 z-10 bg-slate-900/80 p-2 rounded-lg text-xs text-slate-400 border border-white/10">
                Scroll to Zoom • Drag to Pan • Hover for Info
            </div>

            <ForceGraph2D
                graphData={graphData}
                nodeLabel="description"
                nodeColor={node => {
                    const n = node as Node;
                    return n.group === 1 ? "#a855f7" : "#6366f1"; // Purple for core, Indigo for secondary
                }}
                nodeRelSize={6}
                linkColor={() => "#ffffff20"}
                linkWidth={link => (link as Link).value || 1}
                backgroundColor="#020617" // slate-950
                d3VelocityDecay={0.1}
                cooldownTicks={100}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
            />
        </div>
    );
};

export default WordWebGraph;
