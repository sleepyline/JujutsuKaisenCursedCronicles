// VARIÁVEIS DE JOGO (SÓ SERÃO PREENCHIDAS NO JOGO.HTML)
// ------------------------------------------------------------------------
let player = null;
let npc = null;
let gameInterval = null;
let playerInfinityDuration = 0; // Duração do Mugen se o Player for Gojo
let npcInfinityDuration = 0;    // Duração do Mugen se o NPC for 


// =========================================================================
// FUNÇÕES GLOBAIS DE UTILIDADE
// =========================================================================
function triggerAlert(text) {
    const alertDiv = document.getElementById('alert-message');
    if (!alertDiv) return;

    alertDiv.textContent = text;
    alertDiv.style.opacity = 1;
    alertDiv.style.transform = 'translate(-50%, -50%) scale(1.1)';

    setTimeout(() => {
        alertDiv.style.opacity = 0;
        alertDiv.style.transform = 'translate(-50%, -50%) scale(1)';
    }, 1200);
}

function logMessage(message) {
    const messagesUl = document.getElementById('messages');
    if (!messagesUl) return;

    const MAX_MESSAGES = 30;

    const li = document.createElement('li');
    let displayMessage = `[${new Date().toLocaleTimeString()}] ${message}`;

    let finalMessage = displayMessage.replace(/\*\*(.*?)\*\*/g, '<span class="highlight">$1</span>');

    if (message.includes('ACERTO CRÍTICO')) {
        li.classList.add('critical');
        triggerAlert("CRÍTICO!");
    }

    if (message.includes('FIM DE JOGO')) {
        li.classList.add('game-over');
        if (message.includes('VENCEU')) {
            triggerAlert("VITÓRIA!");
        } else {
            triggerAlert("DERROTA!");
        }
    }

    li.innerHTML = finalMessage;
    messagesUl.prepend(li);

    while (messagesUl.children.length > MAX_MESSAGES) {
        messagesUl.removeChild(messagesUl.lastChild);
    }
}


// =========================================================================
// LÓGICA DE SELEÇÃO DE PERSONAGENS E MODO (RODA EM `selecao.html`)
// =========================================================================


