/**
 * GapCore — Formulário de Contato
 * Envio direto para o Supabase (site estático na Hostinger).
 * Não usa Express, localhost nem endpoints /leads.
 */

/* ── Configuração única do projeto Supabase ── */
const SUPABASE_URL = "https://qzkqgdtnybghmkuuargj.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6a3FnZHRueWJnaG1rdXVhcmdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzODY0NDAsImV4cCI6MjA4ODk2MjQ0MH0.BxDFmgab3wf4pAZMz90kO06xc0RiGzkgaoMVAWs5A2A";

const TABLE_NAME = "leads";

const { createClient } = window.supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ── Elementos do DOM ── */
const form = document.getElementById("contatoForm");
const submitButton = document.getElementById("submitBtn");
const successCard = document.getElementById("successCard");
const formTitle = document.querySelector(".titulo");
const formError = document.getElementById("formError");

/**
 * Lê e normaliza os valores do formulário.
 */
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

/**
 * Valida campos obrigatórios.
 * @returns {string|null} Mensagem de erro ou null se válido.
 */
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
  submitButton.disabled = isLoading;
  submitButton.textContent = isLoading ? "Enviando..." : "Enviar Contato";
}

function showSuccess() {
  form.reset();
  form.style.display = "none";
  if (formTitle) formTitle.style.display = "none";
  successCard.classList.add("show");
}

/**
 * Insere o lead na tabela pública `leads`.
 */
async function insertLead(lead) {
  // Sem .select() — a role anon só precisa de INSERT (RLS).
  const { error } = await supabaseClient.from(TABLE_NAME).insert([lead]);
  return { error };
}

/**
 * Handler principal do submit.
 */
async function handleSubmit(event) {
  event.preventDefault();
  clearError();

  const lead = getFormData();
  const validationError = validateLead(lead);

  if (validationError) {
    showError(validationError);
    return;
  }

  setLoading(true);

  try {
    const { error } = await insertLead(lead);

    if (error) {
      console.error("Erro detalhado do Supabase:", error);
      showError(
        "Não foi possível enviar sua mensagem. Tente novamente em instantes."
      );
      setLoading(false);
      return;
    }

    showSuccess();
  } catch (err) {
    console.error("Erro inesperado ao enviar formulário:", err);
    showError(
      "Ocorreu um erro inesperado. Verifique sua conexão e tente novamente."
    );
    setLoading(false);
  }
}

/* ── Inicialização ── */
if (!form) {
  console.error('Formulário #contatoForm não encontrado no DOM.');
} else {
  form.addEventListener("submit", handleSubmit);
}
