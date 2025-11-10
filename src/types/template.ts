export interface TemplateData {
  tempName: string;
  emailSubject: string;
  type: string;
  status: string;
  messageBody: string;
}

export interface TemplateResponse {

  _id: string;
  id: string;
  tempName: string;
  emailSubject: string;
  type: string;
  status: string;
  messageBody: string;
  createdAt: string;
  updatedAt: string;
}



// Template data type
export interface TemplateData {
  tempName: string;
  emailSubject: string;
  type: string;
  status: string;
  messageBody: string;
}

// Optional: API response type
export interface TemplateResponse {
  id: string;
  tempName: string;
  emailSubject: string;
  type: string;
  status: string;
  messageBody: string;
  createdAt: string;
  updatedAt: string;
}
