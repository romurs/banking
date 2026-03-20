export default defineEventHandler((event) => {
  return {
    message: "Привет из backend на Nuxt 4! 🚀",
    time: new Date().toISOString(),
    status: "OK"
  };
});