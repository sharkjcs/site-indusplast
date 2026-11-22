# Site da Indusplast (indusplastfios.com.br)

Site estático (HTML + CSS + JS) da Indusplast Indústria e Comércio, servido por um container nginx na VPS.

## O que tem aqui

| Arquivo | Para que serve |
|---|---|
| `site/` | O site: `index.html` e `assets/` (estilo, script e imagens). Para mudar o site, mude aqui. |
| `nginx.conf` | Configuração do nginx dentro do container (cache das imagens, cabeçalhos de segurança). |
| `docker-compose.yml` | Projeto Docker `indusplast`, container `indusplast-site`, só em `127.0.0.1:8081`. |
| `docker-compose.override.yml` | Põe o container na rede `servidor_default`, a do sistema, para o Caddy achar o site pelo nome. |
| `instalar.sh` | Primeira instalação: confere as portas e sobe o container. |

O endereço público (https) é do Caddy do sistema (`/root/sistema/servidor/Caddyfile`):
`indusplastfios.com.br` vai para `indusplast-site:80` e o `www` redireciona para o endereço sem www.

## Na VPS

Instalado em `/root/indusplast`. Primeira vez (ou para trocar a cópia antiga pela do GitHub):

```
cd /root && { [ ! -d indusplast ] || mv indusplast indusplast-antigo-$(date +%F); } && git clone https://github.com/sharkjcs/site-indusplast.git indusplast && cd indusplast && sh instalar.sh
```

Depois disso, o `sh atualizar.sh` do sistema já baixa a versão nova do site e confere se ele está no ar.
Para atualizar só o site:

```
cd /root/indusplast && git pull && docker compose up -d
```

A cópia antiga fica guardada em `/root/indusplast-antigo-DATA` (nada é apagado).
O repositório é privado: a VPS usa o mesmo acesso ao GitHub que já usa para o `/root/sistema`;
se o `git clone` pedir usuário e senha, esse acesso precisa ser liberado para este repositório também.

O nginx lê os arquivos direto da pasta `site/`, então mudança no HTML vale na hora (F5 no navegador).
