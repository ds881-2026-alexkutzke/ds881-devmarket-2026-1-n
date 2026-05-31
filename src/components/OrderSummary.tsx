import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export interface OrderTotals {
  subtotal: number;
  shipping: number;
  total: number;
}

interface OrderSummaryProps {
  totals: OrderTotals;
  disabled?: boolean;
  onConfirm: () => void;
}

const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

const OrderSummary = ({ totals, disabled = false, onConfirm }: OrderSummaryProps) => {
  return (
    <Paper variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Resumo do pedido
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={1}>
        <Typography variant="body2" color="text.secondary">
          Subtotal
        </Typography>
        <Typography variant="body2">{formatCurrency(totals.subtotal)}</Typography>
      </Box>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <Typography variant="body2" color="text.secondary">
          Frete
        </Typography>
        <Typography variant="body2">{formatCurrency(totals.shipping)}</Typography>
      </Box>

      <Divider sx={{ mb: 2 }} />

      <Box display="flex" justifyContent="space-between" mb={3}>
        <Typography variant="subtitle1" fontWeight="bold">
          Total
        </Typography>
        <Typography variant="subtitle1" fontWeight="bold">
          {formatCurrency(totals.total)}
        </Typography>
      </Box>

      <Button
        variant="contained"
        fullWidth
        disabled={disabled}
        onClick={onConfirm}
      >
        Finalizar pagamento
      </Button>
    </Paper>
  );
};

export default OrderSummary;
