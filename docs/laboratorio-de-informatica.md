# Projeto: App do Laboratório de Informática

Os alunos reservam horários para usar os computadores dos laboratórios. Cada laboratório tem um número limitado de lugares por horário: a quantidade de computadores. O **coordenador** gerencia os laboratórios, os horários e as reservas.

## 1. Objetivo

Construir o app web descrito neste documento, em React, usando a **API de Agendamentos** como back-end.

## 2. O que a equipe recebe

- **Endereço da API:** `https://agendamentos.spaincentral.cloudapp.azure.com/api`. Os caminhos deste documento são relativos a ele: `/auth/login/`, por exemplo, é `https://agendamentos.spaincentral.cloudapp.azure.com/api/auth/login/`;
- **Documentação interativa** (Swagger) em https://agendamentos.spaincentral.cloudapp.azure.com/api/docs/, com todos os endpoints, campos, filtros e regras. Pelo botão **Authorize**, dá para testar as requisições com o token antes de escrever o código;
- **Organização** já cadastrada, com o slug `laboratorio-de-informatica`. O app envia esse slug no cadastro, no login e no "esqueci minha senha";
- **Conta de coordenador** (grupo `Administrador`), com e-mail e senha entregues pelo professor. As demais contas (grupo `Cliente`) são criadas pelo cadastro do próprio app.

## 3. Perfis de usuário

| Perfil | Grupo | O que faz |
|--------|-------|-----------|
| Aluno | `Cliente` | agenda, cancela e avalia |
| Coordenador | `Administrador` | gerencia o negócio, os laboratórios, os serviços e os horários; confirma, conclui e cancela |

O app decide o que mostrar a partir de `permissoes` em `GET /auth/eu/`, e não pelo nome do grupo.

## 4. Termos do app e da API

| No app | Na API |
|--------|--------|
| Instituição (escola ou departamento) | **organização** |
| Laboratório | **recurso** |
| Serviços oferecidos | **serviços** |
| Horários de cada laboratório | **disponibilidades** |
| Reserva | **agendamento** |
| Avaliação da reserva | **nota** e **comentário** do agendamento |

O app mostra "Laboratório" onde a API diz "recurso".

## 5. Dados iniciais

A organização começa vazia. Com a conta de coordenador, a equipe cadastra os dados do negócio pelo próprio app (telas A4 a A9):

1. Enviar o logo e a descrição (`PATCH /organizacao/`, multipart);
2. Cadastrar os laboratórios (`POST /recursos/`) com foto, ex.: `{"nome": "Laboratório 1", "capacidade": 30, "bio": "30 computadores com Linux"}`;
3. Cadastrar os serviços (`POST /servicos/`), cada um com imagem e os laboratórios que o oferecem:

| Serviço | Duração | Preço |
|---------|---------|-------|
| Uso por 1 hora | 60 min | R$ 0,00 |
| Uso por 2 horas | 120 min | R$ 0,00 |

4. Cadastrar as disponibilidades (`POST /disponibilidades/`), ex.: segunda a sexta das 08:00 às 12:00 e das 13:00 às 18:00, variando por laboratório.

## 6. Regras

- **Vagas:** cada laboratório atende até `capacidade` agendamentos ao mesmo tempo (1 por padrão). A API recusa o agendamento quando não há vaga, e `horarios-livres` só mostra horários com vaga;
- **Um de cada vez:** o aluno não pode ter dois agendamentos ativos (`solicitado` ou `confirmado`) em horários que se sobrepõem;
- **Status:** o agendamento começa como `solicitado` e só muda pelas ações `confirmar`, `concluir` e `cancelar`;
- **Lugares livres:** a `capacidade` de cada laboratório é o número de computadores dele. O aluno vê se um horário ainda tem lugar, mas não quantos restam: só o coordenador vê as reservas de todos;
- **Blocos de horário:** as reservas começam sempre na hora cheia (08:00, 09:00...). A API sugere horários a cada 15 minutos; o app mostra apenas os de hora cheia.

