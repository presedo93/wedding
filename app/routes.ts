import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("auth/:action", "routes/auth.ts"),
  route("profile", "routes/profile/home.tsx", [
    index("routes/profile/guests.tsx"),
    route("new-guest", "routes/profile/new-guest.tsx"),
    route("edit", "routes/profile/edit.tsx"),
    route("delete/:id", "routes/profile/delete.tsx"),
    route("edit-tasks", "routes/profile/edit-tasks.tsx"),
  ]),
] satisfies RouteConfig;
