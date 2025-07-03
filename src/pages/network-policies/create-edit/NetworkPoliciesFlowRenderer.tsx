import React from 'react'
import ReactFlow, { Background, Controls, Edge, MarkerType, Node, Position } from 'reactflow'
import 'reactflow/dist/style.css'

// ——————————————————————————————————————
// 1) Dummy data keyed by namespace
// ——————————————————————————————————————

const sourcesByNamespace: Record<string, string[]> = {
  blue: [
    'alpha-po-grafana-5f45fd45d6-rpfpx',
    'blue-6f7fd7d95f-6kt5v',
    'db-1-1',
    'hello-world-00002-deployment-6468598845-2xgj6',
    'ksvc-hello-world-00001-deployment-5898f659f9-f5gpv',
  ],
  green: [
    'mq-rabbitmq-cluster-server-0',
    'redis-1-quickstart-redis-master-0',
    'redis-1-quickstart-redis-replicas-0',
    'tekton-dashboard-fb8fd7fb6-4wlzs',
  ],
}

const targetsByNamespace: Record<string, string[]> = {
  purple: ['green-965b984f6-mjpk2', 'tekton-dashboard-76f4f6965d-9qkd8'],
}

// ——————————————————————————————————————
// 2) Layout constants & precomputed offsets
// ——————————————————————————————————————

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
// 3) Group nodes (namespace boxes)
// ——————————————————————————————————————

const groupNodes: Node[] = []
// source groups
Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
  groupNodes.push({
    id: `group-${ns}`,
    type: 'group',
    data: {},
    position: { x: X_SRC - 20, y: yOffsetSrc[ns] - 20 },
    style: {
      width: GROUP_WIDTH,
      height: list.length * ROW_H_SRC + 40,
      background: ns === 'blue' ? 'rgba(59, 78, 84, 0.2)' : 'rgba(144,238,144,0.2)',
      border: `2px solid ${ns === 'blue' ? '#5fa8d3' : '#3cb371'}`,
    },
    extent: 'parent',
  })
})
// target groups
Object.entries(targetsByNamespace).forEach(([ns, list]) => {
  groupNodes.push({
    id: `group-${ns}`,
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
// 4) Namespace labels (inside boxes)
// ——————————————————————————————————————

const labelNodes: Node[] = []
Object.keys(sourcesByNamespace).forEach((ns) => {
  labelNodes.push({
    id: `label-${ns}`,
    data: { label: `Namespace: ${ns}` },
    position: { x: 10, y: yOffsetSrc[ns] - yOffsetSrc[ns] + 10 },
    style: { background: 'transparent', border: 'none', fontWeight: 'bold', color: '#fff' },
    draggable: false,
    connectable: false,
    parentNode: `group-${ns}`,
    extent: 'parent',
  })
})
Object.keys(targetsByNamespace).forEach((ns) => {
  labelNodes.push({
    id: `label-${ns}`,
    data: { label: `Namespace: ${ns}` },
    position: { x: 10, y: yOffsetTgt[ns] - yOffsetTgt[ns] + 10 },
    style: { background: 'transparent', border: 'none', fontWeight: 'bold', color: '#fff' },
    draggable: false,
    connectable: false,
    parentNode: `group-${ns}`,
    extent: 'parent',
  })
})

// ——————————————————————————————————————
// 5) Source & Target nodes
// ——————————————————————————————————————

const sourceNodes: Node[] = []
Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
  list.forEach((label, i) => {
    sourceNodes.push({
      id: label,
      data: { label },
      position: { x: 30, y: 40 + i * ROW_H_SRC },
      style: { width: '150px', height: '80px', textAlign: 'center', alignContent: 'center' },
      parentNode: `group-${ns}`,
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
      id: label,
      data: { label },
      position: { x: 30, y: 40 + i * ROW_H_TGT },
      parentNode: `group-${ns}`,
      extent: 'parent',
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
    })
  })
})

// ——————————————————————————————————————
// 6) Junction nodes
// ——————————————————————————————————————

const sourceJunctions: Node[] = []
Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
  sourceJunctions.push({
    id: `junction-${ns}`,
    type: 'default',
    data: {},
    position: {
      x: X_JUNCTION,
      y: yOffsetSrc[ns] + (list.length * ROW_H_SRC) / 2,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { background: '#fff', border: '2px solid #5fa8d3', width: 16, height: 16, borderRadius: 8 },
  })
})

const targetJunctions: Node[] = []
Object.entries(targetsByNamespace).forEach(([ns, list]) => {
  targetJunctions.push({
    id: `junction-${ns}`,
    type: 'default',
    data: {},
    position: {
      x: X_TGT - 60,
      y: yOffsetTgt[ns] + (list.length * ROW_H_TGT) / 2,
    },
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { background: '#fff', border: '2px solid purple', width: 16, height: 16, borderRadius: 8 },
  })
})

// ——————————————————————————————————————
// 7) Edges
// ——————————————————————————————————————

const edges: Edge[] = []
Object.entries(sourcesByNamespace).forEach(([ns, list]) => {
  list.forEach((label) => {
    edges.push({
      id: `e-src-${ns}-${label}`,
      source: label,
      target: `junction-${ns}`,
      type: 'straight',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    })
  })
  Object.keys(targetsByNamespace).forEach((tNs) => {
    edges.push({
      id: `e-${ns}-to-${tNs}`,
      source: `junction-${ns}`,
      target: `junction-${tNs}`,
      type: 'straight',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    })
  })
})
Object.entries(targetsByNamespace).forEach(([ns, list]) => {
  list.forEach((label) => {
    edges.push({
      id: `e-${ns}-${label}`,
      source: `junction-${ns}`,
      target: label,
      type: 'straight',
      animated: true,
      markerEnd: { type: MarkerType.ArrowClosed },
    })
  })
})

// ——————————————————————————————————————
// 8) Exported component
// ——————————————————————————————————————

export default function NetworkPolicyFlow() {
  return (
    <div style={{ width: '100%', height: '800px' }}>
      <ReactFlow
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
