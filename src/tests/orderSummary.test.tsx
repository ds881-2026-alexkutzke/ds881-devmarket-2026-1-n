import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import "../i18n/i18n";
import OrderSummary from "../components/OrderSummary";

describe("OrderSummary", () => {
  const mockTotals = {
    subtotal: 100,
    discount: 10,
    total: 90,
  };

  it("renders the order totals and confirmation button", () => {
    render(
      <OrderSummary totals={mockTotals} disabled={false} onConfirm={vi.fn()} />
    );

    expect(screen.getByText("Resumo do pedido")).toBeTruthy();
    expect(screen.getByText("R$ 100,00")).toBeTruthy();
    expect(screen.getByText("- R$ 10,00")).toBeTruthy();
    expect(screen.getByText("R$ 90,00")).toBeTruthy();
    expect(
      screen.getByRole("button", { name: /finalizar pagamento/i })
    ).toBeTruthy();
  });

  it("disables the confirm button when disabled is true", () => {
    render(
      <OrderSummary totals={mockTotals} disabled onConfirm={vi.fn()} />
    );

    const button = screen.getByRole("button", {
      name: /finalizar pagamento/i,
    }) as HTMLButtonElement;
    expect(button.disabled).toBe(true);
  });

  it("calls onConfirm when the button is clicked", () => {
    const onConfirm = vi.fn();

    render(
      <OrderSummary totals={mockTotals} disabled={false} onConfirm={onConfirm} />
    );

    const button = screen.getByRole("button", {
      name: /finalizar pagamento/i,
    });
    fireEvent.click(button);

    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
