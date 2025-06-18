function exibirMensagem(tipo, mensagem) {
    const msgElement = document.getElementById(tipo === 'success' ? 'messageSuccess' : 'messageError');
    msgElement.textContent = mensagem;
    msgElement.style.display = 'block';
    setTimeout(() => msgElement.style.display = 'none', 3000);
}

function carregarDados() {
    let capturas = JSON.parse(localStorage.getItem("capturas")) || [];
    let locais = [...new Set(capturas.map(c => c.local))];
    let select = document.getElementById("local");
    select.innerHTML = '<option value="">seleccione ou digite um local</option>' + locais.map(loc => `<option value="${loc}">${loc}</option>`).join("");
    carregarAnos();
}

function carregarAnos() {
    let capturas = JSON.parse(localStorage.getItem("capturas")) || [];
    let anos = [...new Set(capturas.map(c => c.data.substring(0, 4)))];
    let selectAno = document.getElementById("anoConsulta");
    anos.sort((a, b) => b - a);
    selectAno.innerHTML = anos.map(ano => `<option value="${ano}">${ano}</option>`).join("");
}