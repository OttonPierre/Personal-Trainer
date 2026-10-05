# Projeto: App da Oficina Mecânica

Os clientes agendam revisões e reparos para os seus veículos. O **administrador** da oficina gerencia os mecânicos, os serviços, os horários e a agenda.

## 1. Objetivo

Construir o app web descrito neste documento, em React, usando a **API de Agendamentos** como back-end.

## 2. O que a equipe recebe

- **Endereço da API:** `https://agendamentos.spaincentral.cloudapp.azure.com/api`. Os caminhos deste documento são relativos a ele: `/auth/login/`, por exemplo, é `https://agendamentos.spaincentral.cloudapp.azure.com/api/auth/login/`;
- **Documentação interativa** (Swagger) em https://agendamentos.spaincentral.cloudapp.azure.com/api/docs/, com todos os endpoints, campos, filtros e regras. Pelo botão **Authorize**, dá para testar as requisições com o token antes de escrever o código;
- **Organização** já cadastrada, com o slug `oficina-mecanica`. O app envia esse slug no cadastro, no login e no "esqueci minha senha";
- **Conta de administrador** (grupo `Administrador`), com e-mail e senha entregues pelo professor. As demais contas (grupo `Cliente`) são criadas pelo cadastro do próprio app.

## 3. Perfis de usuário

| Perfil | Grupo | O que faz |
|--------|-------|-----------|
| Cliente | `Cliente` | agenda, cancela e avalia |
| Administrador | `Administrador` | gerencia o negócio, os mecânicos, os serviços e os horários; confirma, conclui e cancela |

O app decide o que mostrar a partir de `permissoes` em `GET /auth/eu/`, e não pelo nome do grupo.

## 4. Termos do app e da API

| No app | Na API |
|--------|--------|
| Oficina | **organização** |
| Mecânico | **recurso** |
| Serviços oferecidos | **serviços** |
| Horários de cada mecânico | **disponibilidades** |
| Serviço agendado | **agendamento** |
| Avaliação do serviço agendado | **nota** e **comentário** do agendamento |

O app mostra "Mecânico" onde a API diz "recurso".

## 5. Dados iniciais

A organização começa vazia. Com a conta de administrador, a equipe cadastra os dados do negócio pelo próprio app (telas A4 a A9):

1. Enviar o logo e a descrição (`PATCH /organizacao/`, multipart);
2. Cadastrar os mecânicos (`POST /recursos/`) com foto, ex.: `{"nome": "Roberto", "bio": "Motor e suspensão"}`;
3. Cadastrar os serviços (`POST /servicos/`), cada um com imagem e os mecânicos que o oferecem:

| Serviço | Duração | Preço |
|---------|---------|-------|
| Diagnóstico | 45 min | R$ 100,00 |
| Troca de óleo | 30 min | R$ 120,00 |
| Alinhamento e balanceamento | 60 min | R$ 150,00 |
| Revisão completa | 120 min | R$ 300,00 |

4. Cadastrar as disponibilidades (`POST /disponibilidades/`), ex.: segunda a sexta das 08:00 às 12:00 e das 13:00 às 18:00.

## 6. Regras

- **Vagas:** cada mecânico atende até `capacidade` agendamentos ao mesmo tempo (1 por padrão). A API recusa o agendamento quando não há vaga, e `horarios-livres` só mostra horários com vaga;
- **Um de cada vez:** o cliente não pode ter dois agendamentos ativos (`solicitado` ou `confirmado`) em horários que se sobrepõem;
- **Status:** o agendamento começa como `solicitado` e só muda pelas ações `confirmar`, `concluir` e `cancelar`;
- **Qual veículo?** O app pede em `observacoes` o modelo e a placa do veículo.

## 7. Telas

Telas identificadas por perfil: **E** (todos), **C** (cliente) e **A** (administrador).

### Navegação

- **Antes do login:** E1 → E3 ou E2; E3 → E4 (esqueci minha senha);
- **Perfil:** E5 → E6 (alterar senha);
- **Cliente:** menu com Início (C1), Agendar (C2), Meus serviços agendados (C7), Mecânicos (C10), Perfil (E5);
- **Administrador:** menu com Agenda (A1), A confirmar (A2), Cadastros: negócio (A4), mecânicos (A5) e serviços (A8), Avaliações (A10), Perfil (E5).

