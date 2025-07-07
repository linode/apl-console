import React, { useMemo } from 'react'
import ReactFlow, { Background, Controls, Edge, MarkerType, Node, Position } from 'reactflow'
import 'reactflow/dist/style.css'

interface FlowProps {
  sourcesByNamespace: Record<string, string[]>
  targetsByNamespace: Record<string, string[]>
}

export default function NetworkPolicyFlow({ sourcesByNamespace, targetsByNamespace }: FlowProps) {
  // ——————————————————————————————————————
  // 1) Layout constants & precomputed offsets
  // ——————————————————————————————————————

  const flowKey = useMemo(() => {
    // serialize sources
    const srcEntries = Object.entries(sourcesByNamespace).sort(([a], [b]) => a.localeCompare(b))
    const srcPart = srcEntries.length
      ? srcEntries.map(([ns, pods]) => `${ns}:${pods.slice().sort().join(',')}`).join('|')
      : '__no-src__'

    // serialize targets
    const tgtEntries = Object.entries(targetsByNamespace).sort(([a], [b]) => a.localeCompare(b))
    const tgtPart = tgtEntries.length
      ? tgtEntries.map(([ns, pods]) => `${ns}:${pods.slice().sort().join(',')}`).join('|')
      : '__no-tgt__'

    return `src[${srcPart}]|tgt[${tgtPart}]`
  }, [sourcesByNamespace, targetsByNamespace])

  const ROW_H_SRC = 120
  const ROW_H_TGT = 80
  const SECTION_SPACING = 40

  // X positions for columns
  const X_SRC = 0
  const X_JUNCTION = 217.5
  const X_TGT = 600
  const GROUP_WIDTH = 250

  // compute vertical offsets for each source-ns
  const yOffsetSrc: Record<string, number> = {}
  let accSrc = 0
  Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
    yOffsetSrc[ns] = accSrc
    accSrc += list.length * ROW_H_SRC + SECTION_SPACING
  })

  // compute vertical offsets for each target-ns
  type TargetOffsets = Record<string, number>
  const yOffsetTgt: TargetOffsets = {}
  let accTgt = 0
  Object.entries(targetsByNamespace).forEach(([ns, list]) => {
    yOffsetTgt[ns] = accTgt
    accTgt += list.length * ROW_H_TGT + SECTION_SPACING
  })

  // ——————————————————————————————————————
  // 2) Group nodes (namespace boxes)
  // ——————————————————————————————————————

  const groupNodes: Node[] = []
  // source groups
  Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
    groupNodes.push({
      id: `group-src-${ns}`,
      type: 'group',
      data: {},
      position: { x: X_SRC - 20, y: yOffsetSrc[ns] - 20 },
      style: {
        width: GROUP_WIDTH,
        height: list.length * ROW_H_SRC + 40,
        background: ns === 'team-alpha' ? 'rgba(59, 78, 84, 0.2)' : 'rgba(144,238,144,0.2)',
        border: `2px solid ${ns === 'team-alpha' ? '#5fa8d3' : '#3cb371'}`,
      },
      extent: 'parent',
    })
  })
  // target groups
  Object.entries(targetsByNamespace).forEach(([ns, list]) => {
    groupNodes.push({
      id: `group-tgt-${ns}`,
      type: 'group',
      data: {},
      position: { x: X_TGT - 20, y: yOffsetTgt[ns] - 20 },
      style: {
        width: GROUP_WIDTH,
        height: list.length * ROW_H_TGT + 40,
        background: 'rgba(128,0,128,0.1)',
        border: '2px solid purple',
      },
      extent: 'parent',
    })
  })

  // ——————————————————————————————————————
  // 3) Namespace labels (inside boxes)
  // ——————————————————————————————————————

  const labelNodes: Node[] = []
  // source labels
  Object.keys(sourcesByNamespace).forEach((ns) => {
    labelNodes.push({
      id: `label-src-${ns}`,
      data: { label: `Namespace: ${ns}` },
      position: { x: 0, y: yOffsetSrc[ns] - yOffsetSrc[ns] },
      style: { background: 'transparent', border: 'none', fontWeight: 'bold', color: '#fff', width: '200px' },
      draggable: false,
      connectable: false,
      parentNode: `group-src-${ns}`,
      extent: 'parent',
    })
  })
  // target labels
  Object.keys(targetsByNamespace).forEach((ns) => {
    labelNodes.push({
      id: `label-tgt-${ns}`,
      data: { label: `Namespace: ${ns}` },
      position: { x: 0, y: yOffsetTgt[ns] - yOffsetTgt[ns] },
      style: { background: 'transparent', border: 'none', fontWeight: 'bold', color: '#fff', width: '200px' },
      draggable: false,
      connectable: false,
      parentNode: `group-tgt-${ns}`,
      extent: 'parent',
    })
  })

  // ——————————————————————————————————————
  // 4) Source & Target nodes
  // ——————————————————————————————————————

  const sourceNodes: Node[] = []
  Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
    list.forEach((label, i) => {
      sourceNodes.push({
        id: `src-${ns}-${label}`,
        data: { label },
        position: { x: 30, y: 40 + i * ROW_H_SRC },
        style: { width: '150px', height: '80px', textAlign: 'center', alignContent: 'center' },
        parentNode: `group-src-${ns}`,
        extent: 'parent',
        sourcePosition: Position.Right,
        targetPosition: Position.Left,
      })
    })
  })

  const targetNodes: Node[] = []
  Object.entries(targetsByNamespace).forEach(([ns, list]) => {
    list.forEach((label, i) => {
      targetNodes.push({
        id: `tgt-${ns}-${label}`,
        data: { label },
        position: { x: 30, y: 40 + i * ROW_H_TGT },
        parentNode: `group-tgt-${ns}`,
        extent: 'parent',
        targetPosition: Position.Left,
        sourcePosition: Position.Right,
      })
    })
  })

  // ——————————————————————————————————————
  // 5) Junction nodes
  // ——————————————————————————————————————

  const sourceJunctions: Node[] = []
  Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
    sourceJunctions.push({
      id: `junction-src-${ns}`,
      type: 'default',
      data: {},
      position: {
        x: X_JUNCTION,
        y: yOffsetSrc[ns] + (list.length * ROW_H_SRC) / 2 - 10,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: { background: '#fff', border: '2px solid #5fa8d3', width: 16, height: 16, borderRadius: 8 },
    })
  })

  const targetJunctions: Node[] = []
  Object.entries(targetsByNamespace).forEach(([ns, list]) => {
    targetJunctions.push({
      id: `junction-tgt-${ns}`,
      type: 'default',
      data: {},
      position: {
        x: X_TGT - 30,
        y: yOffsetTgt[ns] + (list.length * ROW_H_TGT) / 2 - 10,
      },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      style: { background: '#fff', border: '2px solid purple', width: 16, height: 16, borderRadius: 8 },
    })
  })

  // ——————————————————————————————————————
  // 6) Edges
  // ——————————————————————————————————————

  const edges: Edge[] = []
  // sources to source junction
  Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
    list.forEach((label) => {
      edges.push({
        id: `e-src-${ns}-${label}`,
        source: `src-${ns}-${label}`,
        target: `junction-src-${ns}`,
        type: 'straight',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      })
    })
    // source junction to target junction
    Object.keys(targetsByNamespace).forEach((tNs) => {
      edges.push({
        id: `e-${ns}-to-${tNs}`,
        source: `junction-src-${ns}`,
        target: `junction-tgt-${tNs}`,
        type: 'straight',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      })
    })
  })
  // target junction to targets
  Object.entries(targetsByNamespace).forEach(([ns, list]) => {
    list.forEach((label) => {
      edges.push({
        id: `e-${ns}-${label}`,
        source: `junction-tgt-${ns}`,
        target: `tgt-${ns}-${label}`,
        type: 'straight',
        animated: true,
        markerEnd: { type: MarkerType.ArrowClosed },
      })
    })
  })

  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ReactFlow
        key={flowKey}
        nodes={[...groupNodes, ...labelNodes, ...sourceNodes, ...sourceJunctions, ...targetJunctions, ...targetNodes]}
        edges={edges}
        nodesDraggable={false}
        nodesConnectable={false}
        zoomOnScroll={false}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}
