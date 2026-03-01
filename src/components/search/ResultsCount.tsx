import { Text } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";

export default function ResultsCount({ count }: { count: number }) {
  return (
    <Text fontSize="sm" color="gray.500" mb={4}>
      <FormattedMessage id="common.results" values={{ count }} />
    </Text>
  );
}