Depois do login, o app escolhe a navegação pelas `permissoes` de `GET /auth/eu/`: quem tem `api.change_organizacao` vê a navegação do administrador.

### Resumo

| ID | Tela | Perfil |
|----|------|--------|
| E1 | Entrada | Todos |
| E2 | Cadastro | Todos |
| E3 | Login | Todos |
| E4 | Esqueci minha senha | Todos |
| E5 | Meu perfil | Todos |
| E6 | Alterar senha | Todos |
| C1 | Início | Cliente |
| C2 | Escolher serviço | Cliente |
| C3 | Escolher mecânico | Cliente |
| C4 | Escolher data e horário | Cliente |
| C5 | Confirmar agendamento | Cliente |
| C6 | Agendamento enviado | Cliente |
| C7 | Meus serviços agendados | Cliente |
| C8 | Detalhe do serviço agendado | Cliente |
| C9 | Avaliar | Cliente |
| C10 | Mecânicos | Cliente |
| C11 | Perfil do mecânico | Cliente |
| A1 | Agenda do dia | Administrador |
| A2 | A confirmar | Administrador |
| A3 | Detalhe do serviço agendado (administrador) | Administrador |
| A4 | Dados do negócio | Administrador |
| A5 | Mecânicos (administrador) | Administrador |
| A6 | Novo / editar mecânico | Administrador |
| A7 | Horários do mecânico | Administrador |
| A8 | Serviços (administrador) | Administrador |
| A9 | Novo / editar serviço | Administrador |
| A10 | Avaliações | Administrador |

Em todas as telas com dados da API: indicador de carregamento enquanto a requisição não termina, e mensagem de erro com "Tentar de novo" se ela falhar.

### E1. Entrada

- **Objetivo:** Primeira tela do app, com a marca do negócio.
- **Mostra:** logo e nome do negócio (guardados no app, porque ainda não há login)
- **Endpoints:** nenhum
- **Ações:** "Entrar" (vai para o login) e "Criar conta" (vai para o cadastro)
- **Estados:** se já houver tokens guardados, pula direto para o início do perfil

### E2. Cadastro

- **Objetivo:** Criar a conta de cliente.
- **Mostra:** formulário com nome, e-mail e senha
- **Endpoints:** `POST /auth/cadastro/` com `organizacao: "oficina-mecanica"` (fixo no app); em seguida `POST /auth/login/` para entrar automaticamente
- **Ações:** "Criar conta"
- **Estados:** **400**: mensagens por campo (ex.: e-mail já cadastrado, senha fraca); **429**: aguardar

### E3. Login

- **Objetivo:** Entrar no app.
- **Mostra:** formulário com e-mail e senha
- **Endpoints:** `POST /auth/login/` com `organizacao: "oficina-mecanica"`; guarda `access` e `refresh`; depois `GET /auth/eu/` para saber as `permissoes` e escolher a navegação
- **Ações:** "Entrar"; links para o cadastro e para "Esqueci minha senha"
- **Estados:** **400**: "Organização, e-mail ou senha inválidos"; **429**: aguardar

### E4. Esqueci minha senha

- **Objetivo:** Pedir um link para criar uma nova senha.
- **Mostra:** campo de e-mail
- **Endpoints:** `POST /auth/redefinir-senha/` com `organizacao: "oficina-mecanica"` e `email`
- **Ações:** "Enviar link"; voltar para o login
- **Estados:** sucesso (sempre a mesma resposta, exista ou não o e-mail): "Se o e-mail estiver cadastrado, você receberá um link para criar uma nova senha". O link abre uma página da própria API (fora do app), vale por 1 hora e só pode ser usado uma vez; **429**: aguardar

### E5. Meu perfil

- **Objetivo:** Ver e editar os próprios dados e sair.
- **Mostra:** foto, nome, e-mail e o nome do negócio
- **Endpoints:** `GET /auth/eu/`; `PATCH /auth/eu/` com `nome` e `foto` (multipart)
- **Ações:** editar nome, trocar ou remover a foto, "Alterar senha" (abre E6), "Sair" (apaga os tokens e volta para a entrada)
- **Estados:** **400** na foto: arquivo que não é imagem

### E6. Alterar senha

