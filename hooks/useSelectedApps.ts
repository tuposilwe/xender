import { useState } from "react";

const useSelectedApps = () => {
  const [selectedApps, setSelectedApps] = useState<string[]>([]); // Track multiple selected apps

  return { selectedApps, setSelectedApps };
};

export default useSelectedApps;
