import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const useUsersStore = defineStore("users", () => {
  const users = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const selectedUser = ref(null);
  const viewedUsers = ref(new Set());

  const loadViewedUsers = () => {
    const stored = localStorage.getItem("viewedUsers");
    if (stored) {
      viewedUsers.value = new Set(JSON.parse(stored));
    }
  };

  const saveViewedUsers = () => {
    localStorage.setItem("viewedUsers", JSON.stringify([...viewedUsers.value]));
  };

  const getUserById = computed(() => (id) => {
    return users.value.find((user) => user.id === id);
  });

  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      if (!response.ok) throw new Error("Failed to fetch users");
      users.value = await response.json();
      loadViewedUsers();
    } catch (err) {
      error.value = "Сервис временно недоступен. Пожалуйста, попробуйте позже.";
      console.error("Error fetching users:", err);
    } finally {
      loading.value = false;
    }
  };

  const selectUser = (user) => {
    selectedUser.value = user;
    if (user) {
      viewedUsers.value.add(user.id);
      saveViewedUsers();
    }
  };

  const isUserViewed = (userId) => {
    return viewedUsers.value.has(userId);
  };

  return {
    users,
    loading,
    error,
    selectedUser,
    viewedUsers,
    getUserById,
    fetchUsers,
    selectUser,
    isUserViewed,
  };
});
