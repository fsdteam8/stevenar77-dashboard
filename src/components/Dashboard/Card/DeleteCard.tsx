import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type DeleteAlertDialogProps = {
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  itemName?: string;
  onConfirm: () => void;
  actionText?: string;
};

const DeleteAlertDialog: React.FC<DeleteAlertDialogProps> = ({
  trigger,
  title = "Delete Item",
  description,
  itemName,
  onConfirm,
  actionText = "Delete"
}) => {
  const defaultDescription = itemName 
    ? `Are you sure you want to delete "${itemName}"? This action cannot be undone. This will permanently remove the item and all associated data.`
    : "Are you sure? This action cannot be undone. This will permanently delete the item and remove all associated data.";

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description || defaultDescription}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700"
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAlertDialog;