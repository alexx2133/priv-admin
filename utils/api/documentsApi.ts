import {
  DocumentGroup,
  DocumentGroupsResponse,
  DocumentItem,
  DocumentsResponse,
  SingleDocumentGroupResponse,
} from "@/types/documents";
import { API_BASE_URL } from "../utils";

const getApiUrl = (group: string, id?: number) => {
  let url = `${API_BASE_URL}/documents`;
  if (id) {
    url += `/${id}`;
  }
  url += `?group=${group}`;
  return url;
};

export const getDocumentGroups = async (
  group: string
): Promise<DocumentGroupsResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(getApiUrl(group), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch document groups");
  }

  return await response.json();
};

export const getDocumentGroupById = async (
  group: string,
  id: number
): Promise<SingleDocumentGroupResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(getApiUrl(group, id), {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch document group");
  }

  return await response.json();
};

export const createDocumentGroup = async (
  group: string,
  data: { name: string; sort: number }
): Promise<{ message: string; group: DocumentGroup }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(getApiUrl(group), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create document group");
  }

  return await response.json();
};

export const updateDocumentGroup = async (
  group: string,
  id: number,
  data: { name?: string; sort?: number }
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(getApiUrl(group, id), {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to update document group");
  }

  return await response.json();
};

export const deleteDocumentGroup = async (
  group: string,
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(getApiUrl(group, id), {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to delete document group");
  }

  return await response.json();
};
export const getDocuments = async (
  group: string,
  group_id: number
): Promise<DocumentsResponse> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/documents/${group_id}/documents?group=${group}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch documents");
  }

  return await response.json();
};

export const createDocument = async (
  group: string,
  group_id: number,
  data: {
    name: string;
    company_person: boolean;
    individual_person: boolean;
    physical_person: boolean;
    document: File;
  }
): Promise<{ message: string; document: DocumentItem }> => {
  const token = localStorage.getItem("token");
  const formData = new FormData();
  formData.append("name", data.name);
  formData.append("company_person", data.company_person ? "1" : "0");
  formData.append("individual_person", data.individual_person ? "1" : "0");
  formData.append("physical_person", data.physical_person ? "1" : "0");
  formData.append("document", data.document);

  const response = await fetch(
    `${API_BASE_URL}/documents/${group_id}/documents?group=${group}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error("Failed to create document");
  }

  return await response.json();
};

export const deleteDocument = async (
  group: string,
  id: number
): Promise<{ message: string }> => {
  const token = localStorage.getItem("token");
  const response = await fetch(
    `${API_BASE_URL}/documents/documents/${id}?group=${group}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete document");
  }

  return await response.json();
};
