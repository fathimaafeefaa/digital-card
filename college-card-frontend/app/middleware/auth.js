export default defineNuxtRouteMiddleware((to) => {
  const auth = useAuthStore();
  auth.loadFromStorage();

  if (!auth.token) {
    return navigateTo("/");
  }
});
