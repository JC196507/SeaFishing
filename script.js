document.addEventListener("DOMContentLoaded", () => {
    carregarDados();
    preencherAnos();
    limparFormularioRegistro(); // Adicionado para limpar o formulário no carregamento

    document.getElementById("concelho").addEventListener("change", function() {
        atualizarLocaisOrdenados();
    });
});

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js')
        .then(() => console.log("Service Worker registado!"))
        .catch(error => console.log("Erro no Service Worker:", error));
}

function carregarDados() {
    let concelhoSelect = document.getElementById("concelho");
    let localSelect = document.getElementById("local");

    concelhoSelect.innerHTML = '<option value="">Seleccione um concelho</option>';
    localSelect.innerHTML = '<option value="">Seleccione um local</option>';

    concelhosLocais.forEach(concelho => {
        let option = document.createElement("option");
        option.value = concelho.concelho;
        option.textContent = concelho.concelho;
        concelhoSelect.appendChild(option);
    });
}

function construirTabelaCapturas() {
    const container = document.getElementById("containerCapturas");
    container.innerHTML = `
        <table id="tabelaCapturas">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo de Peixe</th>
                    <th>Peso (g)</th>
                    <th>Tamanho (cm)</th>
                    <th>Local</th>
                    <th>Tipo de Pesca</th>
                    <th>Maré</th>
                    <th>Lua</th>
                    <th>Período</th>
                    <th>Isco</th>
                    <th>Remover</th>
					<th>Alterar</th>
                </tr>
            </thead>
            <tbody></tbody>
        </table>
    `;
}

function atualizarLocaisOrdenados() {
    let concelhoSelect = document.getElementById("concelho");
    let localSelect = document.getElementById("local");
    let concelhoSelecionado = concelhoSelect.value;

    localSelect.innerHTML = '<option value="">Seleccione um local</option>';

    if (concelhoSelecionado) {
        let concelhoEncontrado = concelhosLocais.find(c => c.concelho === concelhoSelecionado);
        if (concelhoEncontrado) {
            concelhoEncontrado.locais.forEach(local => {
                let option = document.createElement("option");
                option.value = local;
                option.textContent = local;
                localSelect.appendChild(option);
            });
        }
    }
}

function limparFormularioRegistro() {
    document.getElementById('dataCaptura').value = '';
    document.getElementById('peso').value = '';
    document.getElementById('tamanho').value = '';
    document.getElementById('concelho').selectedIndex = 0;
    document.getElementById('local').selectedIndex = 0;
    document.getElementById('tipoIsco').selectedIndex = 0;
}

function gravarCaptura() {
    let data = document.getElementById("dataCaptura").value;
    let peso = parseInt(document.getElementById("peso").value);
    let tamanho = parseInt(document.getElementById("tamanho").value);
    let concelho = document.getElementById("concelho").value;
    let localSelect = document.getElementById("local");
    let local = localSelect.value;
    let tipoIsco = document.getElementById("tipoIsco").value;

    // Novos campos
    let tipoPeixe = document.getElementById("tipoPeixe").value;
    let tipoPesca = document.getElementById("tipoPesca").value;
    let mare = document.getElementById("mare").value;
    let lua = document.getElementById("lua").value;
    let periodoDia = document.getElementById("periodoDia").value;

    if (!data || isNaN(peso) || peso <= 100 || peso > 100000 || isNaN(tamanho) || tamanho <= 10 || tamanho > 300 || !concelho || !local || !tipoIsco || !tipoPeixe || !tipoPesca || !mare || !lua || !periodoDia || new Date(data) > new Date()) {
        exibirMensagem('error', 'Preencha todos os campos correctamente e use data válida!');
        return;
    }

    let capturas = JSON.parse(localStorage.getItem("capturas")) || [];
    capturas.push({ data, peso, tamanho, local, tipoIsco, tipoPeixe, tipoPesca, mare, lua, periodoDia }); // Adicionando os novos campos
    localStorage.setItem("capturas", JSON.stringify(capturas));

    setTimeout(atualizarLocaisOrdenados, 0);
    exibirMensagem('success', 'Registo gravado com sucesso!');
    limparFormularioRegistro();
    preencherAnos();
}

