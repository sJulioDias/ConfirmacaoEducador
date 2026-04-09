const form = document.getElementById("mensagemForm");
const resultado = document.getElementById("resultado");
const cartao = document.getElementById("cartao");

// Função auxiliar para pegar valor de input/textarea
function value(id) {
    return document.getElementById(id).value;
}

// Função para formatar data ISO (YYYY-MM-DD) em DD/MM/AAAA
function formatarDataISOparaBR(dataISO) {
    if (!dataISO) return "";
    const [ano, mes, dia] = dataISO.split("-");
    return `${dia}/${mes}/${ano}`;
}

// INPUT COLOR PARA PERSONALIZAÇÃO
const colorPicker = document.getElementById("colorPicker");

colorPicker.addEventListener("input", () => {
    const corEscolhida = colorPicker.value;
    cartao.style.background = corEscolhida;
});

// Função auxiliar para preencher texto em spans/divs
function text(id, value) {
    document.getElementById(id).textContent = value;
}

// SUBMISSÃO DO FORMULÁRIO
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nome = value("nome");
    const curso = value("curso");
    const dia = value("dia");
    const diaPrevio = value("diaPrevio");
    const datasEvento = value("datasEvento");
    const localEvento = value("localEvento");
    const codigoFip = value("codigoFip");

    // Preenche os campos do cartão com datas formatadas
    text("nomeSpan", nome);
    text("cursoSpan", curso);
    text("diaSpan", formatarDataISOparaBR(dia));
    text("cursoBox", curso);
    text("diaPrevioBox", formatarDataISOparaBR(diaPrevio));
    text("datasEventoBox", datasEvento);
    text("localEventoBox", localEvento);
    text("codigoFipBox", codigoFip);

    // Gera conteúdo de e-mail e descrição acessível
    gerarEmail(curso, formatarDataISOparaBR(dia), datasEvento, localEvento, codigoFip);
    gerarDescricao(nome, curso, formatarDataISOparaBR(dia), formatarDataISOparaBR(diaPrevio), datasEvento, localEvento, codigoFip);

    resultado.classList.remove("hidden");
    resultado.scrollIntoView({ behavior: "smooth" });
});

// BOTÃO PARA GERAR IMAGEM CORRIGIDO
const btnImagem = document.getElementById("btnImagem");
btnImagem.addEventListener("click", () => {
    // 1. Pegamos o estilo atual do cartão para saber qual cor o usuário escolheu
    const estiloAtual = window.getComputedStyle(cartao);
    const corDeFundo = estiloAtual.backgroundColor || estiloAtual.backgroundImage;

    html2canvas(cartao, {
        scale: 2,
        // 2. Passamos a cor atual para o html2canvas preencher os cantos arredondados
        backgroundColor: corDeFundo 
    }).then(canvas => {
        const link = document.createElement("a");
        link.download = "cartao-unibb.jpg";
        link.href = canvas.toDataURL("image/jpeg", 0.95);
        link.click();
    });
});

// BOTÃO PARA COPIAR TEXTO DO EMAIL
const btnCopiarEmail = document.getElementById("btnCopiarEmail");
btnCopiarEmail.addEventListener("click", () => {
    const emailTexto = document.getElementById("descricaoImagem").value;
    navigator.clipboard.writeText(emailTexto).then(() => {
        alert("Texto do e-mail copiado para a área de transferência!");
    }).catch(err => {
        console.error("Erro ao copiar texto: ", err);
    });
});

// BOTÃO PARA ALTERAR COR DO CARTÃO
const btnAlterarCor = document.getElementById("btnAlterarCor");
const cores = [
    "linear-gradient(160deg, #2c3e50, #000000)", // Grafite
    "linear-gradient(160deg, #102a43, #243b55)", // Marinho
    "linear-gradient(160deg, #0d324d, #1c1c1c)", // Petróleo
    "linear-gradient(160deg, #bdc3c7, #2c3e50)"  // Prata/Escuro
];
let indiceCor = 0;

btnAlterarCor.addEventListener("click", () => {
    indiceCor = (indiceCor + 1) % cores.length;
    cartao.style.background = cores[indiceCor];
});

// FUNÇÃO PARA GERAR TÍTULO DO EMAIL
function gerarEmail(curso, dia, datasEvento, localEvento, codigoFip) {
    document.getElementById("emailCorpo").value = `
Educador/a - Convite Atuação Curso ${curso} - Responder até ${dia}
`.trim();
}

// FUNÇÃO PARA GERAR DESCRIÇÃO DA IMAGEM (ACESSIBILIDADE)
function gerarDescricao(nome, curso, dia, diaPrevio, datasEvento, localEvento, codigoFip) {
    document.getElementById("descricaoImagem").value = `
#Paratodosverem
Cartão digital UniBB com informações de curso e instruções.

Olá, ${nome}!

Recebemos sua manifestação de interesse e validamos sua atuação como educador/a titular no curso "${curso}".
A autorização da atuação deve ser liberada pelo/a Gestor/a no Portal do Aluno, aba Gestor.

📅 Dia limite para autorização: ${dia}
📅 Dia prévio: ${diaPrevio}
📅 Datas e horários do evento: ${datasEvento}
📍 Local: ${localEvento}
📌 Código FIP/Ponto Eletrônico: ${codigoFip}

- Ausência deve ser registrada e despachada na Plataforma BB.
- Registro: Plataforma BB > Pessoas > Minha Visão > Ausências e Afastamentos > Planejamento de Ausências > Adicionar Ausência > Motivo: EDUCADOR – DIPES
- Despacho: Plataforma BB > Pessoas > Minha Visão > Ausências e Afastamentos > Planejamento de Ausências

Caso tenha necessidade de deslocamento e hospedagem, acesse o card em anexo para orientações.

Atenciosamente,
Gepes Especializada Educação e Seleção

`.trim();
}

const btnEmail = document.getElementById("btnEmail");

btnEmail.addEventListener("click", () => {
    // Usando o elemento 'cartao' (certifique-se de que ele existe no escopo)
    html2canvas(cartao, { scale: 2 }).then(canvas => {
        
        // 1. Primeiro gera o Blob para cópia
        canvas.toBlob(blob => {
            const item = new ClipboardItem({ "image/png": blob });

            // 2. Tenta copiar para a área de transferência
            navigator.clipboard.write([item]).then(() => {
                alert("Imagem copiada! Agora cole no corpo do e-mail.");

                // 3. Só abre o e-mail APÓS a confirmação da cópia
                const assunto = document.getElementById("emailCorpo").value || "Comunicado UniBB";
                const corpo = document.getElementById("descricaoImagem").value || "Segue comunicado em anexo.";

                const mailtoLink = `mailto:?subject=${encodeURIComponent(assunto)}&body=${encodeURIComponent(corpo)}`;
                window.location.href = mailtoLink;

            }).catch(err => {
                // 4. Tratamento de erro caso o navegador bloqueie a cópia
                console.error("Erro ao copiar imagem: ", err);
                alert("Não foi possível copiar a imagem automaticamente.");
            });
        });
    });
});
