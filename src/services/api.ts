export async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Request failed");
  return res.json();
}