function limparFormularioRegistro() {
    document.getElementById('dataCaptura').value = '';
    document.getElementById('peso').value = '';
    document.getElementById('tamanho').value = '';
    document.getElementById('concelho').selectedIndex = 0;
    document.getElementById('local').selectedIndex = 0;
    document.getElementById('tipoIsco').selectedIndex = 0;
    document.getElementById('tipoPeixe').selectedIndex = 0;
    document.getElementById('tipoPesca').selectedIndex = 0;
    document.getElementById('mare').selectedIndex = 0;
    document.getElementById('lua').selectedIndex = 0;
    document.getElementById('periodoDia').selectedIndex = 0;
}

function consultarCapturas() {
	construirTabelaCapturas();
    let ano = document.getElementById("anoConsulta").value;
    let capturas = JSON.parse(localStorage.getItem("capturas")) || [];
    let filtradas = capturas.filter(c => c.data.startsWith(ano));
    filtradas.sort((a, b) => new Date(a.data) - new Date(b.data));

    let tabela = document.getElementById("tabelaCapturas").querySelector("tbody");
    tabela.innerHTML = "";

    filtradas.forEach(captura => {
        let linha = tabela.insertRow();
        let data = new Date(captura.data);
        let dataFormatada = data.toLocaleDateString("pt-pt");

        linha.insertCell(0).textContent = dataFormatada;
        linha.insertCell(1).textContent = captura.tipoPeixe; // Novo campo
        linha.insertCell(2).textContent = captura.peso.toLocaleString("pt-BR");
        linha.insertCell(3).textContent = captura.tamanho;
        linha.insertCell(4).textContent = captura.local;
        linha.insertCell(5).textContent = captura.tipoPesca; // Novo campo
        linha.insertCell(6).textContent = captura.mare; // Novo campo
        linha.insertCell(7).textContent = captura.lua; // Novo campo
        linha.insertCell(8).textContent = captura.periodoDia; // Novo campo
        linha.insertCell(9).textContent = captura.tipoIsco;

        let btnRemover = document.createElement("button");
        btnRemover.innerHTML = '<i class="fa fa-trash"></i>';
        btnRemover.style.padding = "5px 10px";
        btnRemover.style.fontSize = "16px";
        btnRemover.style.width = "35px";
        btnRemover.style.height = "35px";
        btnRemover.style.border = "none";
        btnRemover.style.backgroundColor = "#ff4d4d";
        btnRemover.style.color = "#ffffff";
        btnRemover.style.borderRadius = "50%";
        btnRemover.style.cursor = "pointer";
        btnRemover.style.display = "block";
        btnRemover.style.margin = "0 auto";
        btnRemover.onclick = () => removerCaptura(captura.data, captura.peso, captura.tamanho, captura.local, captura.tipoIsco, captura.tipoPeixe, captura.tipoPesca, captura.mare, captura.lua, captura.periodoDia); // Atualizar parâmetros
        linha.insertCell(10).appendChild(btnRemover); // A coluna de remover agora está no índice 10
    
	let btnEditar = document.createElement("button");
	btnEditar.innerHTML = '<i class="fas fa-edit"></i>';
	btnEditar.style.padding = "5px 10px";
	btnEditar.style.fontSize = "16px";
	btnEditar.style.width = "35px";
	btnEditar.style.height = "35px";
	btnEditar.style.border = "none";
	btnEditar.style.backgroundColor = "#4CAF50";
	btnEditar.style.color = "#ffffff";
	btnEditar.style.borderRadius = "50%";
	btnEditar.style.cursor = "pointer";
	btnEditar.style.display = "block";
	btnEditar.style.margin = "0 auto";
	btnEditar.onclick = () => editarCaptura(captura); // Passa a captura para edição
	linha.insertCell(11).appendChild(btnEditar); // Nova coluna para o botão Editar
		});
document.getElementById("totaisAno").textContent = `Total de capturas: ${filtradas.length}, Peso total: ${filtradas.reduce((acc, c) => acc + c.peso, 0).toLocaleString("pt-BR")}g`;
}

