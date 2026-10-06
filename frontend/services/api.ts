const API_URL = "http://127.0.0.1:8000";

export async function getHostedZones() {
  const response = await fetch(`${API_URL}/hosted-zones`);

  if (!response.ok) {
    throw new Error("Failed to fetch hosted zones");
  }

  return response.json();
}

export async function createHostedZone(data: {
  name: string;
  type: string;
  description?: string;
}) {
  const response = await fetch(`${API_URL}/hosted-zones`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to create hosted zone");
  }

  return response.json();
}

export async function updateHostedZone(
  id: number,
  data: {
    name: string;
    type: string;
    description?: string;
  }
) {
  const response = await fetch(
    `${API_URL}/hosted-zones/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update hosted zone");
  }

  return response.json();
}

export async function deleteHostedZone(id: number) {
  const response = await fetch(
    `${API_URL}/hosted-zones/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to delete hosted zone");
  }

  return response.json();
}