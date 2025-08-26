import { useQuery } from "@tanstack/react-query";
import { useBasePath } from "./use-base-path";

export function useContent<T>(contentType: string) {
  const { basePath } = useBasePath();
  
  return useQuery<T>({
    queryKey: [`content/${contentType}`],
    queryFn: async () => {
      const dataPath = `${basePath}/data/${contentType}.json`;
      const response = await fetch(dataPath);
      if (!response.ok) {
        throw new Error(`Failed to fetch ${contentType} data from ${dataPath}`);
      }
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
