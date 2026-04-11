import { useHistoryStore } from "../store/useHistoryStore";

export const HistoryProvider = ({ children }) => {
  return <>{children}</>;
};

export const useHistory = () => {
  const { history, addHistory, clearHistory, removeItem } = useHistoryStore();
  return { history, addHistory, clearHistory, removeItem, isLoading: false };
};
