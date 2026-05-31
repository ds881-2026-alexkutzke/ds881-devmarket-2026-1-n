import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddressForm, { type AddressFormValue, type CepStatus } from '@/components/AddressForm';
import useCep from '@/hooks/useCep';
import { isValidCep } from '@/utils/isValidCep';

export default function CheckoutPage() {
  const { t } = useTranslation();
  const [formValue, setFormValue] = useState<AddressFormValue>({
    cep: '',
    logradouro: '',
    numero: '',
    complemento: '',
    bairro: '',
    cidade: '',
    estado: '',
  });
  const { lookup, address, isLoading, error } = useCep();
  const numeroInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isValidCep(formValue.cep)) {
      lookup(formValue.cep);
    }
  }, [formValue.cep, lookup]);

  useEffect(() => {
    if (address) {
      numeroInputRef.current?.focus();
    }
  }, [address]);

  const displayValue: AddressFormValue = {
    ...formValue,
    ...(address && {
      logradouro: address.logradouro,
      bairro: address.bairro,
      cidade: address.localidade,
      estado: address.uf,
    }),
  };

  const cepStatus: CepStatus = isLoading
    ? 'loading'
    : !isValidCep(formValue.cep)
    ? 'idle'
    : error
    ? 'error'
    : address
    ? 'ok'
    : 'idle';

  return (
    <main className="mx-auto max-w-2xl p-4">
      <h1 className="mb-4 text-xl font-semibold">{t('pages.checkout.title')}</h1>
      <AddressForm
        value={displayValue}
        onChange={setFormValue}
        cepStatus={cepStatus}
        numeroInputRef={numeroInputRef}
      />
    </main>
  );
}
