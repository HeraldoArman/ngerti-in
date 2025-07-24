import {
  CommandResponsiveDialog,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import React, { Dispatch } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<React.SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting" />
      <CommandList>
        <CommandItem>Test</CommandItem>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
