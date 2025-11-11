export interface TemplateData {
  tempName: string;
  emailSubject: string;
  type: string;
  messageBody: string;
}

export interface TemplateUpdateData {
  tempName: string;
  emailSubject: string;
  type: "courses" | "product" | "trips";
  status: string;
  messageBody: string;
}

export interface TemplateResponse {
  _id: string;
  tempName: string;
  emailSubject: string;
  type: string;
  status: string;
  messageBody: string;
  createdAt: string;
  updatedAt: string;
  data: TemplateData;
}

export interface TemplateApiResponse {
  success: boolean;
  message: string;
  statusCode: number;
  data: TemplateResponse;
}
