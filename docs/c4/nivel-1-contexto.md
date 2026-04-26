# Diagrama C4 - Nível 1 - Contexto

Este diagrama apresenta a visão geral do **InovaHub** e como os usuários interagem com a solução.

```mermaid
C4Context
    title InovaHub - Nível 1 - Contexto

    Person(usuario, "Usuário / Participante", "Pessoa que se cadastra, acessa a plataforma pelo ID, envia ideias, conclui missões, usa o chat e acompanha o ranking.")
    Person(avaliador, "Gerente", "Pessoa que consulta o projeto, testa os contratos da API pelo Swagger e valida os requisitos da entrega.")

    System(inovahub, "InovaHub", "Plataforma web de inovação com cadastro, login por ID, ideias, missões, chat, ranking, API documentada e banco SQLite.")

    Rel(usuario, inovahub, "Acessa pelo navegador e utiliza as funcionalidades da plataforma")
    Rel(avaliador, inovahub, "Consulta documentação Swagger, executa testes e avalia a estrutura da solução")
```

## Descrição

No nível de contexto, o InovaHub é visto como um único sistema.

A solução permite que o usuário:

- realize cadastro com nome e e-mail;
- utilize o ID retornado no cadastro ou no Swagger para fazer login;
- acesse o dashboard;
- cadastre ideias;
- conclua missões;
- envie mensagens no chat;
- consulte ranking e pontuação.

O professor ou avaliador pode acessar o Swagger para validar os contratos da API e executar os testes do projeto.
