# Arquitetura do DevMarket

## 1. Visão Geral
O DevMarket é uma Aplicação de Página Única (SPA) focada exclusivamente no frontend. O sistema não possui backend próprio, delegando o fornecimento de dados, conversão de moedas e resolução de endereços para APIs públicas e gratuitas. 

## 2. Stack Tecnológica
* **Framework/Biblioteca:** React (via Vite) ou Vanilla JS (conforme decisão inicial dos Tech Leads).
* **Roteamento:** Client-side routing (ex: React Router).
* **Estilização:** CSS puro, Tailwind CSS ou Styled Components.
* **Hospedagem:** GitHub Pages.
* **CI/CD:** GitHub Actions.

## 3. Estrutura de Diretórios Obrigatória
A separação de responsabilidades é rígida. Componentes visuais não devem conter lógica de acesso a dados externos.

```text
/
├── .github/
│   └── workflows/       # Scripts de CI/CD (Pipeline DevOps)
├── public/              # Assets estáticos (ícones, imagens base)
├── src/
│   ├── components/      # Componentes visuais reutilizáveis (Botões, Cards)
│   ├── pages/           # Componentes de visualização de rotas (Home, Checkout)
│   ├── services/        # Exclusivo para chamadas de API (fetch/axios)
│   ├── store/           # Gerenciamento de estado global (Context, Redux, Zustand)
│   └── utils/           # Funções auxiliares (formatadores de moeda, máscaras)
├── Dockerfile           # Definição do ambiente de homologação local
└── docker-compose.yml   # Orquestração do ambiente de desenvolvimento
```

## 4. Integrações e Fluxo de Dados (APIs)
Todas as integrações devem ser isoladas na pasta `src/services/` e importar tratamento de erros (try/catch).

* **DummyJSON (`dummyjson.com/products`):** * *Uso:* Alimentação do catálogo.
    * *Comportamento:* Consulta executada na montagem da tela Home.
* **ExchangeRate-API (`open.er-api.com/v6/latest/USD`):** * *Uso:* Conversão de preços (DummyJSON retorna em USD).
    * *Comportamento:* Consulta armazenada em cache ou estado global para evitar chamadas excessivas durante a navegação.
* **ViaCEP (`viacep.com.br/ws/{cep}/json/`):** * *Uso:* Autocompletar no Checkout.
    * *Comportamento:* Acionado via evento `onBlur` ou quando o campo de CEP atinge 8 caracteres válidos.

## 5. Gerenciamento de Estado e Persistência
* **Estado Global:** O carrinho de compras deve ser gerenciado por um estado global para ser acessível tanto na Home (botão adicionar) quanto no Header (contador) e na tela de Checkout.
* **Persistência:** Toda mutação no carrinho (adicionar, remover, alterar quantidade) deve disparar um espelhamento no `localStorage` do navegador.
* **Hidratação:** Ao inicializar a aplicação, o estado global deve verificar o `localStorage` e carregar os itens salvos antes da primeira renderização.

## 6. Infraestrutura e Pipeline (DevOps)
O ciclo de vida da aplicação é gerenciado pelo GitHub Actions.

* **Ambiente Local:** O projeto deve ser executável localmente via `docker-compose up`, padronizando o ambiente de desenvolvimento independente do sistema operacional do desenvolvedor.
* **Integração Contínua (CI):** * Gatilho: Abertura ou atualização de Pull Requests contra a branch `main`.
    * Jobs: Instalação de dependências, verificação de Lint, e execução do build. Falhas no build bloqueiam o merge.
* **Entrega Contínua (CD):** * Gatilho: Merge aceito na branch `main`.
    * Jobs: Geração dos arquivos estáticos (build) e deploy automático para o ambiente do GitHub Pages.
