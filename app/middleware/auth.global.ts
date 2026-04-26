import { APP_HOME_PATH, resolveAppRedirect } from "~/utils/auth-redirect";
import { useAuthStore } from "~/stores/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = useAuthStore();

  await auth.initialize();

  if (to.path.startsWith("/app")) {
    if (!auth.isAuthenticated) {
      return navigateTo({
        path: "/",
        query: { redirect: to.fullPath },
      });
    }

    if (to.path === "/app") {
      return navigateTo(APP_HOME_PATH);
    }

    return;
  }

  if ((to.path === "/" || to.path === "/register") && auth.isAuthenticated) {
    return navigateTo(resolveAppRedirect(to.query.redirect) ?? APP_HOME_PATH);
  }
});
