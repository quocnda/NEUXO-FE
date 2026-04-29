export interface ILoginParams {
  username: string;
  password: string;
}
export interface ILoginResponse {
  access_token: string;
  refresh_token?: string;
}
export interface IRegisterResponse extends ILoginResponse {}
export interface IUser {
  id: number;
  user_name: string;
  email: string;
  first_name: string;
  role: string;
  phone_number: string;
  location: string;
  last_name: string;
  has_password: boolean;
  has_mail_app_pass: boolean;
  avatar: {
    file_name: string;
    file_path: string;
  };
  permissions: string;
  email_tracker: {
    email: string;
    password: string;
  };
}
export interface ISignupParams {
  first_name: string;
  last_name: string;
  phone_number?: string;
  email: string;
  password: string;
  role: string;
}
export interface ISignupResponse {
  id: string;
  user_name: string;
  email: string;
  created_at: string;
  role: string;
}
export interface IChangePasswordParams {
  oldPassword: string;
  newPassword: string;
}

export interface IChangeRole {
  id: string;
  role: string;
  username?: string;
  password?: string;
  email?: string;
}

export interface IBodyUpdateProfileUser {
  first_name: string;
  last_name: string;
  phone_number?: string;
  location?: string;
  avatar?: {
    file_name: string;
    file_path: string;
  };
}

export interface ISetPasswordParams {
  new_password: string;
}
