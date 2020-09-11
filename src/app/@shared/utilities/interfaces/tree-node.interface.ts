export interface ITreeNode {
	aChildren: ITreeNode[];
	iLevel: number;
	key: any;
	oParent: ITreeNode;
	sName: string;
}
