/**
 * GapCore — Formulário de Contato
 * Envio direto do navegador → Supabase (Hostinger estática).
 *
 * Projeto Supabase ATIVO (DNS resolve + REST responde):
 *   https://ddfvcqgzcrbchjicchty.supabase.co
 *
 * NÃO use qzkqgdtnybghmkuuargj — esse host não existe (ERR_NAME_NOT_RESOLVED).
 */

(function () {
  "use strict";

  /* ═══════════════════════════════════════════
   * 1) CONFIGURAÇÃO ÚNICA (mesmo projeto / mesma key)
   * ═══════════════════════════════════════════ */
  const SUPABASE_URL = "https://ddfvcqgzcrbchjicchty.supabase.co";
  const SUPABASE_ANON_KEY =
    "sb_publishable_XPWIazDX5IDMjKOcYbNtvg_-KCI0bH3";
  const TABLE_NAME = "leads";
  const EXPECTED_REQUEST_URL = `${SUPABASE_URL}/rest/v1/${TABLE_NAME}`;

  console.log("[GapCore] contato.js carregado", {
    href: window.location.href,
    supabaseUrl: SUPABASE_URL,
    expectedRequestUrl: EXPECTED_REQUEST_URL,
    keyPrefix: SUPABASE_ANON_KEY.slice(0, 18) + "...",
    hasWindowSupabase: typeof window.supabase !== "undefined"
  });

  /* ═══════════════════════════════════════════
   * 2) SDK + createClient
   * ═══════════════════════════════════════════ */
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error(
      "[GapCore] SDK Supabase NÃO carregou. Verifique o <script> do CDN em contato.html."
    );
    return;
  }

  const { createClient } = window.supabase;
  const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  console.log("[GapCore] createClient OK", {
    clientUrl: supabaseClient?.supabaseUrl,
    restUrl: supabaseClient?.rest?.url,
    clientKeys: Object.keys(supabaseClient || {})
  });

  /* ═══════════════════════════════════════════
   * 3) DOM
   * ═══════════════════════════════════════════ */
  const form = document.getElementById("contatoForm");
  const submitButton = document.getElementById("submitBtn");
  const successCard = document.getElementById("successCard");
  const formTitle = document.querySelector(".titulo");
  const formError = document.getElementById("formError");

  function getFormData() {
    return {
      nome: document.getElementById("nome").value.trim(),
      empresa: document.getElementById("empresa").value.trim(),
      telefone: document.getElementById("telefone").value.trim(),
      email: document.getElementById("email").value.trim(),
      servico: document.getElementById("servico").value.trim(),
      mensagem: document.getElementById("mensagem").value.trim()
    };
  }

  function validateLead(lead) {
    if (!lead.nome) return "Informe seu nome.";
    if (!lead.empresa) return "Informe o nome da empresa.";
    if (!lead.telefone) return "Informe seu telefone.";
    if (!lead.email) return "Informe seu e-mail.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
      return "Informe um e-mail válido.";
    }
    if (!lead.servico) return "Selecione o serviço de interesse.";
    if (!lead.mensagem) return "Escreva uma mensagem.";
    return null;
  }

  function showError(message) {
    if (!formError) return;
    formError.textContent = message;
    formError.hidden = false;
  }

  function clearError() {
    if (!formError) return;
    formError.textContent = "";
    formError.hidden = true;
  }

  function setLoading(isLoading) {
    if (!submitButton) return;
    submitButton.disabled = isLoading;
    submitButton.textContent = isLoading
      ? "Enviando..."
      : "🚀 Solicitar Demonstração";
  }

  function showSuccess() {
    form.reset();
    form.style.display = "none";
    if (formTitle) formTitle.style.display = "none";
    successCard.classList.add("show");
  }

  /** Serializa erro Supabase / fetch para o Console (sem [object Object]). */
  function serializeError(error) {
    if (!error) return null;
    if (error instanceof Error) {
      return {
        name: error.name,
        message: error.message,
        stack: error.stack,
        cause: error.cause ? serializeError(error.cause) : undefined
      };
    }
    try {
      return JSON.parse(JSON.stringify(error, Object.getOwnPropertyNames(error)));
    } catch (_) {
      return {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code,
        status: error.status,
        statusCode: error.statusCode,
        raw: String(error)
      };
    }
  }

  /**
   * Insert na tabela leads + logs completos da resposta.
   */
  async function insertLead(lead) {
    console.log("[GapCore] insertLead → payload", lead);
    console.log("[GapCore] insertLead → request alvo", EXPECTED_REQUEST_URL);

    const result = await supabaseClient.from(TABLE_NAME).insert([lead]);

    console.log("[GapCore] insertLead → resposta crua", {
      data: result.data,
      error: serializeError(result.error),
      status: result.status,
      statusText: result.statusText,
      count: result.count
    });

    if (result.error) {
      console.error(
        "[GapCore] insertLead → ERRO JSON",
        JSON.stringify(serializeError(result.error), null, 2)
      );
    }

    return result;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    clearError();

    console.log("[GapCore] handleSubmit iniciado");

    const lead = getFormData();
    const validationError = validateLead(lead);

    if (validationError) {
      console.warn("[GapCore] validação falhou:", validationError);
      showError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { error, status, statusText } = await insertLead(lead);

      if (error) {
        const serialized = serializeError(error);
        console.error("[GapCore] falha no insert", serialized);
        console.error("[GapCore] status HTTP", status, statusText);

        const msg = String(error.message || "");
        if (
          msg.includes("Failed to fetch") ||
          msg.includes("NetworkError") ||
          msg.includes("ERR_NAME_NOT_RESOLVED")
        ) {
          showError(
            "Não foi possível conectar ao banco (DNS/rede). Verifique a URL do Supabase."
          );
        } else if (
          error.code === "42501" ||
          msg.toLowerCase().includes("row-level security")
        ) {
          showError(
            "Permissão negada pelo banco (RLS). Execute supabase-leads-setup.sql no projeto correto."
          );
        } else if (error.code === "PGRST204" || msg.includes("Could not find")) {
          showError(
            "Coluna inexistente na tabela leads. Execute supabase-leads-setup.sql."
          );
        } else {
          showError(
            "Não foi possível enviar sua mensagem. Tente novamente em instantes."
          );
        }

        setLoading(false);
        return;
      }

      console.log("[GapCore] insert OK — lead gravado");
      showSuccess();
    } catch (err) {
      console.error(
        "[GapCore] exceção inesperada",
        JSON.stringify(serializeError(err), null, 2)
      );
      showError(
        "Ocorreu um erro inesperado. Verifique sua conexão e tente novamente."
      );
      setLoading(false);
    }
  }

  if (!form) {
    console.error("[GapCore] #contatoForm não encontrado no DOM");
    return;
  }

  form.addEventListener("submit", handleSubmit);
  console.log("[GapCore] listener submit registrado");
})();
