import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import { useTranslation } from 'react-i18next';

interface PaymentMethodSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

function PaymentMethodSelector({ value, onChange }: PaymentMethodSelectorProps) {
  const { t } = useTranslation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <div className="rounded-lg border border-muted-300 bg-muted-50 p-4">
      <FormControl>
        <FormLabel
          id="payment-method-label"
          className="mb-2 text-sm font-medium text-muted-700"
        >
          {t('components.paymentMethodSelector.label')}
        </FormLabel>

        <RadioGroup
          aria-labelledby="payment-method-label"
          value={value}
          onChange={handleChange}
        >
          <FormControlLabel
            value="pix"
            control={
              <Radio
                size="small"
                className="text-primary-600 focus-visible:ring-2 focus-visible:ring-primary-500"
              />
            }
            label={
              <span className="text-sm text-muted-950">
                {t('components.paymentMethodSelector.pix')}
              </span>
            }
          />
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default PaymentMethodSelector;