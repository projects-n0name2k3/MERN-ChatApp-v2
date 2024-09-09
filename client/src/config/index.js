export const registerFormControls = [
  {
    name: "username",
    label: "Username",
    placeholder: "Enter your username",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "password-signup",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "password-signin",
    type: "password",
  },
];

export const changePasswordFormControls = [
  {
    name: "oldPassword",
    label: "Current Password",
    placeholder: "Enter your current password",
    componentType: "password-signup",
    type: "password",
  },
  {
    name: "newPassword",
    label: "New Password",
    placeholder: "Enter your new password",
    componentType: "password-signup",
    type: "password",
  },
];
