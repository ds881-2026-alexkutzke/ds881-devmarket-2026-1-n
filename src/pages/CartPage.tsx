const CartPage = () => {
  const cartItems: unknown[] = [];

  if (cartItems.length === 0) {
    return (
      <main className="cart-page">
        <section className="empty-state" aria-labelledby="cart-empty-title">
          <h1 id="cart-empty-title">Seu carrinho está vazio</h1>
          <p>Adicione produtos ao carrinho para continuar sua compra.</p>
          <a className="empty-state__button" href="/home">
            Continuar comprando
          </a>
        </section>
      </main>
    );
  }

  return (
    <main className="cart-page">
      <h1>Carrinho</h1>
    </main>
  );
};

export default CartPage;
