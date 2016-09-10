import React from "react";
import Radium from "radium";
// import _ from "lodash";
// import Flex from './framework/flex';
import { connect } from "react-redux";
// import { FOO } from "../actions";
// import { visualization } from "../../visualization/visualization";
import d3 from "d3";
import { processNodes, calcLayouts } from "../../util/processNodes";
import * as globals from "../../util/globals";
import Nodes from "./nodes";

const returnStateNeeded = (fullStateTree) => {
  return {
    tree: fullStateTree.tree,
    controls: fullStateTree.controls
  };
};

@connect(returnStateNeeded)
@Radium
class Tree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      okToDraw: false
    };
  }
  static propTypes = {
    /* react */
    // dispatch: React.PropTypes.func,
    params: React.PropTypes.object,
    routes: React.PropTypes.array,
    /* component api */
    style: React.PropTypes.object,
    controls: React.PropTypes.object,
    tree: React.PropTypes.object
  }
  componentDidMount() {
    // is it NEW data? have we drawn this tree yet? setupTree()
    if (this.state.currentDatasetGuid !== this.props.tree.datasetGuid) {
      this.setupTree();
      return;
    }
  }
  componentDidUpdate() {
    // is it NEW data? have we drawn this tree yet? setupTree()
    if (this.state.currentDatasetGuid !== this.props.tree.datasetGuid) {
      this.setupTree();
      return;
    }
  }
  updateScales(nodes, branches) {
    const xValues = nodes.map((d) => {
      return +d.xvalue;
    });

    const yValues = nodes.map((d) => {
      return +d.yvalue;
    });
    const xScale = d3.scale.linear().range([globals.margin, globals.width - globals.margin]);
    const yScale = d3.scale.linear().range([globals.margin, this.treePlotHeight(globals.width) - globals.margin]);
    if (this.props.layout==='radial'){
      xScale.domain([-d3.max(xValues), d3.max(xValues)]);
      yScale.domain([-d3.max(xValues), d3.max(xValues)]);
    } else {
      xScale.domain([0, d3.max(xValues)]);
      yScale.domain([0, d3.max(yValues)]);
    }

    this.setState({
      okToDraw: true,
      currentDatasetGuid: this.props.tree.datasetGuid,
      nodes: nodes,
      branches: branches,
      width: globals.width,
      xScale: xScale,
      yScale: yScale
    });
  }
  setupTree() {
    const tree = d3.layout.tree()
      .size([this.treePlotHeight(globals.width), globals.width]);
    const nodes = processNodes(tree.nodes(this.props.tree.tree));
    nodes[0].parent = nodes[0];
    calcLayouts(nodes, ["div", "num_date"]);
    const branches = tree.links(nodes);
    this.updateScales(nodes, branches);
  }
  treePlotHeight(width) {
    return 400 + 0.30 * width;
  }
  createSvgAndNodes() {
    return (
      <svg
        width={this.state.width}
        height={this.treePlotHeight(this.state.width)}
        id="treeplot"
      >
        <Nodes
          query={this.props.query}
          nodes={this.state.nodes}
          xScale={this.state.xScale}
          yScale={this.state.yScale}
          layout={this.props.layout}
          distanceMeasure="div"
        />
      </svg>
    );
  }
  render() {
    /*
      1. if we just loaded a new dataset, run setup tree,
      2. otherwise if we just rescaled, run updatescales,
      3. otherwise just have components rerender because for instance colorby changed
    */
    return (
      <div>
        {this.state.okToDraw ? this.createSvgAndNodes() : "We don't have tree data yet [spinner]"}
      </div>
    );
  }
}


export default Tree;
