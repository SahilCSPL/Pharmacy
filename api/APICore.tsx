const PUBLIC_URL = process.env.NEXT_PUBLIC_API_URL;

export async function APICore<T>(
  endpoint: string,
  method: string = "POST",
  requestBody: object = {},
  authToken?: string
): Promise<T> {
    const normalizedMethod = method.toUpperCase();
    const response = await fetch(`${PUBLIC_URL}${endpoint}`, {
      method: normalizedMethod,
      headers: {
        "Content-Type": "application/json",
        ...(authToken ? { "Authorization": `Token ${authToken}` } : {}),
      },
      ...(normalizedMethod !== "GET"
        ? { body: JSON.stringify({ ...requestBody }) }
        : {}),
      next: { revalidate: 0 },
    });

    if (response.status === 204) {
      return {} as T;
    }
    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    const data = JSON.parse(text);
    return data || ({} as T); // Ensure you return the expected array
}