if (document.getElementById('character-grid')) {
    // Carrega seleções prévias do localStorage ou usa null
    let selectedGameMode = localStorage.getItem(MODE_KEY) || null;
    let playerSelectionKey = localStorage.getItem(PLAYER_KEY) || null;
    let npcSelectionKey = localStorage.getItem(NPC_KEY) || null;

    document.addEventListener('DOMContentLoaded', () => {
        // Lógica de Redirecionamento Inicial
        const urlParams = new URLSearchParams(window.location.search);
        const modeFromUrl = urlParams.get('mode');

        if (modeFromUrl) {
            // Se o modo veio da URL (de inicio.html), armazena
            selectedGameMode = modeFromUrl;
            localStorage.setItem(MODE_KEY, modeFromUrl);
        } else {
            // Se não tiver modo, deve voltar para o inicio.html
            // Este trecho pressupõe que 'inicio.html' tem a lógica para enviar o 'mode' para 'selecao.html'
            // Se o fluxo é: inicio.html -> selecao.html (com ?mode=X), essa verificação é útil.
            if (!selectedGameMode) {
                // console.log('Modo não encontrado. Redirecionando para inicio.html');
                // window.location.href = 'inicio.html';
                // return;
                // ** Se a tela de seleção não tiver o modal de modo, descomente o bloco acima. **
                // Por enquanto, só gera a grade e continua, presumindo que o modo foi definido em algum momento.
            }
        }

        // Exibe a tela de seleção
        document.getElementById('selection-container').style.display = 'flex';
        generateCharacterSelectionGrid();
        updateSelectionDisplay();
        updateConfirmButton();
        updateCharPreview('player', playerSelectionKey);
        updateCharPreview('npc', npcSelectionKey);
    });

    // Função para gerar a grade de seleção (Ícones)


    // NOVO: Atualiza a pré-visualização grande (substitui updateCharacterArea de escolha.js)
    function updateCharPreview(type, key) {
        const nameElement = document.getElementById(`${type}-char-name`);
        const subNameElement = document.getElementById(`${type}-char-subname`);
        const imageElement = document.getElementById(`${type}-char-image`);

        if (key && characters[key]) {
            const data = characters[key];
            nameElement.textContent = data.name;
            subNameElement.textContent = data.subname;
            imageElement.style.backgroundImage = `url(${data.image})`;
            imageElement.classList.add('selected');
        } else {
            nameElement.textContent = (type === 'player') ? 'Escolha o Personagem' : 'Escolha o Oponente';
            subNameElement.textContent = '';
            imageElement.style.backgroundImage = 'none';
            imageElement.classList.remove('selected');
        }
    }


    // Função para tratar o clique no ícone (Lógica de handleCharacterSelection de script.js e selectCharacter de escolha.js)
    function handleCharacterSelection(key) {
        const selectedChar = characters[key];

        // Se o jogador ainda não foi selecionado, ou se clicou nele para deselecionar
        if (!playerSelectionKey || key === playerSelectionKey) {
            if (key === playerSelectionKey) {
                playerSelectionKey = null; // Desfaz a seleção do jogador
            } else if (key === npcSelectionKey) {
                // Se tentar selecionar o NPC como jogador
                alert(`Oponente ${selectedChar.name} já selecionado!`);
                return;
            } else {
                playerSelectionKey = key; // Seleciona o novo jogador
                if (npcSelectionKey === key) npcSelectionKey = null; // Limpa o NPC se for o mesmo
            }
        }
        // Se o jogador JÁ foi selecionado (foco é no NPC)
        else if (!npcSelectionKey || key === npcSelectionKey) {
            if (key === npcSelectionKey) {
                npcSelectionKey = null; // Desfaz a seleção do NPC
            } else if (key === playerSelectionKey) {
                alert(`Você já selecionou ${selectedChar.name} como Jogador!`);
                return;
            } else {
                npcSelectionKey = key; // Seleciona o novo NPC
            }
        }
        // Caso em que ambos estão selecionados e clica em um terceiro, deseleciona o NPC e seleciona o novo
        else {
            npcSelectionKey = key;
        }

        // Atualiza localStorage e display
        localStorage.setItem(PLAYER_KEY, playerSelectionKey || '');
        localStorage.setItem(NPC_KEY, npcSelectionKey || '');

        updateSelectionState();
        updateSelectionDisplay(); // Atualiza os nomes no meio
        updateConfirmButton();
        updateCharPreview('player', playerSelectionKey);
        updateCharPreview('npc', npcSelectionKey);
    }

    // Função para atualizar classes CSS nos ícones
    function updateSelectionState() {
        const charDivs = document.querySelectorAll('.char-icon');
        const selectorText = document.getElementById('current-selector-text');
        const grid = document.getElementById('character-grid');

        if (playerSelectionKey && npcSelectionKey) {
            selectorText.textContent = 'Seleção Completa';
            grid.classList.remove('player-selection-mode', 'npc-selection-mode');
        } else if (playerSelectionKey) {
            selectorText.textContent = 'Escolha o Oponente';
            grid.classList.remove('player-selection-mode');
            grid.classList.add('npc-selection-mode'); // Adiciona para possível efeito visual
        } else {
            selectorText.textContent = 'Escolha o Personagem';
            grid.classList.add('player-selection-mode');
            grid.classList.remove('npc-selection-mode');
        }

        charDivs.forEach(div => {
            const key = div.getAttribute('data-char-key');
            div.classList.remove('selected-player', 'selected-npc', 'disabled');

            // Adiciona a classe que mostra a seleção
            if (key === playerSelectionKey) {
                div.classList.add('selected-player');
                // Desabilita o ícone do jogador se estiver no modo de seleção de NPC
                if (playerSelectionKey && !npcSelectionKey) {
                    div.classList.add('disabled');
                }
            } else if (key === npcSelectionKey) {
                div.classList.add('selected-npc');
            }

            // Se o Jogador foi selecionado, desabilita a opção de clicar nele novamente 
            // no modo de seleção de NPC, a menos que o NPC já esteja selecionado.
            if (playerSelectionKey && !npcSelectionKey && key === playerSelectionKey) {
                div.classList.add('disabled');
            }
        });
    }

    // Função Limpar Seleção (goBack de escolha.js e clearSelection de script.js)
    window.clearSelection = function () {
        if (playerSelectionKey && npcSelectionKey) {
            // Se ambos estão, desfaz o NPC primeiro
            npcSelectionKey = null;
            localStorage.removeItem(NPC_KEY);
        } else if (playerSelectionKey) {
            // Se só tem o jogador, desfaz o jogador
            playerSelectionKey = null;
            localStorage.removeItem(PLAYER_KEY);
        } else if (npcSelectionKey) {
            // Se só tem o NPC (caso improvável pelo fluxo, mas seguro), desfaz o NPC
            npcSelectionKey = null;
            localStorage.removeItem(NPC_KEY);
        } else {
            // Se nada foi selecionado, volta para o início (se houver)
            // window.location.href = 'inicio.html';
            return;
        }

        updateSelectionState();
        updateSelectionDisplay();
        updateConfirmButton();
        updateCharPreview('player', playerSelectionKey);
        updateCharPreview('npc', npcSelectionKey);
    }

    // Altera o nome da função para 'goBack' para ser coerente com o HTML (Voltar)
    window.goBack = window.clearSelection; // Mapeia 'Voltar' para a lógica de 'clearSelection'

    // Atualiza os nomes exibidos no painel central de seleção
    function updateSelectionDisplay() {
        // Usa as chaves player-choice-name e npc-choice-name do script.js
        const playerDisplay = document.getElementById('player-choice-name');
        const npcDisplay = document.getElementById('npc-choice-name');

        // Esta parte foi descontinuada, pois a função updateCharPreview faz o trabalho
        // ... (Mantendo apenas o confirmButton e updateSelectionState atualizados) ...
    }

    // Função de Confirmação
    window.confirmSelection = function () {
        if (playerSelectionKey && npcSelectionKey) {
            // Redireciona para o arquivo de jogo.
            window.location.href = 'game.html';
        } else {
            triggerAlert("Por favor, selecione seu personagem e seu oponente.");
        }
    }

    function updateConfirmButton() {
        const button = document.getElementById('confirm-button');
        if (!button) return;

        if (playerSelectionKey && npcSelectionKey) {
            button.disabled = false;
            button.textContent = `Confirmar`;
        } else {
            button.disabled = true;
            button.textContent = "Selecione jogador e oponente";
        }
    }
}


