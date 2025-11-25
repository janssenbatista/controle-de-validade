# 📦 Controle de Validade

Sistema de gerenciamento e controle de produtos com base na data de validade. Permite visualizar, adicionar, pesquisar e remover produtos, categorizando-os automaticamente por status de validade.

## 📋 Sobre o Projeto

O **Controle de Validade** é uma aplicação web desenvolvida para ajudar no gerenciamento de produtos perecíveis, alertando sobre itens próximos ao vencimento ou já vencidos. O sistema categoriza automaticamente os produtos em quatro níveis de alerta:

- 🔴 **Vencido**: Produtos com data de validade ultrapassada
- 🟠 **Crítico**: Produtos que vencem em até 7 dias
- 🟡 **Atenção**: Produtos que vencem em até 30 dias
- 🟢 **Válido**: Produtos com mais de 30 dias de validade

## ✨ Funcionalidades

- ✅ Dashboard com cards de status mostrando quantidade de produtos por categoria
- ✅ Listagem de produtos com informações de descrição, data de validade, estoque e status
- ✅ Filtro por status (clique nos cards para filtrar)
- ✅ Pesquisa em tempo real por descrição (Ctrl+K para focar no campo)
- ✅ Paginação configurável (10, 20, 50, 100 ou Todos)
- ✅ Seleção múltipla de produtos para exclusão em lote
- ✅ Modal para adicionar novos produtos
- ✅ Skeleton loading durante carregamento
- ✅ Autenticação com Supabase
- ✅ Cache inteligente com TanStack Query
- ✅ Animações suaves com Framer Motion

## 🛠️ Tecnologias Utilizadas

### Frontend

- **React 19.2.0** - Biblioteca JavaScript para construção de interfaces
- **TypeScript 5.9.3** - Superset JavaScript com tipagem estática
- **Vite 7.2.4** - Build tool e dev server de alta performance
- **Tailwind CSS 4.1.17** - Framework CSS utility-first
- **React Router DOM 7.9.6** - Roteamento client-side

### Estado e Cache

- **TanStack Query 5.90.10** - Gerenciamento de estado assíncrono e cache

### UI/UX

- **Framer Motion 12.23.24** - Biblioteca de animações
- **Lucide React 0.554.0** - Ícones SVG

### Backend/Database

- **Supabase 2.84.0** - Backend-as-a-Service (PostgreSQL, Auth, Real-time)

### Qualidade de Código

- **ESLint 9.39.1** - Linter JavaScript/TypeScript
- **Prettier 3.6.2** - Formatador de código

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- Conta no **Supabase** (gratuita)

### 1. Clone o Repositório

```bash
git clone https://github.com/janssenbatista/controle-de-validade.git
cd controle-de-validade
```

### 2. Instale as Dependências

```bash
npm install
# ou
yarn install
```

### 3. Configure o Supabase

1. Acesse [supabase.com](https://supabase.com) e crie um novo projeto
2. Anote a **URL** e a **API Key (anon public)** do seu projeto
3. Crie um arquivo `.env` na raiz do projeto:

```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
```

### 4. Configure o Banco de Dados

Execute o script SQL disponível em `supabase-functions.sql` no SQL Editor do Supabase:

```sql
-- Cria a tabela de produtos
CREATE TABLE tb_products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  description TEXT NOT NULL,
  expiration_date DATE NOT NULL,
  stock INTEGER NOT NULL
);

-- Cria as funções necessárias (get_product_stats, get_products_by_status, get_all_products)
-- Veja o arquivo completo: supabase-functions.sql
```

### 5. Execute o Projeto

#### Modo Desenvolvimento

```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em: `http://localhost:5173`

#### Build para Produção

```bash
npm run build
# ou
yarn build
```

#### Preview do Build

```bash
npm run preview
# ou
yarn preview
```

## 📝 Scripts Disponíveis

| Script                 | Descrição                                 |
| ---------------------- | ----------------------------------------- |
| `npm run dev`          | Inicia o servidor de desenvolvimento      |
| `npm run build`        | Cria build de produção                    |
| `npm run preview`      | Preview do build de produção              |
| `npm run lint`         | Executa o linter                          |
| `npm run lint:fix`     | Corrige problemas de lint automaticamente |
| `npm run format`       | Formata o código com Prettier             |
| `npm run format:check` | Verifica formatação sem modificar         |

## 🎯 Atalhos de Teclado

- **Ctrl + K**: Foca no campo de pesquisa

## 🔐 Autenticação

O sistema utiliza autenticação via Supabase. Configure as políticas de segurança (RLS) no Supabase para controlar o acesso aos dados:

```sql
-- Habilitar RLS
ALTER TABLE tb_products ENABLE ROW LEVEL SECURITY;

-- Política de SELECT (qualquer usuário autenticado pode ler)
CREATE POLICY "Enable read access for authenticated users"
ON tb_products FOR SELECT
TO authenticated
USING (true);

-- Política de INSERT (qualquer usuário autenticado pode inserir)
CREATE POLICY "Enable insert access for authenticated users"
ON tb_products FOR INSERT
TO authenticated
WITH CHECK (true);

-- Política de DELETE (qualquer usuário autenticado pode deletar)
CREATE POLICY "Enable delete access for authenticated users"
ON tb_products FOR DELETE
TO authenticated
USING (true);
```

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:

1. Fazer um fork do projeto
2. Criar uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
4. Push para a branch (`git push origin feature/MinhaFeature`)
5. Abrir um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT.

## 👨‍💻 Autor

Desenvolvido por [Janssen Batista](https://github.com/janssenbatista)

---

⭐ Se este projeto foi útil para você, considere dar uma estrela no repositório!
