export interface ProteinData {
  _id: { $oid: string };
  hgene_name: string;
  tgene_name: string;
  seq_desc: string;
  hgene_seq: string;
  tgene_seq: string;
  isOutOfFrame: boolean;
  isAnalyzed: boolean;
}