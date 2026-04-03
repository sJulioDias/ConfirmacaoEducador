const form = document.getElementById("mensagemForm");
const resultado = document.getElementById("resultado");
const cartao = document.getElementById("cartao");

// Função auxiliar para pegar valor de input/textarea
function value(id) {
    return document.getElementById(id).value;
}

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

    // Preenche os campos do cartão
    text("nomeSpan", nome);
    text("cursoSpan", curso);
    text("diaSpan", dia);
    text("cursoBox", curso);
    text("diaPrevioBox", diaPrevio);
    text("datasEventoBox", datasEvento);
    text("localEventoBox", localEvento);
    text("codigoFipBox", codigoFip);

    // Gera conteúdo de e-mail e descrição acessível
    gerarEmail(curso, dia, datasEvento, localEvento, codigoFip);
    gerarDescricao(nome, curso, dia, diaPrevio, datasEvento, localEvento, codigoFip);

    resultado.classList.remove("hidden");
    resultado.scrollIntoView({ behavior: "smooth" });
});

// BOTÃO PARA GERAR IMAGEM
const btnImagem = document.getElementById("btnImagem");
btnImagem.addEventListener("click", () => {
    html2canvas(cartao, {
        scale: 2,
        backgroundColor: "#022c4a"
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
    "linear-gradient(160deg, #022c4a, #04324f)", // padrão azul
    "linear-gradient(160deg, #4f0630, #6a0432)", // vinho
    "linear-gradient(160deg, #064f2f, #046a32)", // verde
    "linear-gradient(160deg, #4f4606, #6a5a04)"  // dourado
];
let indiceCor = 0;

btnAlterarCor.addEventListener("click", () => {
    indiceCor = (indiceCor + 1) % cores.length;
    cartao.style.background = cores[indiceCor];
});

// FUNÇÃO PARA GERAR TÍTULO DO EMAIL
function gerarEmail(curso, dia, datasEvento, localEvento, codigoFip) {
    document.getElementById("emailCorpo").value = `
Comunicado: Autorização para atuação no curso ${curso} - até ${dia}
`.trim();
}

// FUNÇÃO PARA GERAR DESCRIÇÃO DA IMAGEM (ACESSIBILIDADE)
function gerarDescricao(nome, curso, dia, diaPrevio, datasEvento, localEvento, codigoFip) {
    document.getElementById("descricaoImagem").value = `
Olá, ${nome}!

Recebemos sua manifestação de interesse e validamos sua atuação como educador titular no curso "${curso}".
A autorização da atuação deve ser liberada pelo/a Gestor/a no Portal do Aluno, aba Gestor.

📅 Dia limite para autorização: ${dia}
📅 Dia prévio: ${diaPrevio}
📅 Datas e horários do evento: ${datasEvento}
📍 Local: ${localEvento}
📌 Código FIP/Ponto Eletrônico: ${codigoFip}

#Paratodosverem
Cartão digital UniBB com informações do curso e instruções:
- Ausência deve ser registrada e despachada na Plataforma BB.
- Registro: Plataforma BB > Pessoas > Minha Visão > Ausências e Afastamentos > Planejamento de Ausências > Adicionar Ausência > Motivo: EDUCADOR – DIPES
- Despacho: Plataforma BB > Pessoas > Minha Visão > Ausências e Afastamentos > Planejamento de Ausências

Atenciosamente,
Gepes Especializada Belo Horizonte

`.trim();
}