## 7. Telas

Telas identificadas por perfil: **E** (todos), **C** (aluno) e **A** (coordenador).

### Navegação

- **Antes do login:** E1 → E3 ou E2; E3 → E4 (esqueci minha senha);
- **Perfil:** E5 → E6 (alterar senha);
- **Aluno:** menu com Início (C1), Agendar (C2), Minhas reservas (C7), Laboratórios (C10), Perfil (E5);
- **Coordenador:** menu com Ocupação do dia (A1), A confirmar (A2), Cadastros: negócio (A4), laboratórios (A5) e serviços (A8), Avaliações (A10), Perfil (E5).

Depois do login, o app escolhe a navegação pelas `permissoes` de `GET /auth/eu/`: quem tem `api.change_organizacao` vê a navegação do coordenador.

### Resumo

| ID | Tela | Perfil |
|----|------|--------|
| E1 | Entrada | Todos |
| E2 | Cadastro | Todos |
| E3 | Login | Todos |
| E4 | Esqueci minha senha | Todos |
| E5 | Meu perfil | Todos |
| E6 | Alterar senha | Todos |
| C1 | Início | Aluno |
| C2 | Escolher serviço | Aluno |
| C3 | Escolher laboratório | Aluno |
| C4 | Escolher data e horário | Aluno |
| C5 | Confirmar agendamento | Aluno |
| C6 | Agendamento enviado | Aluno |
| C7 | Minhas reservas | Aluno |
| C8 | Detalhe da reserva | Aluno |
| C9 | Avaliar | Aluno |
| C10 | Laboratórios | Aluno |
| C11 | Perfil do laboratório | Aluno |
| A1 | Ocupação do dia | Coordenador |
| A2 | A confirmar | Coordenador |
| A3 | Detalhe da reserva (coordenador) | Coordenador |
| A4 | Dados do negócio | Coordenador |
| A5 | Laboratórios (coordenador) | Coordenador |
| A6 | Novo / editar laboratório | Coordenador |
| A7 | Horários do laboratório | Coordenador |
| A8 | Serviços (coordenador) | Coordenador |
| A9 | Novo / editar serviço | Coordenador |
| A10 | Avaliações | Coordenador |

Em todas as telas com dados da API: indicador de carregamento enquanto a requisição não termina, e mensagem de erro com "Tentar de novo" se ela falhar.

### E1. Entrada

- **Objetivo:** Primeira tela do app, com a marca do negócio.
- **Mostra:** logo e nome do negócio (guardados no app, porque ainda não há login)
- **Endpoints:** nenhum
- **Ações:** "Entrar" (vai para o login) e "Criar conta" (vai para o cadastro)
- **Estados:** se já houver tokens guardados, pula direto para o início do perfil

### E2. Cadastro

- **Objetivo:** Criar a conta de aluno.
- **Mostra:** formulário com nome, e-mail e senha
- **Endpoints:** `POST /auth/cadastro/` com `organizacao: "laboratorio-de-informatica"` (fixo no app); em seguida `POST /auth/login/` para entrar automaticamente
- **Ações:** "Criar conta"
- **Estados:** **400**: mensagens por campo (ex.: e-mail já cadastrado, senha fraca); **429**: aguardar

### E3. Login

- **Objetivo:** Entrar no app.
- **Mostra:** formulário com e-mail e senha
- **Endpoints:** `POST /auth/login/` com `organizacao: "laboratorio-de-informatica"`; guarda `access` e `refresh`; depois `GET /auth/eu/` para saber as `permissoes` e escolher a navegação
- **Ações:** "Entrar"; links para o cadastro e para "Esqueci minha senha"
- **Estados:** **400**: "Organização, e-mail ou senha inválidos"; **429**: aguardar

### E4. Esqueci minha senha

