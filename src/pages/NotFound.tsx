import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div>
      <h1>404 - Página não encontrada</h1>
      <p>A página que você procura não existe.</p>
      <Link to="/">Voltar para a página inicial</Link>
    </div>
  );
}

export default NotFound;
