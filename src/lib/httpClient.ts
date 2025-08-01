export class HttpClient {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: Omit<RequestInit, "body"> & { body?: unknown } = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const body = options.body ? JSON.stringify(options.body) : undefined;
    const response = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
      body,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    return response.json();
  }

  async get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: "POST", body });
  }

  async delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: "DELETE" });
  }

  async put<T>(endpoint: string, body: unknown) {
    return this.request<T>(endpoint, { method: "PUT", body });
  }
}
