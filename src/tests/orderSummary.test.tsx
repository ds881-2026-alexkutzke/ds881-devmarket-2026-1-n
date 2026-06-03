import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n/i18n";
import OrderSummary from "../components/OrderSummary";

describe("OrderSummary", () => {
  const mockTotals = {
    subtotal: 100,
    discount: 10,
    total: 90,
  };

  it("renders the order totals and confirmation button", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <OrderSummary totals={mockTotals} disabled={false} onConfirm={vi.fn()} />
      </I18nextProvider>
    );

    expect(screen.getByText("Resumo do pedido")).toBeTruthy();
    expect(screen.getByText("R$ 100,00")).toBeTruthy();
    expect(screen.getByText("- R$ 10,00")).toBeTruthy();
    expect(screen.getByText("R$ 90,00")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /finalizar pagamento/i })
    ).toBeTruthy();
  });

  it("disables the confirm button when disabled is true", () => {
    render(
      <I18nextProvider i18n={i18n}>
        <OrderSummary totals={mockTotals} disabled onConfirm={vi.fn()} />
      </I18nextProvider>
    );

    const button = screen.getByRole("button", {
      name: /finalizar pagamento/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("calls onConfirm when the button is clicked", () => {
    const onConfirm = vi.fn();

    render(
      <I18nextProvider i18n={i18n}>
        <OrderSummary totals={mockTotals} disabled={false} onConfirm={onConfirm} />
      </I18nextProvider>
    );

    const button = screen.getByRole("button", {
      name: /finalizar pagamento/i,
    });
    fireEvent.click(button);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