- **Objetivo:** Trocar a senha de quem está logado.
- **Mostra:** campos de senha atual, nova senha e confirmação da nova senha
- **Endpoints:** `POST /auth/alterar-senha/` com `senha_atual` e `nova_senha` (a confirmação é conferida só no app)
- **Ações:** "Salvar" (volta para o perfil com a mensagem "Senha alterada"); cancelar
- **Estados:** **400** por campo: senha atual incorreta ou nova senha fraca; **429**: aguardar

### C1. Início

- **Objetivo:** Resumo para o cliente.
- **Mostra:** logo e nome do negócio; um próximo serviço agendado (se houver); atalho para agendar
- **Endpoints:** `GET /organizacao/`; `GET /agendamentos/?data_inicio=<hoje>` (usa o primeiro `solicitado` ou `confirmado` que ainda não passou)
- **Ações:** "Agendar"; clicar no serviço agendado abre o detalhe
- **Estados:** vazio: "Você não tem serviços agendados agendados" com o botão "Agendar"

### C2. Escolher serviço

- **Objetivo:** Primeiro passo do agendamento.
- **Mostra:** cartões com imagem, nome, descrição, duração e preço
- **Endpoints:** `GET /servicos/`
- **Ações:** escolher um serviço
- **Estados:** vazio: "Nenhum serviço disponível"

### C3. Escolher mecânico

- **Objetivo:** Segundo passo do agendamento.
- **Mostra:** opção "Qualquer um" e cartões com foto, nome e bio dos mecânicos que oferecem o serviço; link para as avaliações do mecânico
- **Endpoints:** `GET /recursos/?servicos=<id do serviço>`
- **Ações:** escolher um mecânico ou "Qualquer um"
- **Estados:** vazio: "Nenhum mecânico realiza este serviço"

### C4. Escolher data e horário

- **Objetivo:** Escolher quando.
- **Mostra:** seletor de dia e os horários livres, agrupados por mecânico
- **Endpoints:** `GET /horarios-livres/?servico=<id>&data=<dia>` (com `&recurso=<id>` se escolheu alguém)
- **Ações:** trocar o dia; escolher um horário
- **Estados:** vazio: "Sem horários livres neste dia", com sugestão de outro dia

### C5. Confirmar agendamento

- **Objetivo:** Revisar e enviar.
- **Mostra:** resumo (serviço, mecânico, dia, horário, duração, preço) e campo de observações (ex.: "Fiat Argo ABC1D23: barulho na suspensão dianteira")
- **Endpoints:** `POST /agendamentos/` com `servico`, `recurso`, `inicio` e `observacoes`
- **Ações:** "Confirmar"; voltar
- **Estados:** **400** em `inicio` (vaga acabou ou já existe outro agendamento no horário): mostra a mensagem e volta para a escolha do horário

### C6. Agendamento enviado

- **Objetivo:** Informar que o pedido foi registrado.
- **Mostra:** resumo do serviço agendado, com status **solicitado** e o aviso de que o administrador vai confirmar
- **Endpoints:** nenhum (usa a resposta do `POST`)
- **Ações:** "Ver serviço agendado" (abre o detalhe) e "Início"
- **Estados:** —

### C7. Meus serviços agendados

- **Objetivo:** Acompanhar os serviços agendados.
- **Mostra:** abas "Próximos" e "Histórico"; cada item com serviço, mecânico, dia, horário e status
- **Endpoints:** Próximos: `GET /agendamentos/?data_inicio=<hoje>`; Histórico: `GET /agendamentos/?data_fim=<ontem>&ordering=-inicio` (mais recentes primeiro); paginação com `?page=`
- **Ações:** clicar em um item abre o detalhe; carregar mais (próxima página)
- **Estados:** vazio por aba: "Nenhum serviço agendado aqui"

### C8. Detalhe do serviço agendado

- **Objetivo:** Ver tudo sobre um agendamento.
- **Mostra:** serviço, mecânico, dia, horário, duração, status, observações e a avaliação (se já houver)
- **Endpoints:** `GET /agendamentos/{id}/`; `POST /agendamentos/{id}/cancelar/`
- **Ações:** "Cancelar" (pede confirmação; aparece em `solicitado` e `confirmado`); "Avaliar" (aparece em `concluido` sem `nota`)
- **Estados:** **400** ao cancelar: status não permite mais cancelar

### C9. Avaliar

- **Objetivo:** Dar nota ao serviço agendado concluído.
- **Mostra:** nota de 1 a 5 (estrelas) e comentário
- **Endpoints:** `POST /agendamentos/{id}/avaliar/` com `nota` e `comentario`
- **Ações:** "Enviar"
- **Estados:** **400**: nota fora de 1 a 5 ou já avaliado

