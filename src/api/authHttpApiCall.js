import { getTokens, saveTokens } from "../helpers/tokenManager";

const API_BASE_URL = "http://192.168.1.122:8000";

// Función genérica para realizar solicitudes a la API
export async function apiRequest(endpoint, options = {}) {
  try {
    // Realiza la solicitud con el token actual
    return await makeRequestWithToken(endpoint, options);
  } catch (error) {
    if (error.status === 401) {
      // Si el token ha expirado, intenta renovarlo
      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        // Reintenta la solicitud original con el nuevo token
        return await makeRequestWithToken(endpoint, options, newAccessToken);
      } else {
        throw new Error("Session expired. Please log in again.");
      }
    }

    throw error; // Propaga otros errores
  }
}

// Función auxiliar para realizar solicitudes con un token
async function makeRequestWithToken(endpoint, options, token = null) {
  const { accessToken } = await getTokens();
  const accessTokenToUse = token || accessToken;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessTokenToUse}`,
      "Content-Type": options.body ? "application/json" : undefined, // Asegura el Content-Type si hay body
    },
    body: options.body ? JSON.stringify(options.body) : undefined, // Serializa el body si existe
  });

  if (!response.ok) {
    const error = new Error("Request failed");
    error.status = response.status;
    throw error;
  }

  return response;
}

// Función para renovar el access token usando el refresh token
async function refreshAccessToken() {
  try {
    const { refreshToken } = await getTokens();

    const response = await fetch(`${API_BASE_URL}/auth/jwt/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (response.ok) {
      const { access_token } = await response.json();
      await saveTokens(access_token, refreshToken); // Actualiza ambos tokens
      return access_token;
    } else {
      console.error("Failed to refresh access token.");
      return null;
    }
  } catch (error) {
    console.error("Error refreshing access token:", error);
    return null;
  }
}