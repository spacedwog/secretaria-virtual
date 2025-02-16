# Secretaria Virtual

## Descrição
A **Secretaria Virtual** é um sistema desenvolvido em TypeScript para auxiliar no atendimento de pacientes em um escritório médico. O projeto visa fornecer funcionalidades para gestão de consultas, pacientes e relatórios de forma automatizada e eficiente.

## Estrutura do Projeto
O projeto está organizado nos seguintes módulos:

```
secretaria-virtual
|____ Back-end
        |____ database.ts            # Gerenciamento do banco de dados
        |____ doctor.service.ts      # Serviço para gestão de médicos
        |____ patient.service.ts     # Serviço para gestão de pacientes
|____ Cloud-dev
        |____ blackboard.py          # Script para integração com Blackboard v1.0
        |____ database.ts            # Configuração do banco de dados na nuvem
        |____ server.ts              # Servidor principal da aplicação
|____ ETL
        |____ ets.ts                 # Processo de Extração, Transformação e Carga de dados
|____ Front-end
        |____ consulta-medica.ts     # Interface de agendamento de consultas
        |____ index.ts               # Arquivo principal do front-end
        |____ menu-paciente.ts       # Interface de interação do paciente
```

## Funcionalidades Principais
- **Gestão de Pacientes e Médicos**: Cadastro, edição e remoção de dados.
- **Agendamento de Consultas**: Interface intuitiva para marcação e cancelamento de consultas.
- **Relatórios Automatizados**: Geração de relatórios nos formatos JSON, HTML e PDF.
- **Integração com Blackboard v1.0**: Permite anotações e compartilhamento de informações médicas.
- **Execução na Nuvem**: Arquitetura preparada para ambientes distribuídos e escaláveis.

## Tecnologias Utilizadas
- **Linguagem Principal**: TypeScript
- **Banco de Dados**: Normalizado no nível 5, utilizando triggers, procedures e views
- **Back-end**: Node.js com serviços RESTful
- **Front-end**: Interface interativa em TypeScript
- **ETL**: Processamento de dados para análise e relatórios
- **Cloud Computing**: Infraestrutura para execução remota

## Como Executar o Projeto
### Pré-requisitos
- Node.js instalado
- Gerenciador de pacotes (npm ou yarn)

### Instalação
1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/secretaria-virtual.git
   cd secretaria-virtual
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```

### Executando o Servidor
```sh
npm run dev
```

### Executando o ETL
```sh
npm run etl
```

## Contribuição
Contribuições são bem-vindas! Para sugerir melhorias ou corrigir problemas, abra uma _issue_ ou envie um _pull request_.

## Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE.md) para mais detalhes.
