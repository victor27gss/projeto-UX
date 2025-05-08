// URL base da API
const API_URL = "http://127.0.0.1:5000"; // Endereço da API local

// Função para carregar alunos e atualizar o dashboard
async function carregarAlunos() {
    const response = await fetch(`${API_URL}/alunos`); // Requisição para obter todos os alunos
    const alunos = await response.json();

    // Atualizar quantidade de alunos por cidade
    const propria = alunos.filter(a => a.cidade === "Própria").length;
    const itabaiana = alunos.filter(a => a.cidade === "Itabaiana").length;
    const gloria = alunos.filter(a => a.cidade === "Nossa Senhora da Glória").length;
    const maruim = alunos.filter(a => a.cidade === "Maruim").length;
    const laranjeiras = alunos.filter(a => a.cidade === "Laranjeiras").length;
    const ribeiropolis = alunos.filter(a => a.cidade === "Ribeirópolis").length;

    // Atualizar os elementos do HTML com as quantidades de alunos
    document.getElementById("alunosPropria").textContent = propria;
    document.getElementById("alunosItabaiana").textContent = itabaiana;
    document.getElementById("alunosGloria").textContent = gloria;
    document.getElementById("alunosMaruim").textContent = maruim;
    document.getElementById("alunosLaranjeiras").textContent = laranjeiras;
    document.getElementById("alunosRibeiropolis").textContent = ribeiropolis;
}

// Função para mostrar alunos de uma cidade específica
async function mostrarAlunos(cidade) {
    const response = await fetch(`${API_URL}/alunos/${cidade}`); // Requisição para obter alunos de uma cidade
    const alunos = await response.json();

    // Atualizar os detalhes dos alunos no HTML
    const detalhesDiv = document.getElementById("detalhesAlunos");
    detalhesDiv.innerHTML = alunos.map(a => `<p>${a.nome} - Horário: ${a.horario}</p>`).join("") || "<p>Nenhum aluno encontrado.</p>";
}

// Função para calcular a média semanal de alunos
async function calcularMedia() {
    const response = await fetch(`${API_URL}/alunos/media`); // Requisição para obter a média semanal
    const { media_semanal } = await response.json();

    // Atualizar o elemento do HTML com a média semanal
    document.getElementById("mediaResultado").textContent = `Média semanal: ${media_semanal} alunos por dia.`;
}

// Função para calcular o trajeto do motorista
async function calcularTrajeto() {
    const response = await fetch(`${API_URL}/alunos`); // Requisição para obter todos os alunos
    const alunos = await response.json();

    // Coordenadas dos locais de saída
    const locaisSaida = [
        { lat: -10.212, lng: -36.840, title: "Própria" },
        { lat: -10.685, lng: -37.427, title: "Itabaiana" },
        { lat: -10.215, lng: -37.421, title: "Nossa Senhora da Glória" },
        { lat: -10.734, lng: -37.123, title: "Maruim" },
        { lat: -10.806, lng: -37.173, title: "Laranjeiras" },
        { lat: -10.535, lng: -37.438, title: "Ribeirópolis" }
    ];

    // Filtrar os locais que possuem alunos
    const cidadesComAlunos = locaisSaida.filter(local =>
        alunos.some(a => a.cidade === local.title)
    );

    // Criar uma lista de coordenadas para o trajeto
    const coordenadas = cidadesComAlunos.map(local => [local.lat, local.lng]);
    coordenadas.push([-10.985, -37.056]); // Adicionar destino final (Universidade)

    // Traçar a rota no mapa
    const polyline = L.polyline(coordenadas, { color: 'blue' }).addTo(map);
    map.fitBounds(polyline.getBounds()); // Ajustar o zoom do mapa para exibir a rota
}

// Inicializar o mapa
const map = L.map('map').setView([-10.947, -37.073], 7); // Configuração inicial do mapa
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

// Carregar dados iniciais
carregarAlunos();
