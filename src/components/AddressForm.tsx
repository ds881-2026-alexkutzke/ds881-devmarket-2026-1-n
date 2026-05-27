import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput,
} from "@mui/material";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import { useTranslation } from "react-i18next";

import { maskCep } from "@/utils/maskCep";

export type CepStatus = "idle" | "loading" | "error" | "ok";

export interface AddressFormValue {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}

interface AddressFormProps {
  value: AddressFormValue;
  onChange: (value: AddressFormValue) => void;
  cepStatus: CepStatus;
}

export default function AddressForm({
  value,
  onChange,
  cepStatus,
}: AddressFormProps) {
  const { t } = useTranslation();

  const cepStatusAdornment = (() => {
    if (cepStatus === "idle") return null;

    if (cepStatus === "loading") {
      return (
        <InputAdornment position="end">
          <CircularProgress
            size={18}
            aria-label={t("components.addressForm.cep.status.loading")}
          />
        </InputAdornment>
      );
    }

    if (cepStatus === "ok") {
      return (
        <InputAdornment position="end">
          <CheckCircleOutlinedIcon
            className="text-success-600"
            fontSize="small"
            aria-label={t("components.addressForm.cep.status.ok")}
          />
        </InputAdornment>
      );
    }

    return (
      <InputAdornment position="end">
        <ErrorOutlinedIcon
          className="text-danger-600"
          fontSize="small"
          aria-label={t("components.addressForm.cep.status.error")}
        />
      </InputAdornment>
    );
  })();

  const handleFieldChange = (
    field: keyof AddressFormValue,
    newValue: string,
  ) => {
    onChange({
      ...value,
      [field]: newValue,
    });
  };

  return (
    <form
      className="grid gap-3 rounded-lg bg-white p-4 sm:grid-cols-3"
      aria-label={t("components.addressForm.ariaLabel")}
    >
      <FormControl
        className="sm:col-span-3"
        fullWidth
        size="small"
        variant="outlined"
        error={cepStatus === "error"}
      >
        <InputLabel htmlFor="address-form-cep">
          {t("components.addressForm.fields.cep")}
        </InputLabel>

        <OutlinedInput
          id="address-form-cep"
          label={t("components.addressForm.fields.cep")}
          value={value.cep}
          onChange={(event) =>
            handleFieldChange("cep", maskCep(event.target.value))
          }
          endAdornment={cepStatusAdornment}
          inputProps={{ inputMode: "numeric" }}
        />

        {cepStatus === "error" ? (
          <FormHelperText>
            {t("components.addressForm.cep.helperError")}
          </FormHelperText>
        ) : null}
      </FormControl>

      <FormControl
        className="sm:col-span-2"
        fullWidth
        size="small"
        variant="outlined"
      >
        <InputLabel htmlFor="address-form-logradouro">
          {t("components.addressForm.fields.logradouro")}
        </InputLabel>
        <OutlinedInput
          id="address-form-logradouro"
          label={t("components.addressForm.fields.logradouro")}
          value={value.logradouro}
          onChange={(event) =>
            handleFieldChange("logradouro", event.target.value)
          }
        />
      </FormControl>

      <FormControl
        className="sm:col-span-1"
        fullWidth
        size="small"
        variant="outlined"
      >
        <InputLabel htmlFor="address-form-complemento">
          {t("components.addressForm.fields.complemento")}
        </InputLabel>
        <OutlinedInput
          id="address-form-complemento"
          label={t("components.addressForm.fields.complemento")}
          value={value.complemento}
          onChange={(event) =>
            handleFieldChange("complemento", event.target.value)
          }
        />
      </FormControl>

      <FormControl
        className="sm:col-span-3"
        fullWidth
        size="small"
        variant="outlined"
      >
        <InputLabel htmlFor="address-form-bairro">
          {t("components.addressForm.fields.bairro")}
        </InputLabel>
        <OutlinedInput
          id="address-form-bairro"
          label={t("components.addressForm.fields.bairro")}
          value={value.bairro}
          onChange={(event) => handleFieldChange("bairro", event.target.value)}
        />
      </FormControl>

      <FormControl
        className="sm:col-span-2"
        fullWidth
        size="small"
        variant="outlined"
      >
        <InputLabel htmlFor="address-form-cidade">
          {t("components.addressForm.fields.cidade")}
        </InputLabel>
        <OutlinedInput
          id="address-form-cidade"
          label={t("components.addressForm.fields.cidade")}
          value={value.cidade}
          onChange={(event) => handleFieldChange("cidade", event.target.value)}
        />
      </FormControl>

      <FormControl
        className="sm:col-span-1"
        fullWidth
        size="small"
        variant="outlined"
      >
        <InputLabel htmlFor="address-form-estado">
          {t("components.addressForm.fields.estado")}
        </InputLabel>
        <OutlinedInput
          id="address-form-estado"
          label={t("components.addressForm.fields.estado")}
          value={value.estado}
          onChange={(event) => handleFieldChange("estado", event.target.value)}
        />
      </FormControl>
    </form>
  );
}