// =========================================================================
// LÓGICA DE COMBATE (RODA EM `jogo.html`)
// =========================================================================

// Esta lógica roda se o script for carregado em `jogo.html`
if (document.getElementById('game-container')) {

    document.addEventListener('DOMContentLoaded', () => {
        const playerId = localStorage.getItem(PLAYER_KEY);
        const npcId = localStorage.getItem(NPC_KEY);
        const gameMode = localStorage.getItem(MODE_KEY);

        if (!playerId || !npcId) {
            alert("Dados de seleção incompletos. Retornando à tela de seleção.");
            window.location.href = 'selecao.html';
            return;
        }

        player = JSON.parse(JSON.stringify(characters[playerId]));
        npc = JSON.parse(JSON.stringify(characters[npcId]));
        npc.name = `${characters[npcId].name} (NPC)`;

        player.max_hp = player.hp;
        player.max_ce = player.ce;
        player.max_rev = player.ce;

        npc.max_hp = npc.hp;
        npc.max_ce = npc.ce;
        npc.max_rev = npc.ce;

        createAbilityButtons();
        updateStatusDisplay();
        logMessage(`**COMBATE INICIADO!** Você (${player.name}) enfrentará ${npc.name}. Modo: ${gameMode.toUpperCase()}.`);
        logMessage(`A cada 1 segundo, Energia Amaldiçoada (CE) e Energia Reversa (REV) recarregam e os Cooldowns (CD) diminuem.`);

        if (gameInterval) clearInterval(gameInterval);
        gameInterval = setInterval(regenAndCooldowns, 1000);
    });

    // ------------------------------------------
    // Funções do Jogo
    // ------------------------------------------

    function updateStatusDisplay() {
        // Assume-se que MAX_HP e MAX_CE (ou MAX_REV) são constantes globais

        const updateCharStatus = (char, isPlayer) => {
            if (!char) return;

            const prefix = isPlayer ? 'player' : 'npc';

            // --- Lógica para o Ícone do Personagem ---
            let charName = char.name;

            // Se for NPC, remove o sufixo " (NPC)" para encontrar a chave
            if (!isPlayer && charName.endsWith(' (NPC)')) {
                // Remove o " (NPC)" para a busca da chave
                charName = charName.replace(' (NPC)', '');
            }

            // A função getCharacterKeyByName continua sendo chamada para pegar a chave ('satoru', 'sukuna', etc.)
            const charKey = getCharacterKeyByName(charName);
            const iconElement = document.getElementById(`${prefix}-icon-small`);

            // Verifica se a chave e o elemento existem, e se o personagem está no objeto 'characters'
            if (charKey && iconElement && characters[charKey]) {
                // CORREÇÃO: Usa o objeto 'characters' (definido em script.js) para buscar a imagem
                iconElement.style.backgroundImage = `url(${characters[charKey].image})`;
            }
            // FIM Lógica para Icone do Personagem

            document.getElementById(`${prefix}-name`).textContent = char.name;
            document.getElementById(`${prefix}-hp`).textContent = char.hp.toFixed(0);
            document.getElementById(`${prefix}-ce`).textContent = char.ce.toFixed(1);
            document.getElementById(`${prefix}-rev`).textContent = char.rev.toFixed(1);

            const maxHp = char.max_hp > 0 ? char.max_hp : MAX_HP;
            const maxCe = char.max_ce > 0 ? char.max_ce : MAX_CE;
            const maxRev = char.max_rev > 0 ? char.max_rev : MAX_CE;

            document.getElementById(`${prefix}-hp-bar`).style.width = `${(char.hp / maxHp) * 100}%`;
            document.getElementById(`${prefix}-ce-bar`).style.width = `${(char.ce / maxCe) * 100}%`;
            document.getElementById(`${prefix}-rev-bar`).style.width = `${(char.rev / maxRev) * 100}%`;
        };

        if (player) updateCharStatus(player, true);
        if (npc) updateCharStatus(npc, false);


        if (player) {
            const abilityButtons = document.querySelectorAll('#player-abilities button');
            abilityButtons.forEach(button => {
                const key = button.getAttribute('data-ability');
                const ability = player.abilities[key];
                const isToji = player.name.includes('Toji Fushiguro');

                const cdRemaining = player.cooldowns[key] || 0;

                const isHealAbility = ability.type === 'heal';
                let cost = ability.cost;
                let resource = isHealAbility ? player.rev : player.ce;
                let resourceUnit = isHealAbility ? 'REV' : 'CE';

                if (isToji) {
                    cost = 0;
                    resource = 1;
                    resourceUnit = 'CD';
                }

                // Variável para a tooltip (título) do botão
                let buttonTitle = '';

                if (resource < cost) {
                    button.disabled = true;
                    buttonTitle = `Custo Insuficiente. Requer ${cost.toFixed(1)} ${resourceUnit}.`;
                } else if (cdRemaining > 0) {
                    button.disabled = true;
                    buttonTitle = `Em Cooldown. Pronto em ${cdRemaining.toFixed(0)}s.`;
                } else {
                    button.disabled = false;
                    buttonTitle = `${ability.name} - Custo: ${cost.toFixed(1)} ${resourceUnit}`;
                }

                // MANTÉM A ESTRUTURA HTML e só atualiza o atributo title para o tooltip
                button.setAttribute('title', buttonTitle);

                // Opcional: Atualiza o texto do custo no span interno se o CD for maior que 0
                const costSpan = button.querySelector('.ability-cost');
                if (costSpan) {
                    if (cdRemaining > 0) {
                        costSpan.textContent = `CD: ${cdRemaining.toFixed(0)}s`;
                        costSpan.style.color = '#FF6347'; // Cor de CD
                    } else {
                        costSpan.textContent = `${cost.toFixed(1)} ${resourceUnit}`;
                        costSpan.style.color = '#ffcc00'; // Cor padrão de custo
                    }
                }
            });
        }
    }

    function createAbilityButtons() {
        const container = document.getElementById('player-abilities');
        if (!container) return;
        container.innerHTML = '';

        const buttons = [];
        for (const key in player.abilities) {
            const ability = player.abilities[key];
            const button = document.createElement('button');
            button.setAttribute('data-ability', key);
            button.onclick = () => playerTurn(key);

            let resourceUnit = ability.type === 'heal' ? 'REV' : 'CE';
            let displayCost = player.name.includes('Toji Fushiguro') ? 0 : ability.cost;
            let displayDuration = (key === 'infinity') ? ' (3T)' : '';


            button.innerHTML = `
                ${ability.name}${displayDuration} 
                <span class="ability-cost">${displayCost.toFixed(1)} ${resourceUnit}</span>
            `;

            if (ability.type.startsWith('domain')) {
                button.classList.add('domain-ability');
            } else if (ability.type.startsWith('maximum')) {
                button.classList.add('maximum-ability');
            } else if (ability.type.startsWith('utility_buff')) {
                button.classList.add('utility-ability');
            }

            buttons.push(button);
        }

        // Adiciona os botões ao container
        buttons.forEach(button => container.appendChild(button));
    }

    function calculateDamage(baseDmg, defender) {
        const roll = Math.random();
        let multiplier = 1;
        let message = "";

        let defenseModifier = defender.name.includes('Satoru Gojo') ? 0.8 : 1;

        if (roll < 0.1) {
            multiplier = 0;
            message = "ERROU! O ataque passou longe.";
        } else if (roll < 0.3) {
            multiplier = 0.5 * defenseModifier;
            message = "Acerto Parcial! O inimigo se defendeu com sucesso.";
        } else if (roll < 0.8) {
            multiplier = 1 * defenseModifier;
            message = "ACERTO! Dano normal infligido.";
        } else {
            multiplier = 1.5 * defenseModifier;
            message = "**ACERTO CRÍTICO!** Dano máximo!";
        }

        const finalDmg = baseDmg * multiplier;
        return { finalDmg, message };
    }

    function processTurn(attackerKey, abilityKey, defenderKey) {
        const attacker = (attackerKey === 'player') ? player : npc;
        const defender = (defenderKey === 'player') ? player : npc;
        const ability = attacker.abilities[abilityKey];

        let isHeal = ability.type === 'heal' || abilityKey === 'transfig'; // 'transfig' é a cura de Mahito
        let isUtility = ability.type.includes('utility');

        // Define o recurso e custo
        let resourceToUse = isHeal ? attacker.rev : attacker.ce;
        let resourceCost = ability.cost;
        let costSource = isHeal ? 'rev' : 'ce';

        if (attacker.name.includes('Toji Fushiguro')) {
            resourceToUse = 1;
            resourceCost = 0;
            costSource = 'ce';
        }

        // 1. CHECAGEM DE CUSTO E COOLDOWN
        if (attackerKey === 'player' && attacker.cooldowns[abilityKey] > 0 || resourceToUse < resourceCost) {
            return false;
        }

        // 2. DEDUÇÃO DE CUSTO E CD (antes da execução)
        if (costSource === 'rev') {
            attacker.rev = Math.max(0, attacker.rev - resourceCost);
        } else if (!attacker.name.includes('Toji Fushiguro')) {
            attacker.ce = Math.max(0, attacker.ce - resourceCost);
        }
        attacker.cooldowns[abilityKey] = ability.cd;

        let outcomeMessage = `${attacker.name} usa **${ability.name}** contra ${defender.name}.`;

        // =================================================================
        // 3. LÓGICA DE ATIVAÇÃO DE BUFF (MUGEN - DURAÇÃO)
        // =================================================================
        if (abilityKey === 'infinity' && attacker.name.includes('Satoru Gojo')) {
            if (attackerKey === 'player') {
                playerInfinityDuration = 3;
            } else {
                npcInfinityDuration = 3;
            }
            outcomeMessage += `\n**Mugen** ativado! ${attacker.name} está **Intocável** pelos próximos 3 ataques!`;
            logMessage(outcomeMessage);
            return true; // Turno consumido pela ativação do buff
        }

        // =================================================================
        // 4. LÓGICA DE DEFESA DO MUGEN
        // =================================================================
        let defenderDuration = 0;
        if (defender.name.includes('Satoru Gojo')) {
            defenderDuration = (defenderKey === 'player') ? playerInfinityDuration : npcInfinityDuration;
        }

        // Verifica se o Mugen está ativo no defensor e se a habilidade atacante não é de utilidade
        if (defender.name.includes('Satoru Gojo') && defenderDuration > 0 && !isUtility) {

            // Mugen é superado apenas por Domínios ou técnicas que manipulam o espaço/alma
            if (ability.type.startsWith('domain') || abilityKey === 'idle') {
                logMessage(`O ataque de ${attacker.name} **PENETROU** o Mugen de Gojo!`);
                // CANCELA Mugen imediatamente
                if (defenderKey === 'player') {
                    playerInfinityDuration = 0;
                } else {
                    npcInfinityDuration = 0;
                }
            } else {
                logMessage(`${attacker.name} ataca, mas o **MUGEN (Infinito)** de Gojo o impede de alcançá-lo!`);
                // Reduz a duração, pois o ataque foi bloqueado (se usar duração de ataque, não turnos)
                // Usaremos a redução por turno na regenAndCooldowns. Aqui, apenas o Domínio/Idle cancela.
                updateStatusDisplay();
                return true; // Turno consumido, ataque bloqueado
            }
        }

        // 5. LÓGICA DE DANO/HEAL
        if (isHeal) {
            const recoveredHP = ability.baseHeal;
            attacker.hp = Math.min(attacker.max_hp, attacker.hp + recoveredHP);
            outcomeMessage += `\nCom sucesso, curando **${recoveredHP.toFixed(0)}** de vida.`;
        } else if (ability.baseDmg > 0) { // Ataque de dano
            const { finalDmg, message } = calculateDamage(ability.baseDmg, defender);
            defender.hp = Math.max(0, defender.hp - finalDmg);
            outcomeMessage += `\n${message} Infligindo **${finalDmg.toFixed(0)}** de dano.`;
        } else if (isUtility) { // Outras utilidades sem dano
            outcomeMessage += `\nUsando utilidade: ${ability.effect}`;
        }


        logMessage(outcomeMessage);
        return true;
    }

    window.playerTurn = function (abilityKey) {
        if (player.hp <= 0 || npc.hp <= 0) return;

        if (processTurn('player', abilityKey, 'npc')) {
            updateStatusDisplay();

            if (npc.hp <= 0) {
                gameOver(true);
                return;
            }

            setTimeout(npcTurn, 1500);
        } else {
            logMessage(`${player.name} falhou ao tentar usar ${player.abilities[abilityKey].name}.`);
            updateStatusDisplay();
        }
    }

    function npcTurn() {
        if (player.hp <= 0 || npc.hp <= 0) return;

        let abilityKeyToUse = null;
        const isGojo = npc.name.includes('Satoru Gojo');
        const isToji = npc.name.includes('Toji Fushiguro');

        // --- SETUP: Habilidades de Cura e Mugen ---
        const healKeys = ['heal', 'transfig'];
        const healKey = healKeys.find(key => npc.abilities.hasOwnProperty(key));
        const healAbility = healKey ? npc.abilities[healKey] : null;

        // Setup para Mugen
        let isInfinityReady = false;
        const infinityKey = 'infinity';
        const infinityAbility = isGojo ? npc.abilities[infinityKey] : null;

        if (isGojo && infinityAbility) {
            isInfinityReady = npc.cooldowns[infinityKey] === 0 && npc.ce >= infinityAbility.cost;
        }


        // --- 1. PRIORIDADE: CURA DE EMERGÊNCIA (HP Baixo < 40%) ---
        const isLowHp = npc.hp < npc.max_hp * 0.4;

        if (healAbility && npc.cooldowns[healKey] === 0) {
            const cost = healAbility.cost || 0;
            // Verifica se é acessível (REV OU CE)
            const isHealAffordable = (npc.rev && npc.rev >= cost) || (npc.ce && npc.ce >= cost);

            if (isLowHp && isHealAffordable) {
                abilityKeyToUse = healKey;
            }
        }

        // --- 2. PRIORIDADE: ATIVAÇÃO CRÍTICA DO MUGEN (GOJO) ---
        // Ativa apenas se for crítico (duração zero ou prestes a expirar)
        if (!abilityKeyToUse && isGojo && isInfinityReady) {
            const npcInfinityDuration = window.npcInfinityDuration || 0;

            // Condições CRÍTICAS: Reativação padrão (0) ou renovação defensiva antecipada (1 e não HP cheio)
            const isCriticalRefresh = npcInfinityDuration === 0 || (npcInfinityDuration <= 1 && npc.hp < npc.max_hp);

            if (isCriticalRefresh) {
                abilityKeyToUse = infinityKey;
                logMessage(`${npc.name} ativa ou atualiza o **Mugen** (Infinity) em um momento crítico.`);
            }
        }

        // --- 3. PRIORIDADE: ATAQUE MAIS FORTE (ou Domínio) ---
        if (!abilityKeyToUse) {
            let maxDmg = -1;

            for (const key in npc.abilities) {
                const ability = npc.abilities[key];

                // Ignora Cura, e Mugen neste loop de ataque
                if (healKeys.includes(key) || key === infinityKey) continue;

                const isAttackOrDomain = ability.type === 'attack' || ability.type.startsWith('domain');

                if (isAttackOrDomain &&
                    ability.baseDmg > maxDmg &&
                    npc.cooldowns[key] === 0) {

                    const isAffordable = isToji || npc.ce >= ability.cost;

                    if (isAffordable) {
                        maxDmg = ability.baseDmg;
                        abilityKeyToUse = key;
                    }
                }
            }
        }

        // --- 4. SELEÇÃO ALEATÓRIA (VERSATILIDADE: Mugen incluído) ---
        // Se o NPC não usou cura, Mugen crítico ou o ataque mais forte, ele escolhe aleatoriamente.
        if (!abilityKeyToUse) {
            const availableAbilities = [];

            for (const key in npc.abilities) {
                const ability = npc.abilities[key];

                // Ignora Cura (prioridade 1)
                if (healKeys.includes(key)) continue;

                // TRATAMENTO DO MUGEN PARA VERSATILIDADE:
                // Se for Mugen (e Gojo), e ele não foi escolhido no Passo 2 (não era crítico), mas está pronto, adiciona ao pool aleatório.
                if (key === infinityKey && isGojo) {
                    if (isInfinityReady) {
                        availableAbilities.push(key);
                    }
                    continue; // Passa para o próximo
                }

                // Checa prontidão e custo para todas as outras técnicas (incluindo buffs/debuffs)
                const isReady = npc.cooldowns[key] === 0;
                const isAffordable = isToji || npc.ce >= ability.cost;

                if (isReady && isAffordable) {
                    availableAbilities.push(key);
                }
            }

            // Seleciona uma habilidade aleatoriamente do pool disponível (Mugen ou qualquer outra técnica)
            if (availableAbilities.length > 0) {
                const randomIndex = Math.floor(Math.random() * availableAbilities.length);
                abilityKeyToUse = availableAbilities[randomIndex];
            }
        }

        // --- 5. EXECUÇÃO OU CONCENTRAÇÃO (Fallback) ---
        if (abilityKeyToUse) {
            processTurn('npc', abilityKeyToUse, 'player');
        } else {
            logMessage(`${npc.name} está concentrando sua energia amaldiçoada...`);
        }

        updateStatusDisplay();

        if (player.hp <= 0) {
            gameOver(false);
        }
    }

    function getCharacterKeyByName(name) {
        for (const key in characters) {
            // Verifica o nome exato OU o nome + " (NPC)"
            if (characters[key].name === name || `${characters[key].name} (NPC)` === name) {
                return key;
            }
        }
        return null;
    }

    function regenAndCooldowns() {
        const playerIdKey = getCharacterKeyByName(player.name);
        const npcIdKey = getCharacterKeyByName(npc.name);

        // Player
        const playerRates = regenRates[playerIdKey] || { ce: 1.0, rev: 0.3 };
        player.ce = Math.min(player.max_ce, player.ce + playerRates.ce);
        player.rev = Math.min(player.max_rev, player.rev + playerRates.rev);
        for (const key in player.cooldowns) {
            player.cooldowns[key] = Math.max(0, player.cooldowns[key] - 1);
        }

        // NPC
        const npcRates = regenRates[npcIdKey] || { ce: 1.0, rev: 0.3 };
        npc.ce = Math.min(npc.max_ce, npc.ce + npcRates.ce);
        npc.rev = Math.min(npc.max_rev, npc.rev + npcRates.rev);
        for (const key in npc.cooldowns) {
            npc.cooldowns[key] = Math.max(0, npc.cooldowns[key] - 1);
        }

        // =================================================================
        // Desativação e Contagem do Mugen (Para Player e NPC)
        // O Mugen é reduzido a cada segundo (turno)
        // =================================================================

        // Player Mugen
        if (player.name.includes('Satoru Gojo') && playerInfinityDuration > 0) {
            playerInfinityDuration = Math.max(0, playerInfinityDuration - 1);
            if (playerInfinityDuration === 0) {
                logMessage(`Mugen (Player) foi desativado.`);
            }
        }

        // NPC Mugen
        if (npc.name.includes('Satoru Gojo') && npcInfinityDuration > 0) {
            npcInfinityDuration = Math.max(0, npcInfinityDuration - 1);
            if (npcInfinityDuration === 0) {
                logMessage(`Mugen (NPC) foi desativado.`);
            }
        }
        // =================================================================

        updateStatusDisplay();
    }

    function gameOver(playerWon) {
        clearInterval(gameInterval);
        const message = playerWon ? "🎉 VOCÊ VENCEU! O INIMIGO FOI DERROTADO! 🎉" : "💀 VOCÊ PERDEU! Tente novamente. 💀";
        logMessage(`--- FIM DE JOGO --- ${message}`);

        document.querySelectorAll('#player-abilities button').forEach(button => {
            button.disabled = true;
        });
    }
}