- **Objetivo:** Pedir um link para criar uma nova senha.
- **Mostra:** campo de e-mail
- **Endpoints:** `POST /auth/redefinir-senha/` com `organizacao: "laboratorio-de-informatica"` e `email`
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

- **Objetivo:** Resumo para o aluno.
- **Mostra:** logo e nome do negócio; uma próxima reserva (se houver); atalho para agendar
- **Endpoints:** `GET /organizacao/`; `GET /agendamentos/?data_inicio=<hoje>` (usa o primeiro `solicitado` ou `confirmado` que ainda não passou)
- **Ações:** "Agendar"; clicar na reserva abre o detalhe
- **Estados:** vazio: "Você não tem reservas agendadas" com o botão "Agendar"

### C2. Escolher serviço

- **Objetivo:** Primeiro passo do agendamento.
- **Mostra:** cartões com imagem, nome, descrição, duração e preço
- **Endpoints:** `GET /servicos/`
- **Ações:** escolher um serviço
- **Estados:** vazio: "Nenhum serviço disponível"

### C3. Escolher laboratório

- **Objetivo:** Segundo passo do agendamento.
- **Mostra:** opção "Qualquer um" e cartões com foto, nome e bio dos laboratórios que oferecem o serviço; link para as avaliações do laboratório
- **Endpoints:** `GET /recursos/?servicos=<id do serviço>`
- **Ações:** escolher um laboratório ou "Qualquer um"
- **Estados:** vazio: "Nenhum laboratório realiza este serviço"

### C4. Escolher data e horário

- **Objetivo:** Escolher quando.
- **Mostra:** seletor de dia e os horários livres, agrupados por laboratório; só os de hora cheia
- **Endpoints:** `GET /horarios-livres/?servico=<id>&data=<dia>` (com `&recurso=<id>` se escolheu alguém)
- **Ações:** trocar o dia; escolher um horário
- **Estados:** vazio: "Sem horários livres neste dia", com sugestão de outro dia

### C5. Confirmar agendamento

- **Objetivo:** Revisar e enviar.
- **Mostra:** resumo (serviço, laboratório, dia, horário, duração, preço) e campo de observações (ex.: "vou usar o software de modelagem 3D")
- **Endpoints:** `POST /agendamentos/` com `servico`, `recurso`, `inicio` e `observacoes`
- **Ações:** "Confirmar"; voltar
- **Estados:** **400** em `inicio` (vaga acabou ou já existe outro agendamento no horário): mostra a mensagem e volta para a escolha do horário

### C6. Agendamento enviado

- **Objetivo:** Informar que o pedido foi registrado.
- **Mostra:** resumo da reserva, com status **solicitada** e o aviso de que o coordenador vai confirmar
- **Endpoints:** nenhum (usa a resposta do `POST`)
- **Ações:** "Ver reserva" (abre o detalhe) e "Início"
- **Estados:** —

### C7. Minhas reservas

- **Objetivo:** Acompanhar as reservas.
- **Mostra:** abas "Próximos" e "Histórico"; cada item com serviço, laboratório, dia, horário e status
- **Endpoints:** Próximos: `GET /agendamentos/?data_inicio=<hoje>`; Histórico: `GET /agendamentos/?data_fim=<ontem>&ordering=-inicio` (mais recentes primeiro); paginação com `?page=`
- **Ações:** clicar em um item abre o detalhe; carregar mais (próxima página)
- **Estados:** vazio por aba: "Nenhuma reserva aqui"

### C8. Detalhe da reserva

- **Objetivo:** Ver tudo sobre um agendamento.
- **Mostra:** serviço, laboratório, dia, horário, duração, status, observações e a avaliação (se já houver)
- **Endpoints:** `GET /agendamentos/{id}/`; `POST /agendamentos/{id}/cancelar/`
- **Ações:** "Cancelar" (pede confirmação; aparece em `solicitado` e `confirmado`); "Avaliar" (aparece em `concluido` sem `nota`)
- **Estados:** **400** ao cancelar: status não permite mais cancelar

