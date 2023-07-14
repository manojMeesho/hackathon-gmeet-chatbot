import { toast } from "react-hot-toast";

export const successToast = (message: string) =>
  toast.success(message, { position: "bottom-right" });

export const errorToast = (message: string) =>
  toast.error(message, { position: "bottom-right" });
