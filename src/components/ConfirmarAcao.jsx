import { Confirmacao } from './Confirmacao'

const ACOES = {
  confirmar: { titulo: 'Confirmar treino', mensagem: 'Deseja confirmar este treino?', variante: 'success' },
  concluir: { titulo: 'Concluir treino', mensagem: 'Deseja marcar este treino como concluído?', variante: 'success' },
  cancelar: { titulo: 'Cancelar treino', mensagem: 'Deseja mesmo cancelar este treino?', variante: 'danger' },
}

export function ConfirmarAcao({ acao, onConfirmar, onFechar }) {
  const { titulo, mensagem, variante } = ACOES[acao] ?? ACOES.confirmar

  return (
    <Confirmacao
      show={acao !== null}
      titulo={titulo}
      mensagem={mensagem}
      textoConfirmar={titulo}
      variante={variante}
      onConfirmar={onConfirmar}
      onFechar={onFechar}
    />
  )
}
