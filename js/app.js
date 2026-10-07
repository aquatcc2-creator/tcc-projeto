// Aplicação Aqua Track - Funções de Alertas, Cálculos e Relatório PDF

// Classificação de pH
function statusPH(ph) {
    if (ph >= 7.0 && ph <= 7.4) return { texto: 'Normal', classe: 'normal', ideal: true };
    if (ph < 7.0) return { texto: 'Abaixo do esperado (Ácido)', classe: 'warning', ideal: false, tipo: 'baixo' };
    return { texto: 'Acima do esperado (Básico/Alcalino)', classe: 'danger', ideal: false, tipo: 'alto' };
}

// Classificação de Temperatura
function statusTemp(temp) {
    if (temp >= 24 && temp <= 28) return { texto: 'Normal', classe: 'normal', ideal: true };
    if (temp < 24) return { texto: 'Abaixo do recomendado', classe: 'warning', ideal: false };
    return { texto: 'Acima do recomendado', classe: 'danger', ideal: false };
}

function formatarData(ts) {
    if (!ts) return { data: '--/--/----', hora: '--:--' };
    const d = new Date(ts);
    const dia = String(d.getDate()).padStart(2, '0');
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const ano = d.getFullYear();
    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return { data: `${dia}/${mes}/${ano}`, hora: `${hora}:${min}` };
}

// ========================================================
// POPUP NO CENTRO SUPERIOR DA TELA EM VERMELHO
// ========================================================
function exibirPopupAlertaPH(ph, tipo) {
    let popup = document.getElementById("popupAlertaPH");

    if (!popup) {
        popup = document.createElement("div");
        popup.id = "popupAlertaPH";
        popup.className = "popup-alerta-topo";
        document.body.appendChild(popup);
    }

    const mensagemMotivo = tipo === 'baixo' 
        ? `pH em <strong>${ph.toFixed(1).replace('.', ',')}</strong> está ABAIXO do ideal (Ácido). Risco de corrosão e desconforto!` 
        : `pH em <strong>${ph.toFixed(1).replace('.', ',')}</strong> está ACIMA do ideal (Alcalino). Risco de água turva e perda de eficácia sanitizante!`;

    popup.innerHTML = `
        <div class="popup-conteudo">
            <div class="popup-icone">⚠️</div>
            <div class="popup-texto">
                <h4>ALERTA DE QUALIDADE DA ÁGUA!</h4>
                <p>${mensagemMotivo}</p>
                <a href="tratamento_ph.html" class="popup-botao">Ver Guia de Tratamento de pH →</a>
            </div>
            <button class="popup-fechar" onclick="fecharPopupAlertaPH()">&times;</button>
        </div>
    `;

    popup.classList.add("ativo");
}

function fecharPopupAlertaPH() {
    const popup = document.getElementById("popupAlertaPH");
    if (popup) popup.classList.remove("ativo");
}

// ========================================================
// GERAÇÃO DE RELATÓRIO PDF DAS MEDIÇÕES
// ========================================================
function gerarRelatorioPDF() {
    if (typeof html2pdf === 'undefined') {
        alert("Carregando ferramenta de PDF. Por favor, aguarde alguns segundos ou verifique a conexão com a internet.");
        return;
    }

    const elemento = document.getElementById("conteudoRelatorioPDF");
    if (!elemento) {
        alert("Elemento do relatório não encontrado.");
        return;
    }

    const opt = {
        margin:       [10, 10, 10, 10],
        filename:     `Relatorio_AquaTrack_${new Date().toISOString().slice(0,10)}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(elemento).save();
}

