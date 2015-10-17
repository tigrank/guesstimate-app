import {expect} from 'chai';

import BasicGraph from './basic-graph.js'

describe('Graph', () => {
  let inputs = {
    nodeIds: [1,2,3,4,5],
    nodeEdges: [
      {input: 1, output: 2},
      {input: 2, output: 3},
      {input: 1, output: 3},
      {input: 3, output: 4}
    ]
  }

  let graph = new BasicGraph(inputs.nodeIds, inputs.nodeEdges)

  describe('#constructor', () => {
    it('contains nodes', () => {
      expect(graph.nodes.length).to.equal(5)
      expect(graph.nodes[0].graph).to.deep.equal(graph)
      expect(graph.nodes[0].id).to.deep.equal(1)
    })
  })

  describe('#children', () => {
    describe('oneLevel=true', () => {
      it('with children', () => {
        expect(graph.childrenIds(1)).to.deep.equal([2,3])
      })

      it('with no children', () => {
        expect(graph.children(1).map(c => c.id)).to.deep.equal([2, 3])
        expect(graph.children(2).map(c => c.id)).to.deep.equal([3])
      })
    })

    describe('oneLevel=false', () => {
      it('with children', () => {
        expect(graph.childrenIds(1, false)).to.deep.equal([2,3,4])
      })

      it('with no children', () => {
        expect(graph.children(4, false)).to.deep.equal([])
      })
    })
  })
})

describe('BasicNode', () => {
  let inputs = {
    nodeIds: [1,2,3,4,5],
    nodeEdges: [
      {input: 1, output: 2},
      {input: 2, output: 3},
      {input: 1, output: 3},
      {input: 3, output: 4}
    ]
  }

  let graph = new BasicGraph(inputs.nodeIds, inputs.nodeEdges)

  describe('#maxDistanceFromRoot', () => {
      it('works', () => {
        const allDistances = graph.nodes.map(n => n.maxDistanceFromRoot)
        expect(allDistances).to.deep.equal([0, 1, 2, 3, 0])
      })
  })
})
