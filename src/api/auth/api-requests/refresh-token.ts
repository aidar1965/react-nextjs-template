import RefreshTokenResponse from "@/api/interfaces/responses/RefreshTokenResponse";
import axios from "axios";

export async function refreshToken(
  refreshToken: string
): Promise<RefreshTokenResponse> {
  try {
    const response = await axios.post<RefreshTokenResponse>(
      `${process.env.API_BASE_URL}/auth/refresh`,
      {
        refreshToken,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Refresh token error:", error);
    throw new Error("Failed to refresh token");
  }
}
