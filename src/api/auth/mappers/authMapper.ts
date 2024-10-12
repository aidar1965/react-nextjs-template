import { User } from "@/models/User";
import { AdapterUser } from "next-auth/adapters";

export function mapApiUserToAdapterUser(apiUser: User): AdapterUser {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    emailVerified: null, // Установите соответствующее значение, если ваш API предоставляет эту информацию
    // Вы можете добавить дополнительные поля в объект AdapterUser, если это необходимо
  };
}
