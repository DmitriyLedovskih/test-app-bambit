import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const currentPage = ref(1);
  const hasMore = ref(true);
  const searchTerm = ref("");
  const sortField = ref(null);
  const sortDirection = ref("asc");

  const sortedPosts = computed(() => {
    if (!sortField.value) return posts.value;

    return [...posts.value].sort((a, b) => {
      let aVal = a[sortField.value];
      let bVal = b[sortField.value];

      if (typeof aVal === "string") {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (aVal < bVal) return sortDirection.value === "asc" ? -1 : 1;
      if (aVal > bVal) return sortDirection.value === "asc" ? 1 : -1;
      return 0;
    });
  });

  const paginatedPosts = computed(() => {
    return sortedPosts.value.slice(0, currentPage.value * 30);
  });

  const fetchPosts = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts"
      );
      if (!response.ok) throw new Error("Failed to fetch posts");
      posts.value = await response.json();
      currentPage.value = 1;
      hasMore.value = true;
      searchTerm.value = "";
    } catch (err) {
      error.value = "Сервис временно недоступен. Пожалуйста, попробуйте позже.";
      console.error("Error fetching posts:", err);
    } finally {
      loading.value = false;
    }
  };

  const searchPosts = async (query) => {
    loading.value = true;
    error.value = null;
    searchTerm.value = query;

    try {
      const url = query
        ? `https://jsonplaceholder.typicode.com/posts?title_like=${encodeURIComponent(
            query
          )}`
        : "https://jsonplaceholder.typicode.com/posts";

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to search posts");
      posts.value = await response.json();
      currentPage.value = 1;
      hasMore.value = true;
    } catch (err) {
      error.value = "Сервис временно недоступен. Пожалуйста, попробуйте позже.";
      console.error("Error searching posts:", err);
    } finally {
      loading.value = false;
    }
  };

  const loadMore = () => {
    if (
      hasMore.value &&
      paginatedPosts.value.length < sortedPosts.value.length
    ) {
      currentPage.value += 1;
    } else {
      hasMore.value = false;
    }
  };

  const sortPosts = (field) => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortField.value = field;
      sortDirection.value = "asc";
    }
    currentPage.value = 1;
  };

  const resetState = () => {
    currentPage.value = 1;
    hasMore.value = true;
    sortField.value = null;
    sortDirection.value = "asc";
  };

  return {
    posts,
    loading,
    error,
    paginatedPosts,
    sortedPosts,
    hasMore,
    searchTerm,
    sortField,
    sortDirection,
    fetchPosts,
    searchPosts,
    loadMore,
    sortPosts,
    resetState,
  };
});
