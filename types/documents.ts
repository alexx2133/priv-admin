export interface DocumentGroup {
  id: number;
  name: string;
  sort: number;
}

export interface DocumentGroupsResponse {
  groups: DocumentGroup[];
  count: number;
}

export interface SingleDocumentGroupResponse {
  group: DocumentGroup;
}
export interface DocumentItem {
  id: number;
  group_id: number;
  name: string;
  company_person: number;
  individual_person: number;
  physical_person: number;
  path: string;
}

export interface DocumentsResponse {
  documents: DocumentItem[];
  count: number;
}

export interface SingleDocumentResponse {
  document: DocumentItem;
}
