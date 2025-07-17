import Data from "../data";

export const users = new Data<{
  [key: string]: { username: string; password: string };
}>("sentryx/users.json", { admin: { username: "admin", password: "admin" } });

export const sessions = new Data<{ [key: string]: string }>(
  "sentryx/sessions.json",
  {}
);

export default function validate(sessionId: string | null) {
  return sessionId && sessions.data[sessionId] != undefined;
}
