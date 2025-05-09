const fs = require('fs');
const path = require('path');

// Função para gerar um valor randomico único
function generateRandomId() {
    return `id-${Math.random().toString(36).substr(2, 9)}`;
}

// Função para alterar o campo "id" no arquivo JSON
function updateQuestionIds(filePath) {
    try {
        // Lê o arquivo JSON
        const data = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(data);

        // Atualiza o campo "id" de cada pergunta
        json.questions.forEach(question => {
            question.id = generateRandomId();
        });

        // Salva o arquivo atualizado
        fs.writeFileSync(filePath, JSON.stringify(json, null, 2), 'utf8');
        console.log(`Arquivo atualizado com IDs randomicos: ${filePath}`);
    } catch (error) {
        console.error('Erro ao processar o arquivo:', error.message);
    }
}

// Caminho do arquivo JSON
const filePath = path.join(__dirname, 'json', 'simulado-10.json');

// Executa a função
updateQuestionIds(filePath);