### C9. Avaliar

- **Objetivo:** Dar nota à reserva concluída.
- **Mostra:** nota de 1 a 5 (estrelas) e comentário
- **Endpoints:** `POST /agendamentos/{id}/avaliar/` com `nota` e `comentario`
- **Ações:** "Enviar"
- **Estados:** **400**: nota fora de 1 a 5 ou já avaliado

### C10. Laboratórios

- **Objetivo:** Conhecer os laboratórios.
- **Mostra:** cartões com foto, nome e bio
- **Endpoints:** `GET /recursos/`
- **Ações:** clicar abre o perfil
- **Estados:** vazio: "Nenhum laboratório cadastrado"

### C11. Perfil do laboratório

- **Objetivo:** Ver os detalhes de um laboratório.
- **Mostra:** foto, nome, bio e serviços; lista de avaliações (nota, comentário, nome do aluno, serviço)
- **Endpoints:** `GET /recursos/{id}/`; `GET /servicos/` (para mostrar os nomes dos serviços); `GET /avaliacoes/?recurso=<id>` (paginado)
- **Ações:** "Agendar com este laboratório" (vai para a escolha do serviço, já com o laboratório escolhido)
- **Estados:** vazio: "Ainda sem avaliações"

### A1. Ocupação do dia

- **Objetivo:** Ver as reservas de um dia.
- **Mostra:** para cada laboratório, os horários do dia com "ocupados / capacidade", contando só as reservas `solicitado` e `confirmado`; filtro por laboratório; clicar em um horário lista as reservas dele
- **Endpoints:** `GET /agendamentos/?data_inicio=<dia>&data_fim=<dia>` (com `&recurso=<id>` para filtrar), carregando todas as páginas; `GET /recursos/` (para a `capacidade` de cada um)
- **Ações:** trocar o dia; clicar em um item abre o detalhe
- **Estados:** vazio: "Nenhuma reserva neste dia"

### A2. A confirmar

- **Objetivo:** Responder aos pedidos novos.
- **Mostra:** agendamentos `solicitado`, do mais próximo para o mais distante
- **Endpoints:** `GET /agendamentos/?status=solicitado`; `POST /agendamentos/{id}/confirmar/` e `/cancelar/`
- **Ações:** "Confirmar" e "Cancelar" em cada item
- **Estados:** vazio: "Nenhum pedido para confirmar"

### A3. Detalhe da reserva (coordenador)

- **Objetivo:** Ver e mudar o status de um agendamento.
- **Mostra:** tudo o que o aluno vê, mais o nome do aluno e a avaliação
- **Endpoints:** `GET /agendamentos/{id}/`; `POST /agendamentos/{id}/confirmar/`, `/concluir/` e `/cancelar/`
- **Ações:** "Confirmar" (em `solicitado`), "Concluir" (em `confirmado`) e "Cancelar" (em `solicitado` ou `confirmado`)
- **Estados:** **400**: transição de status inválida

### A4. Dados do negócio

- **Objetivo:** Manter a marca e a descrição.
- **Mostra:** formulário com nome, descrição e logo
- **Endpoints:** `GET /organizacao/`; `PATCH /organizacao/` (logo em multipart)
- **Ações:** "Salvar"; trocar ou remover o logo
- **Estados:** **400** por campo

### A5. Laboratórios (coordenador)

- **Objetivo:** Gerenciar os laboratórios.
- **Mostra:** lista com foto, nome, capacidade e se está ativo, incluindo inativos; filtro ativos/inativos
- **Endpoints:** `GET /recursos/` (com `?ativo=true` ou `false` para filtrar)
- **Ações:** "Novo laboratório"; clicar em um item abre o formulário
- **Estados:** vazio: "Cadastre o primeiro laboratório"