### C10. Mecânicos

- **Objetivo:** Conhecer os mecânicos.
- **Mostra:** cartões com foto, nome e bio
- **Endpoints:** `GET /recursos/`
- **Ações:** clicar abre o perfil
- **Estados:** vazio: "Nenhum mecânico cadastrado"

### C11. Perfil do mecânico

- **Objetivo:** Ver os detalhes de um mecânico.
- **Mostra:** foto, nome, bio e serviços; lista de avaliações (nota, comentário, nome do cliente, serviço)
- **Endpoints:** `GET /recursos/{id}/`; `GET /servicos/` (para mostrar os nomes dos serviços); `GET /avaliacoes/?recurso=<id>` (paginado)
- **Ações:** "Agendar com este mecânico" (vai para a escolha do serviço, já com o mecânico escolhido)
- **Estados:** vazio: "Ainda sem avaliações"

### A1. Agenda do dia

- **Objetivo:** Ver os serviços agendados de um dia.
- **Mostra:** lista do dia por horário, com mecânico, serviço, nome de quem agendou, observações e status; filtro por mecânico
- **Endpoints:** `GET /agendamentos/?data_inicio=<dia>&data_fim=<dia>` (com `&recurso=<id>` para filtrar), carregando todas as páginas
- **Ações:** trocar o dia; clicar em um item abre o detalhe
- **Estados:** vazio: "Nenhum serviço agendado neste dia"

### A2. A confirmar

- **Objetivo:** Responder aos pedidos novos.
- **Mostra:** agendamentos `solicitado`, do mais próximo para o mais distante
- **Endpoints:** `GET /agendamentos/?status=solicitado`; `POST /agendamentos/{id}/confirmar/` e `/cancelar/`
- **Ações:** "Confirmar" e "Cancelar" em cada item
- **Estados:** vazio: "Nenhum pedido para confirmar"

### A3. Detalhe do serviço agendado (administrador)

- **Objetivo:** Ver e mudar o status de um agendamento.
- **Mostra:** tudo o que o cliente vê, mais o nome do cliente e a avaliação
- **Endpoints:** `GET /agendamentos/{id}/`; `POST /agendamentos/{id}/confirmar/`, `/concluir/` e `/cancelar/`
- **Ações:** "Confirmar" (em `solicitado`), "Concluir" (em `confirmado`) e "Cancelar" (em `solicitado` ou `confirmado`)
- **Estados:** **400**: transição de status inválida

### A4. Dados do negócio

- **Objetivo:** Manter a marca e a descrição.
- **Mostra:** formulário com nome, descrição e logo
- **Endpoints:** `GET /organizacao/`; `PATCH /organizacao/` (logo em multipart)
- **Ações:** "Salvar"; trocar ou remover o logo
- **Estados:** **400** por campo

### A5. Mecânicos (administrador)

- **Objetivo:** Gerenciar os mecânicos.
- **Mostra:** lista com foto, nome, capacidade e se está ativo, incluindo inativos; filtro ativos/inativos
- **Endpoints:** `GET /recursos/` (com `?ativo=true` ou `false` para filtrar)
- **Ações:** "Novo mecânico"; clicar em um item abre o formulário
- **Estados:** vazio: "Cadastre o primeiro mecânico"

### A6. Novo / editar mecânico

- **Objetivo:** Cadastrar ou alterar um mecânico.
- **Mostra:** formulário com nome, bio, foto, capacidade e ativo
- **Endpoints:** `POST /recursos/` ou `PATCH /recursos/{id}/` (foto em multipart)
- **Ações:** "Salvar"; "Horários" (abre os horários); desativar com `ativo: false` (não há exclusão)
- **Estados:** **400** por campo (ex.: capacidade menor que 1)

### A7. Horários do mecânico

- **Objetivo:** Definir quando atende.
- **Mostra:** horários por dia da semana (segunda a domingo)
- **Endpoints:** `GET /disponibilidades/?recurso=<id>`; `POST /disponibilidades/`; `PATCH` e `DELETE /disponibilidades/{id}/`
- **Ações:** adicionar, editar e remover faixas de horário (dia, início e fim)
- **Estados:** vazio: "Sem horários: ninguém consegue agendar"; **400**: fim antes do início

