import type { CartItem } from './cart.types';
  import type { ViaCepAddress } from './cep.types';

  // Métodos de pagamento aceitos no Checkout.
  // Hoje só PIX conforme orientação na issue #75. Novos métodos entram nesta união (ex: 'pix' | 'card').
  export type PaymentMethod = 'pix';

  export interface OrderTotals {
    subtotal: number;
    discount: number;
    total: number;
  }

  /**
   * Estado do pedido durante o fluxo de Checkout.
   *
   * Construído na CheckoutPage e passado para a PaymentPage via
   * router state do react-router-dom:
   *
   *   navigate('/payment', { state: order });            // CheckoutPage
   *   const order = useLocation().state as OrderState;   // PaymentPage
   *
   * Não é persistido em localStorage: apenas trafega entre as duas
   * rotas. O carrinho continua em estado global; o OrderState é o
   * snapshot enviado para pagamento.
   *
   * `address` parte do auto-complete da ViaCEP (issue #72) e pode ter
   * sido editada pelo usuário antes do envio.
   */
  
  export interface OrderState {
    items: CartItem[];
    address: ViaCepAddress;
    paymentMethod: PaymentMethod;
    totals: OrderTotals;
  }