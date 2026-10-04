import colors from "@/constants/colors";
import { useColorScheme } from "./useColorScheme";

export default function useColors() {
  const colorScheme = useColorScheme();

  return colors[colorScheme];
}