### A8. Serviços (administrador)

- **Objetivo:** Gerenciar os serviços.
- **Mostra:** lista com imagem, nome, duração, preço e se está ativo, incluindo inativos
- **Endpoints:** `GET /servicos/` (com `?ativo=true` ou `false` para filtrar)
- **Ações:** "Novo serviço"; clicar em um item abre o formulário
- **Estados:** vazio: "Cadastre o primeiro serviço"

### A9. Novo / editar serviço

- **Objetivo:** Cadastrar ou alterar um serviço.
- **Mostra:** formulário com nome, descrição, duração, preço, imagem, mecânicos que o oferecem (seleção múltipla) e ativo
- **Endpoints:** `POST /servicos/` ou `PATCH /servicos/{id}/` (imagem em multipart); `GET /recursos/` para a seleção
- **Ações:** "Salvar"; desativar com `ativo: false` (não há exclusão)
- **Estados:** **400** por campo

### A10. Avaliações

- **Objetivo:** Acompanhar a satisfação.
- **Mostra:** avaliações com nota, comentário, mecânico, serviço e cliente; filtros por mecânico e nota
- **Endpoints:** `GET /avaliacoes/` (com `?recurso=` e `?nota=`), paginado
- **Ações:** filtrar; carregar mais
- **Estados:** vazio: "Ainda sem avaliações"

## 8. Fluxos

### Agendar

1. **Qual serviço?** (C2);
2. **Com quem?** (C3) Um mecânico específico ou "qualquer um";
3. **Quando?** (C4) Um dos horários livres do dia;
4. **Confirmação** (C5) e **agendamento enviado** (C6), com status **solicitado**.

### Ciclo de vida

```
solicitado ──(administrador confirma)──> confirmado ──(administrador conclui)──> concluido ──(cliente avalia)
     │                                   │
     └───────────────────────────────────┴──> cancelado (cliente ou administrador cancela)
```

### Avaliar

Em um serviço agendado `concluido` ainda sem `nota`, o app mostra "Avaliar": uma nota de 1 a 5 e um comentário, enviados com `POST /agendamentos/{id}/avaliar/`. A avaliação aparece no perfil do mecânico.

## 9. Regras de interface por permissão

| Elemento | Aparece se `permissoes` contém |
|----------|--------------------------------|
| Botão "Confirmar" | `api.confirmar_agendamento` e status `solicitado` |
| Botão "Concluir" | `api.concluir_agendamento` e status `confirmado` |
| Botão "Cancelar" | `api.cancelar_agendamento` e status `solicitado` ou `confirmado` |
| Botão "Avaliar" | `api.avaliar_agendamento`, status `concluido` e `nota` vazia |
| Menu "Agendar" | `api.add_agendamento` |
| Menu "Administração" | `api.change_organizacao` |

Mesmo com os botões escondidos, a API recusa a ação com **403**. Esconder é só para a interface ficar mais clara.

## 10. Tratamento de erros

| Resposta | O app faz |
|----------|-----------|
| **400** | Mostra as mensagens de campo ao lado do campo (`{"campo": ["mensagem"]}`). Mensagens gerais vêm em `detail`, em `non_field_errors` ou em uma lista (`["mensagem"]`) |
| **401** | Tenta `POST /auth/renovar/` com o `refresh`. Se falhar, volta para o login |
| **403** | Mostra "Você não tem permissão para esta ação" |
| **404** | Mostra "Não encontrado" e volta para a lista |
| **429** | Mostra "Muitas tentativas, aguarde um minuto" |

## 11. Critérios de aceitação

- [ ] Cadastro, login, esqueci minha senha, alterar senha, renovação automática do token e logout;
- [ ] Logo do negócio e foto do usuário;
- [ ] Agendamento completo usando `horarios-livres`, com e sem mecânico escolhido;
- [ ] Próximos e histórico, com paginação;
- [ ] Administrador: a confirmar, agenda do dia, confirmar, concluir e cancelar;
- [ ] Administrador: dados do negócio, mecânicos (com capacidade), serviços e horários, com envio de imagens;
- [ ] Avaliação e avaliações no perfil do mecânico;
- [ ] Todas as telas do inventário, com os estados vazio, carregando e erro;
- [ ] Interface guiada por `permissoes`, sem testar o nome do grupo;
- [ ] Tratamento dos erros 400, 401, 403, 404 e 429.
