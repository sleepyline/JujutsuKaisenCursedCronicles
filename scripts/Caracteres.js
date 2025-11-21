// --- CONSTANTES E CHAVES DO LOCALSTORAGE ---
const MODE_KEY = 'jujutsuGameMode';
const PLAYER_KEY = 'jujutsuPlayerId';
const NPC_KEY = 'jujutsuNpcId';

const MAX_HP = 1000;
const MAX_CE = 100;

// --- TAXAS DE REGENERAÇÃO PERSONALIZADAS ---
// (Mantidas inalteradas)
const regenRates = {
    satoru: { ce: 17.0, rev: 9.0 }, 
    sukuna: { ce: 13.8, rev: 9.0 },
    yuta: { ce: 1.5, rev: 0.6 },
    geto: { ce: 1.2, rev: 0.2 },
    mahito: { ce: 1.3, rev: 4.5 },
    choso: { ce: 1.0, rev: 2.5 },
    nanami: { ce: 0.8, rev: 0.1 },
    itadori: { ce: 1.0, rev: 0.3 }, 
    megumi: { ce: 0.9, rev: 0.1 },
    nobara: { ce: 0.6, rev: 0.05 },
    toji: { ce: 0.0, rev: 9.0 }
};


// --- ESTATÍSTICAS E HABILIDADES DOS PERSONAGENS (UNIFICADAS) ---
// IDs dos personagens: gojo -> satoru, yuji -> itadori, megumi -> megumi, etc.
const characters = {
    // ID UNIFICADO: 'satoru'
    satoru: {
        name: "Satoru Gojo",
        subname: 'O Mais Forte', // ADICIONADO de escolha.js
        image: 'https://criticalhits.com.br/wp-content/uploads/2025/03/Gojo.jpg', // ADICIONADO de escolha.js
        hp: MAX_HP * 2.5 , ce: MAX_CE, rev: 0,
        cooldowns: { domain: 0, red: 0, blue: 0, purple: 0, heal: 0 },
        abilities: {
            domain: { name: "Vazio Ilimitado (Domínio)", cost: 80, cd: 30, baseDmg: 1500, type: 'domain_attack', },
            infinity: { name: "Mugen (Infinito)", cost: 15, cd: 10, baseDmg: 0, type: 'utility_buff', effect: 'Anula todos os ataques do oponente no próximo turno.', duration: 1 },
            blue: { name: "Convergência (Azul)", cost: 30, cd: 3, baseDmg: 60, type: 'attack', },
            red: { name: "Divergência (Vermelho)", cost: 30, cd: 4, baseDmg: 90, type: 'attack', },
            purple: { name: "Fusão (Roxo)", cost: 60, cd: 8, baseDmg: 800, type: 'maximum_attack', },
            heal: { name: "Técnica de Reversão", cost: 40, cd: 17, baseHeal: 350, type: 'heal', }
        }
    },
    // ID UNIFICADO: 'sukuna'
    sukuna: {
        name: "Ryomen Sukuna",
        subname: 'Rei das Maldições', // ADICIONADO
        image: 'https://tm.ibxk.com.br/2023/11/14/14093517191519.jpg?ims=1200x1200', // ADICIONADO
        hp: MAX_HP * 4.5, ce: MAX_CE * 6.1, rev: 0,
        cooldowns: { domain: 0, cleave: 0, dismantle: 0, fire: 0, heal: 0 },
        abilities: {
            domain: { name: "Santuário Malevolente (Domínio)", cost: 90, cd: 30, baseDmg: 3000, type: 'domain_attack', effect: 'Cortar infinitamente tudo dentro do alcance' },
            dismantle: { name: "Desmontar (Dismantle)", cost: 20, cd: 1, baseDmg: 50, type: 'attack', },
            cleave: { name: "Fatiar (Cleave)", cost: 35, cd: 3, baseDmg: 100, type: 'attack', },
            fire: { name: "Caixão de Chamas (Fugā)", cost: 70, cd: 15, baseDmg: 250, type: 'maximum_attack', },
            heal: { name: "Técnica de Reversão", cost: 45, cd: 15, baseHeal: 2200, type: 'heal', }
        }
    },
    // ID UNIFICADO: 'itadori' (Antigo 'yuji')
    itadori: {
        name: "Yuji Itadori",
        subname: 'Vaso de Sukuna', // ADICIONADO
        image: 'https://criticalhits.com.br/wp-content/uploads/2021/06/Yuji.jpg', // ADICIONADO
        hp: MAX_HP, ce: MAX_CE, rev: 0,
        cooldowns: { divergent: 0, blackflash: 0, punch: 0 },
        abilities: {
            punch: { name: "Ataque Contundente", cost: 10, cd: 0, baseDmg: 30, type: 'attack' },
            divergent: { name: "Punho Divergente", cost: 25, cd: 2, baseDmg: 120, type: 'attack', effect: 'Dano secundário atrasado após o primeiro golpe.' },
            blackflash: { name: "Clarão Negro", cost: 50, cd: 3, baseDmg: 500, type: 'attack', effect: 'Multiplica o dano em 2.5. Aumenta o domínio de Energia Amaldiçoada por um breve período.' }
        }
    },
    // ID UNIFICADO: 'megumi'
    megumi: {
        name: "Megumi Fushiguro",
        subname: 'Técnica das Dez Sombras', // ADICIONADO
        image: 'https://static.beebom.com/wp-content/uploads/2025/10/jujutsu-kaisen-megumi-fushiguro.jpg?w=1168&quality=75', // ADICIONADO
        hp: MAX_HP, ce: MAX_CE, rev: 0,
        cooldowns: { domain: 0, nue: 0, maxEleph: 0, dogs: 0 },
        abilities: {
            domain: { name: "Jardim das Sombras Chimera", cost: 80, cd: 15, baseDmg: 900, type: 'attack', effect: 'Cria uma camada de sombra, permitindo múltiplos shikigami e teletransporte.' },
            nue: { name: "Nue (Pássaro)", cost: 30, cd: 3, baseDmg: 70, type: 'attack', effect: 'Ataque aéreo ou elétrico.' },
            maxEleph: { name: "Elefante Máximo", cost: 45, cd: 5, baseDmg: 100, type: 'attack', effect: 'Ataque de pressão/água pesada e lenta.' }
        }
    },
    // ID UNIFICADO: 'nobara'
    nobara: {
        name: "Nobara Kugisaki",
        subname: 'Técnica de Boneca de Palha', // ADICIONADO
        image: 'https://criticalhits.com.br/wp-content/uploads/2023/11/nobara1-1-1280x720.jpg', // ADICIONADO
        hp: MAX_HP * 0.8, ce: MAX_CE * 0.7, rev: 0,
        cooldowns: { resonance: 0, hairpins: 0, blackflash: 0 },
        abilities: {
            resonance: { name: "Ressonância", cost: 50, cd: 7, baseDmg: 150, type: 'attack', effect: 'Causa dano na alma do alvo, exigindo uma parte do alvo (ou boneco de palha).' },
            hairpins: { name: "Alfinetes de Cabelo (Kanazashi)", cost: 30, cd: 3, baseDmg: 80, type: 'attack', effect: 'Explosão de vários pregos simultâneos.' },
            blackflash: { name: "Clarão Negro", cost: 50, cd: 5, baseDmg: 150, type: 'attack', effect: 'Multiplica o dano em 2.5 (Condicional).' }
        }
    },
    // ID UNIFICADO: 'yuta'
    yuta: {
        name: "Yuta Okkotsu",
        subname: 'Feiticeiro de Grau Especial', // ADICIONADO
        image: 'https://ovicio.com.br/wp-content/uploads/2023/12/20231229-jujutsu-kaisen-yuta.jpg', // ADICIONADO
        hp: MAX_HP * 1.5, ce: MAX_CE * 2, rev: 0,
        cooldowns: { domain: 0, copy: 0, ring: 0, heal: 0 },
        abilities: {
            domain: { name: "Autêntica Mutação Mútua", cost: 90, cd: 70, baseDmg: 900, type: 'attack', },
            ring: { name: "Conexão Rika", cost: 40, cd: 5, baseDmg: 120, type: 'attack', },
            copy: { name: "Mímica de Técnica", cost: 50, cd: 1, baseDmg: 0, type: 'utility', effect: 'Copia a última técnica vista pelo oponente. (Dano e custo variam)' },
            heal: { name: "Técnica de Reversão", cost: 40, cd: 15, baseHeal: 350, type: 'heal' }
        }
    },
    // ID UNIFICADO: 'geto'
    geto: {
        name: "Suguru Geto",
        subname: 'Mestre das Maldições', // ADICIONADO
        image: 'https://criticalhits.com.br/wp-content/uploads/2023/10/Suguru-Geto-1280x640.jpg', // ADICIONADO
        hp: MAX_HP, ce: MAX_CE * 1.2, rev: 0,
        cooldowns: { max: 0, uzumaki: 0, fly: 0 },
        abilities: {
            uzumaki: { name: "Uzumaki (Vórtice)", cost: 80, cd: 10, baseDmg: 300, type: 'attack', effect: 'Combina maldições capturadas em um ataque maciço e concentrado.' },
            max: { name: "Técnica Máxima: Arco-íris", cost: 40, cd: 5, baseDmg: 120, type: 'attack', effect: 'Invoca uma grande quantidade de maldições para atacar simultaneamente.' },
            fly: { name: "Maldição Voadora", cost: 20, cd: 1, baseDmg: 50, type: 'utility', effect: 'Invoca uma maldição para transporte ou ataque aéreo rápido.' }
        }
    },
    // ID UNIFICADO: 'choso'
    choso: {
        name: "Choso",
        subname: 'Útero Amaldiçoado: Pintura da Morte', // ADICIONADO
        image: 'https://criticalhits.com.br/wp-content/uploads/2023/10/choso_1693393930019_169339394537.jpg', // ADICIONADO
        hp: MAX_HP * 1.2, ce: MAX_CE * 1.2, rev: 0,
        cooldowns: { pierc: 0, supern: 0, slb: 0 },
        abilities: {
            pierc: { name: "Soco Perfurador de Sangue", cost: 30, cd: 3, baseDmg: 90, type: 'attack', effect: 'Projeta sangue em alta velocidade, penetrando quase tudo.' },
            supern: { name: "Convergência Supernova", cost: 50, cd: 7, baseDmg: 150, type: 'attack', effect: 'Pode atirar várias bolas de sangue comprimidas em uma área.' },
            slb: { name: "Manipulação de Sangue", cost: 10, cd: 1, baseDmg: 0, type: 'utility', effect: 'Endurece, explode ou usa o sangue para mobilidade/defesa.' }
        }
    },
    // ID UNIFICADO: 'nanami'
    nanami: {
        name: "Kento Nanami",
        subname: 'Técnica de Proporção', // ADICIONADO
        image: 'https://criticalhits.com.br/wp-content/uploads/2021/06/nanami-jujutsu-1-1200x675-1.jpg', // ADICIONADO
        hp: MAX_HP, ce: MAX_CE, rev: 0,
        cooldowns: { ratio: 0, crit: 0, cleave: 0 },
        abilities: {
            ratio: { name: "Técnica do 7:3", cost: 40, cd: 4, baseDmg: 120, type: 'attack', effect: 'Atinge um ponto fraco (7:3) do alvo para um dano crítico inevitável.' },
            crit: { name: "Ataque Crítico", cost: 20, cd: 2, baseDmg: 60, type: 'attack', effect: 'Ataque com arma contundente que causa sangramento.' },
            cleave: { name: "Corte da Técnica", cost: 50, cd: 5, baseDmg: 150, type: 'attack', effect: 'Ataque máximo com 7:3 ativado.' }
        }
    },
    // ID UNIFICADO: 'toji'
    toji: {
        name: "Toji Fushiguro",
        subname: 'A Ameaça Ninja', // ADICIONADO
        image: 'https://preview.redd.it/toji-fushiguro-the-one-character-unaffected-by-this-ending-v0-u5nwh1b4p5rd1.jpeg?width=640&crop=smart&auto=webp&s=fd078aa4baeb1344a962e9b72e834af9cd0d1287', // ADICIONADO
        hp: MAX_HP * 1.8, ce: 0, rev: 0,
        cooldowns: { inventory: 0, chain: 0, sword: 0 },
        abilities: {
            sword: { name: "Lâmina da Nuvem Invertida", cost: 0, cd: 2, baseDmg: 250, type: 'attack', effect: 'Ignora e nega a técnica do alvo momentaneamente.' },
            chain: { name: "Corrente da Alma", cost: 0, cd: 3, baseDmg: 80, type: 'attack', effect: 'Ataque de longo alcance que ignora barreiras comuns.' },
            inventory: { name: "Invocação de Maldição", cost: 0, cd: 5, baseDmg: 0, type: 'utility', effect: 'Recupera arma amaldiçoada (Ex: Lança da Nuvem Invertida).' }
        }
    },
    // ID UNIFICADO: 'mahito'
    mahito: {
        name: "Mahito",
        subname: 'Transfiguração Ociosa', // ADICIONADO
        image: 'https://criticalhits.com.br/wp-content/uploads/2024/01/mahito-episode-42-1280x640.webp', // ADICIONADO
        hp: MAX_HP * 1.5, ce: MAX_CE * 1.5, rev: 0,
        cooldowns: { domain: 0, idle: 0, multi: 0, transfig: 0 },
        abilities: {
            domain: { name: "Realização da Auto-Perfeição", cost: 85, cd: 5, baseDmg: 0, type: 'utility', effect: 'Permite Manipulação da Alma de toque zero e inevitável.' },
            idle: { name: "Transfiguração Ociosa", cost: 50, cd: 5, baseDmg: 150, type: 'attack', effect: 'Causa dano direto à forma da alma, ignorando a defesa física.' },
            multi: { name: "Corpo Mutável de Múltiplas Caudas", cost: 60, cd: 8, baseDmg: 200, type: 'attack', effect: 'Forma transformada poderosa com alto poder de ataque e defesa.' },
            transfig: { name: "Transfiguração (Cura)", cost: 30, cd: 1, baseHeal: 250, type: 'heal', effect: 'Reestrutura sua própria alma para se curar.' }
        }
    }
};
