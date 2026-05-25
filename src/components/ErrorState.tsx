import Button from "@mui/material/Button";
import { useTranslation } from "react-i18next";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  const { t } = useTranslation();
  const resolvedMessage = t(message, { defaultValue: message });

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
      <p className="text-danger-700">{resolvedMessage}</p>
      {onRetry && (
        <Button variant="contained" color="error" onClick={onRetry}>
          {t("components.errorState.retry")}
        </Button>
      )}
    </div>
  );
}
