import { ITreeNode } from '@app/@shared/utilities/interfaces/tree-node.interface';

export class TreeNode implements ITreeNode {
  aChildren: TreeNode[];
  iLevel: number;
  key: any;
  oParent: TreeNode;
  sName: string;

  constructor(oParam: ITreeNode) {
    this.aChildren = oParam.aChildren;
    this.iLevel = oParam.iLevel;
    this.key = oParam.key;
    this.oParent = oParam.oParent;
    this.sName = oParam.sName;
  }
}
