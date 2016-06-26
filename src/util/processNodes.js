import * as treeHelpers from "./treeHelpers";
import * as globals from "./globals";

export const processNodes = (nodes) => {
  const rootNode = nodes[0];
  treeHelpers.calcFullTipCounts(rootNode);
  treeHelpers.calcBranchLength(rootNode);
  treeHelpers.calcTipCounts(rootNode);

  // treeHelpers.calcNodeAges(globals.time_window);
  // colorByTrait();
  treeHelpers.adjust_freq_by_date(nodes, rootNode);

  return nodes;

};
