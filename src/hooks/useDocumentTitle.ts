import { useEffect } from "react";

/**
 * Hook responsável por alterar o título da página
 * enquanto o componente estiver montado.
 *
 * Quando o componente for desmontado, o título anterior
 * é restaurado automaticamente.
 *
 * @example
 * useDocumentTitle("Produtos | DevMarket");
 */
export default function useDocumentTitle(title: string) {
  useEffect(() => {
    // Salva o título atual antes de alterar
    const previousTitle = document.title;

    // Define o novo título da página
    document.title = title;

    // Cleanup executado ao desmontar o componente
    return () => {
      // Restaura o título anterior
      document.title = previousTitle;
    };
  }, [title]);
}