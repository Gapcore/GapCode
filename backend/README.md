# Backend removido do fluxo de produção

O site GapCore é hospedado como **site estático na Hostinger**.

O formulário de contato envia dados **diretamente** para o Supabase via `contato.js`:

```js
supabase.from("leads").insert([...])
```

Não use mais:
- Express / `server.js`
- `localhost:3000`
- `POST /leads`
- `contato.html/leads`

Esta pasta permanece apenas por histórico local. **Não faça deploy do backend na Hostinger.**