### A6. Novo / editar laboratório

- **Objetivo:** Cadastrar ou alterar um laboratório.
- **Mostra:** formulário com nome, bio, foto, capacidade e ativo
- **Endpoints:** `POST /recursos/` ou `PATCH /recursos/{id}/` (foto em multipart)
- **Ações:** "Salvar"; "Horários" (abre os horários); desativar com `ativo: false` (não há exclusão)
- **Estados:** **400** por campo (ex.: capacidade menor que 1)

### A7. Horários do laboratório

- **Objetivo:** Definir quando atende.
- **Mostra:** horários por dia da semana (segunda a domingo)
- **Endpoints:** `GET /disponibilidades/?recurso=<id>`; `POST /disponibilidades/`; `PATCH` e `DELETE /disponibilidades/{id}/`
- **Ações:** adicionar, editar e remover faixas de horário (dia, início e fim)
- **Estados:** vazio: "Sem horários: ninguém consegue agendar"; **400**: fim antes do início

### A8. Serviços (coordenador)

- **Objetivo:** Gerenciar os serviços.
- **Mostra:** lista com imagem, nome, duração, preço e se está ativo, incluindo inativos
- **Endpoints:** `GET /servicos/` (com `?ativo=true` ou `false` para filtrar)
- **Ações:** "Novo serviço"; clicar em um item abre o formulário
- **Estados:** vazio: "Cadastre o primeiro serviço"

### A9. Novo / editar serviço

- **Objetivo:** Cadastrar ou alterar um serviço.
- **Mostra:** formulário com nome, descrição, duração, preço, imagem, laboratórios que o oferecem (seleção múltipla) e ativo
- **Endpoints:** `POST /servicos/` ou `PATCH /servicos/{id}/` (imagem em multipart); `GET /recursos/` para a seleção
- **Ações:** "Salvar"; desativar com `ativo: false` (não há exclusão)
- **Estados:** **400** por campo

### A10. Avaliações

- **Objetivo:** Acompanhar a satisfação.
- **Mostra:** avaliações com nota, comentário, laboratório, serviço e aluno; filtros por laboratório e nota
- **Endpoints:** `GET /avaliacoes/` (com `?recurso=` e `?nota=`), paginado
- **Ações:** filtrar; carregar mais
- **Estados:** vazio: "Ainda sem avaliações"

## 8. Fluxos

### Agendar

1. **Qual serviço?** (C2);
2. **Onde?** (C3) Um laboratório específico ou "qualquer um";
3. **Quando?** (C4) Um dos horários livres do dia;
4. **Confirmação** (C5) e **agendamento enviado** (C6), com status **solicitada**.

### Ciclo de vida

```
solicitado ──(coordenador confirma)──> confirmado ──(coordenador conclui)──> concluido ──(aluno avalia)
     │                                 │
     └─────────────────────────────────┴──> cancelado (aluno ou coordenador cancela)
```

### Avaliar

Em uma reserva `concluido` ainda sem `nota`, o app mostra "Avaliar": uma nota de 1 a 5 e um comentário, enviados com `POST /agendamentos/{id}/avaliar/`. A avaliação aparece no perfil do laboratório.

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
- [ ] Agendamento completo usando `horarios-livres`, com e sem laboratório escolhido, respeitando os blocos de hora cheia;
- [ ] Próximos e histórico, com paginação;
- [ ] Coordenador: a confirmar, ocupação do dia, confirmar, concluir e cancelar;
- [ ] Coordenador: dados do negócio, laboratórios (com capacidade), serviços e horários, com envio de imagens;
- [ ] Avaliação e avaliações no perfil do laboratório;
- [ ] Todas as telas do inventário, com os estados vazio, carregando e erro;
- [ ] Interface guiada por `permissoes`, sem testar o nome do grupo;
- [ ] Tratamento dos erros 400, 401, 403, 404 e 429.
