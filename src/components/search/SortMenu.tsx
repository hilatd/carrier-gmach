import {
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { useIntl } from "react-intl";
import type { SortOrder } from "../../hooks/useSort";
import { SortIcon } from "../icons";

interface Props {
  order: SortOrder;
  onOrderChange: (v: SortOrder) => void;
  field: string;
  onFieldChange: (v: string) => void;
  fields: { key: string; label: string }[];
}

export default function SortMenu({ order, onOrderChange, field, onFieldChange, fields }: Props) {
  const { formatMessage: t } = useIntl();

  return (
    <Menu placement="bottom-end">
      <MenuButton
        as={IconButton}
        aria-label={t({ id: "common.sort" })}
        icon={<SortIcon boxSize={5} />}
        variant="outline"
      />
      <MenuList minW="200px">
        {fields.length > 1 && (
          <>
            <MenuOptionGroup
              type="radio"
              title={t({ id: "common.sort" })}
              value={field}
              onChange={(v) => onFieldChange(v as string)}
            >
              {fields.map((f) => (
                <MenuItemOption key={f.key} value={f.key}>
                  {f.label}
                </MenuItemOption>
              ))}
            </MenuOptionGroup>
            <MenuDivider />
          </>
        )}
        <MenuOptionGroup type="radio" value={order} onChange={(v) => onOrderChange(v as SortOrder)}>
          <MenuItemOption value="desc">↓ {t({ id: "common.sort.newest" })}</MenuItemOption>
          <MenuItemOption value="asc">↑ {t({ id: "common.sort.oldest" })}</MenuItemOption>
        </MenuOptionGroup>
      </MenuList>
    </Menu>
  );
}