function removerCaptura(data, peso, tamanho, local, tipoIsco, tipoPeixe, tipoPesca, mare, lua, periodoDia, isEdicao = false) {
    if (isEdicao || confirm("Tem certeza que deseja remover esta captura?")) {
        let capturas = JSON.parse(localStorage.getItem("capturas")) || [];
        let index = capturas.findIndex(c =>
            c.data === data &&
            c.peso === peso &&
            c.tamanho === tamanho &&
            c.local === local &&
            c.tipoIsco === tipoIsco &&
            c.tipoPeixe === tipoPeixe &&
            c.tipoPesca === tipoPesca &&
            c.mare === mare &&
            c.lua === lua &&
            c.periodoDia === periodoDia
        );

        if (index !== -1) {
            capturas.splice(index, 1);
            localStorage.setItem("capturas", JSON.stringify(capturas));
            consultarCapturas();
            exibirMensagem("success", "Captura removida com sucesso!");
        } else {
            exibirMensagem("error", "Erro ao remover a captura.");
        }
    }
}

function editarCaptura(captura) {
    
    document.getElementById("dataCaptura").value = captura.data;
    document.getElementById("peso").value = captura.peso;
    document.getElementById("tamanho").value = captura.tamanho;
    document.getElementById("concelho").value = ""; // força o utilizador a confirmar o concelho
    atualizarLocaisOrdenados(); // actualiza o local após concelho vazio
    document.getElementById("local").value = captura.local;
    document.getElementById("tipoIsco").value = captura.tipoIsco;
    document.getElementById("tipoPeixe").value = captura.tipoPeixe;
    document.getElementById("tipoPesca").value = captura.tipoPesca;
    document.getElementById("mare").value = captura.mare;
    document.getElementById("lua").value = captura.lua;
    document.getElementById("periodoDia").value = captura.periodoDia;

    // Remove a captura antiga do armazenamento
    removerCaptura(
        captura.data,
        captura.peso,
        captura.tamanho,
        captura.local,
        captura.tipoIsco,
        captura.tipoPeixe,
        captura.tipoPesca,
        captura.mare,
        captura.lua,
        captura.periodoDia,
        true // Passar como "edição" para não exibir mensagens
    );

    // Muda para o separador "Registo" para facilitar a edição
    mostrarSecao("registo");
}

function limparTabelaCapturas() {
    const container = document.getElementById("containerCapturas");
    container.innerHTML = ""; // Remove toda a tabela
    document.getElementById("totaisAno").textContent = ""; // Limpa o texto dos totais
}

function limparAnalise() {
    document.getElementById("resumoLocais").innerHTML = ""; // Limpa a tabela de resumo
    const graficoCanvas = document.getElementById("graficoResumoPorLocal");
    const ctx = graficoCanvas.getContext('2d');
    ctx.clearRect(0, 0, graficoCanvas.width, graficoCanvas.height); // Limpa o canvas

       if (window.myChart) {
        window.myChart.destroy();
        window.myChart = null; 
    }
}

function preencherAnos() {
    let capturas = JSON.parse(localStorage.getItem("capturas")) || [];
    let anos = [...new Set(capturas.map(c => new Date(c.data).getFullYear()))].sort((a, b) => b - a);
    let anoSelect = document.getElementById("anoConsulta");
    anoSelect.innerHTML = ""; // Limpa o select antes de preencher

    anos.forEach(ano => {
        let option = document.createElement("option");
        option.value = ano;
        option.textContent = ano;
        anoSelect.appendChild(option);
    });
}

function exibirMensagem(tipo, mensagem) {
    const messageElement = document.getElementById(`message${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`);
    messageElement.textContent = mensagem;
    messageElement.style.display = 'block';
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 3000); // A mensagem desaparece após 3 segundos
}

function mostrarSecao(idSecao) {
  // Esconde todas as secções de conteúdo
  const conteudos = document.querySelectorAll('.tab-content');
  conteudos.forEach(conteudo => {
    conteudo.classList.remove('active');
  });

  // Remove a classe 'active' de todos os botões de aba
  const botoes = document.querySelectorAll('.tabs .tab-button');
  botoes.forEach(botao => {
    botao.classList.remove('active');
  });

  // Mostra a secção selecionada
  const secaoMostrar = document.getElementById(idSecao);
  if (secaoMostrar) {
    secaoMostrar.classList.add('active');
  }

  // Ativa o botão da aba correspondente
  const botaoAtivar = document.querySelector(`.tabs .tab-button[onclick="mostrarSecao('${idSecao}')"]`);
  if (botaoAtivar) {
    botaoAtivar.classList.add('active');
  }
}

window.onload = () => {
  mostrarSecao('registo');
};