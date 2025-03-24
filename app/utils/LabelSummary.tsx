import React from "react";
import { Text, View } from "react-native";

interface LabelSummaryProps {
  text: string;
}

const LabelSummary = ({ text }: LabelSummaryProps) => {
  const summaryLabel = (text: string) => {
    return text.length > 8 ? text.substring(0, 7) + "..." : text;
  };

  return <Text className="p-1">{summaryLabel(text)}</Text>;
};

export default LabelSummary;
