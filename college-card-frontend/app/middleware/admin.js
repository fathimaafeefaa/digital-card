export default defineNuxtRouteMiddleware(() => {
  const auth = useAuthStore();
  auth.loadFromStorage();

  if (!auth.token) {
    return navigateTo("/");
  }

  if (auth.user?.role !== "admin") {
    return navigateTo("/");
  }
});
