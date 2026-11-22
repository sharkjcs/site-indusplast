#!/usr/bin/env bash
# Sobe o site da Indusplast na VPS sem mexer no sistema existente.
# Só cria/atualiza o container "indusplast-site" (porta interna 127.0.0.1:8081).
set -e
cd "$(dirname "$0")"

echo "== Quem usa as portas 80/443 hoje (só leitura) =="
ss -tlnp | grep -E ':(80|443) ' || echo "nenhum processo nas portas 80/443"
echo
echo "== Containers atuais =="
docker ps --format '{{.Names}} | {{.Image}} | {{.Ports}}'
echo
echo "== Proxies instalados no host =="
for s in nginx caddy apache2 traefik; do systemctl is-active --quiet "$s" 2>/dev/null && echo "$s ativo"; done
echo

if ss -tln | grep -q '127.0.0.1:8081 ' && ! docker ps --format '{{.Names}}' | grep -q '^indusplast-site$'; then
  echo "ERRO: a porta 8081 já está em uso por outro serviço. Nada foi alterado." >&2
  exit 1
fi

echo "== Subindo indusplast-site =="
docker compose up -d
sleep 2
if curl -fsS -o /dev/null http://127.0.0.1:8081/; then
  echo "OK: site respondendo em http://127.0.0.1:8081"
else
  echo "FALHA: o site não respondeu. Veja: docker logs indusplast-site" >&2
  exit 1
fi
