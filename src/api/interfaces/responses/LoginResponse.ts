export default class LoginResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };

  constructor(id: string, name: string, email: string) {
    this.user = {
      id,
      name,
      email,
    };
  }
}
