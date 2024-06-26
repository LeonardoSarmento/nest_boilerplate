**446098-binahki**
> tokei --exclude *.sql *.toml *.json *.csproj **/Migrations/*.cs docs/**/*.* --sort code

# v0.1.0

## Base de código

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Language            Files        Lines         Code     Comments       Blanks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TypeScript             46         2081         1716           36          329
 Shell                   1          107           77            9           21
 JSON                    1            9            9            0            0
───────────────────────────────────────────────────────────────────────────────
 Markdown                3          275            0          188           87
 |- BASH                 2            7            7            0            0
 (Total)                            282            7          188           87
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Total                  51         2479         1809          233          437
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

# v0.5.0

## Base de código

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Language            Files        Lines         Code     Comments       Blanks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TypeScript             62         3088         2537           59          492
 Shell                   1          107           77            9           21
 JSON                    1            9            9            0            0
───────────────────────────────────────────────────────────────────────────────
 Markdown                3          355            0          256           99
 |- BASH                 2            7            7            0            0
 (Total)                            362            7          256           99
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Total                  67         3566         2630          324          612
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

---

# v1.0.0 (2024-02-06)

Correção da funcionalidade de "Desabilitar um _Sensor_".

## Base de código

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Language            Files        Lines         Code     Comments       Blanks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TypeScript             62         3162         2601           62          499
 Shell                   1          107           77            9           21
 JSON                    1            9            9            0            0
───────────────────────────────────────────────────────────────────────────────
 Markdown                3          244            0          166           78
 |- BASH                 2           19           13            6            0
 (Total)                            263           13          172           78
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Total                  67         3541         2700          243          598
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---
## Rotas

### Alterações internas

- `DELETE /sensor/{mac}`

	Invés de tentar deletar o _Sensor_, apenas atualiza o _Status do Sensor_ para "Desativado".

---

## Banco de dados

Versão atual da _Estrutura do banco de dados_ `v1.1.1`, implementando _Diagrama Entidade-Relacionamento_ versão `v1.1.1`.

### Novas Tabelas ou colunas

- _Status Sensor_ | `Sensor.status`

	Permite identificar se um _Sensor_ esta ativo ou não, sem ter que excluir o registro do mesmo.

### Novas Migrações

- `_v1.1.1`

## Git log (Commits)

```git
* c816cab - docs: getting started guide <cdonat-ist>
* 2074bfe - docs: swagger.json <cdonat-ist>
* 3d1d108 - v0.5.0 <cdonat-ist>
```

---

# v1.1.0 (2024-03-07)

## Principais tópicos:

- **Nova** tabela _Sensor em Usuário_.
- **Alteração da mecânica** de 'associação/desassociação' _Sensor_ e _Usuário_.

---

## Base de código

```text
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Language            Files        Lines         Code     Comments       Blanks
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 TypeScript             63         3364         2757           82          525
 Shell                   1          107           77            9           21
 JSON                    1            9            9            0            0
───────────────────────────────────────────────────────────────────────────────
 Markdown                3          250            0          168           82
 |- BASH                 2           19           13            6            0
 (Total)                            269           13          174           82
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 Total                  68         3749         2856          265          628
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

---

## Rotas

### Nova

- `PUT /sensor/{mac}/user/{user_id}/connect`

	Permite **associar** um _Sensor_ a um _Usuário_.

- `PUT /sensor/{mac}/user/{user_id}/disconnect`

	Permite **desassociar** um _Sensor_ a um _Usuário_, mantendo o registro do _Sensor_ no banco de dados.

<!-- ### Movida -->

### Alterações internas

- `POST /sensor/user`

	Caso o _Sensor_ já tenha cadastro, apenas associa o mesmo ao _Usuário_ informado.

<!-- ### Corpo da requisição (Request) -->

<!-- ### Retorno (response) -->

<!-- ### Descontinuadas -->

---

## Entidades

Versão atual da _Estrutura do banco de dados_ `v1.2.1`, implementando _Diagrama Entidade-Relacionamento_ versão `v?`.

<!-- ### Nova -->

<!-- ### Alterações internas -->

<!-- ### Removidas -->

### Alterações no Banco de Dados

- `v1.2.1`
- `v1.2.0`

## Git log (Commits)

```git
* e963429 - wip: docs for release (2024-03-06) <cdonat-ist>
* 75fc4f3 - refactor: sensor on user (2024-03-06) <cdonat-ist>
* 71b3ab0 - fix: db v1.2.1 (2024-03-06) <cdonat-ist>
* c13233b - refactor: db v1.2.0 (2024-03-06) <cdonat-ist>
* eef456d - docs: update swagger (2024-02-27) <cdonat-ist>
* 7a2b5a1 - v1.0.0 (2024-02-07) <cdonat-ist>
```

---
