import React from "react";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { MeetingForm } from "./meeting-form";
// import { useRouter } from "next/navigation";
import { MeetingGetOne } from "../../types";

interface UpdateMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialValues: MeetingGetOne;
}

export const UpdateMeetingDialog = ({
  open,
  onOpenChange,
  initialValues,
}: UpdateMeetingDialogProps) => {
  // const router = useRouter();

  return (
    <>
      <ResponsiveDialog
        title="Edit Meeting"
        description="Edit the meeting details"
        open={open}
        onOpenChange={onOpenChange}
      >
        <MeetingForm
          onSuccess={() => onOpenChange(false)}
          onCancel={() => onOpenChange(false)}
          initialValues={initialValues}
        />
      </ResponsiveDialog>
    </>
  );
};
