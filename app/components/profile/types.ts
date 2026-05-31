export interface ProfileUser {
  email: string;
  firstName?: null | string;
  id: number;
  lastName?: null | string;
}

export interface ProfileUpdatePayload {
  email: string;
  firstName: string;
  lastName: string;
  password?: string;
}

export const getProfileFullName = (user: ProfileUser) => {
  return [user.lastName, user.firstName].filter(Boolean).join(" ").trim();
};

export const getProfileInitials = (user: ProfileUser) => {
  const fullName = getProfileFullName(user);

  if (!fullName) {
    return user.email.slice(0, 2).toUpperCase();
  }

  return fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
};
