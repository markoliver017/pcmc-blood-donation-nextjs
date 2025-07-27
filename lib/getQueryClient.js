import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

// Using React's cache function ensures that every request gets its own
// unique instance of QueryClient, preventing data leakage between users.
const getQueryClient = cache(() => new QueryClient());
export default getQueryClient;
