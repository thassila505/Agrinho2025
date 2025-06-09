// Variáveis globais do jogo
let jardineiro; // O jogador principal
let plantas = []; // Array para armazenar todas as árvores (maçãs) plantadas
let morangos = []; // Array para armazenar todas as plantas de morango plantadas
let temperatura = 10; // Temperatura ambiente, afeta o crescimento
let totalArvores = 0; // Contagem total de árvores/plantas no jogo (para fundo)
let frutosColhidosJardineiro = 0; // Frutos (maçãs) colhidos pelo jogador
let lucroJardineiro = 0; // Lucro do jogador

let concorrente; // O jardineiro concorrente (agora focado apenas em morangos)
let frutosColhidosMorangosConcorrente = 0; // Morangos colhidos pelo concorrente
let lucroConcorrenteMorangosColhidos = 0; // Lucro do concorrente com morangos colhidos

let ajudante; // O novo ajudante (focado em colher e vender para o jardineiro)
let frutosColhidosAjudanteMorangos = 0; // Morangos colhidos pelo ajudante
let lucroAjudanteMorangos = 0; // Lucro do ajudante com morangos (adicionado ao lucro do jogador)
let frutosColhidosAjudanteFrutas = 0; // Maçãs colhidas pelo ajudante
let lucroAjudanteFrutas = 0; // Lucro do ajudante com maçãs (adicionado ao lucro do jogador)


// Configuração inicial do canvas e dos objetos do jogo
function setup() {
  createCanvas(800, 400); // Cria um canvas de 800x400 pixels
  jardineiro = new Jardineiro(width / 2, 50); // Cria o jardineiro principal no centro superior
  concorrente = new Concorrente(100, height - 60); // Cria o concorrente no canto inferior esquerdo
  ajudante = new Ajudante(width - 100, height - 60); // Cria o ajudante no canto inferior direito
}

// Loop principal do jogo, executado continuamente
function draw() {
  // Define a cor de fundo, que muda de acordo com o número de árvores/plantas
  let corFundo = lerpColor(color(217, 112, 26), color(219, 239, 208), map(totalArvores, 0, 100, 0, 1));
  background(corFundo); // Aplica a cor de fundo

  mostraInformacoes(); // Exibe as informações do jogo na tela

  temperatura += 0.01; // Aumenta a temperatura gradualmente
  jardineiro.atualizar(); // Atualiza a posição do jardineiro
  jardineiro.mostrar(); // Desenha o jardineiro na tela

  // Atualiza e mostra cada árvore plantada
  plantas.forEach(arvore => {
    arvore.atualizar();
    arvore.mostrar();
  });

  // Atualiza e mostra cada planta de morango plantada
  morangos.forEach(morango => {
    morango.atualizar();
    morango.mostrar();
  });

  concorrente.atualizar(); // Atualiza o estado e ações do concorrente
  concorrente.mostrar(); // Desenha o concorrente na tela
  concorrente.venderMorangosColhidos(); // Concorrente vende morangos que colheu

  ajudante.atualizar(); // Atualiza o estado e ações do ajudante
  ajudante.mostrar(); // Desenha o ajudante na tela
  ajudante.venderMorangos(); // Ajudante vende morangos que colheu
  ajudante.venderFrutas(); // Ajudante vende frutas (maçãs) que colheu
}

// Função para exibir informações na tela
function mostraInformacoes() {
  textSize(16); // Define o tamanho do texto
  fill(0); // Define a cor do texto para preto
  text("🌡 Temperatura: " + temperatura.toFixed(2), 10, 30); // Mostra a temperatura
  text("🌳 Plantas: " + totalArvores, 10, 50); // Mostra o total de plantas (árvores e morangos)
  text("🍎 Frutos colhidos (Você): " + frutosColhidosJardineiro, 10, 70); // Mostra os frutos colhidos pelo jogador
  text("💰 Lucro (Você): R$ " + lucroJardineiro.toFixed(2), 10, 90); // Mostra o lucro do jogador

  // Informações do Concorrente (apenas morangos)
  text("🍓 Morangos colhidos (Concorrente): " + frutosColhidosMorangosConcorrente, 10, 110); // Morangos colhidos pelo concorrente
  text("💰 Lucro Concorrente (Morangos): R$ " + lucroConcorrenteMorangosColhidos.toFixed(2), 10, 130); // Lucro do concorrente com morangos

  // Informações do Ajudante (colhe e vende para o jogador)
  text("🍓 Morangos colhidos (Ajudante): " + frutosColhidosAjudanteMorangos, 10, 150); // Morangos colhidos pelo ajudante
  text("🍎 Frutos colhidos (Ajudante): " + frutosColhidosAjudanteFrutas, 10, 170); // Maçãs colhidas pelo ajudante
  text("💰 Lucro Ajudante (Total): R$ " + (lucroAjudanteMorangos + lucroAjudanteFrutas).toFixed(2), 10, 190); // Lucro total do ajudante

  text("▶ Setas = mover | P = plantar | C = colher | V = vender", 10, 220); // Instruções de controle
}

// Classe para o Jardineiro (jogador)
class Jardineiro {
  constructor(x, y) {
    this.x = x; // Posição X
    this.y = y; // Posição Y
    this.emoji = '👨🏽‍🌾'; // Emoji que representa o jardineiro
    this.velocidade = 3; // Velocidade de movimento
  }

  // Atualiza a posição do jardineiro com base nas teclas pressionadas
  atualizar() {
    if (keyIsDown(LEFT_ARROW)) this.x -= this.velocidade;
    if (keyIsDown(RIGHT_ARROW)) this.x += this.velocidade;
    if (keyIsDown(UP_ARROW)) this.y -= this.velocidade;
    if (keyIsDown(DOWN_ARROW)) this.y += this.velocidade;

    // Limita o jardineiro dentro dos limites do canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);
  }

  // Desenha o jardineiro na tela
  mostrar() {
    textSize(32); // Tamanho do emoji
    text(this.emoji, this.x, this.y);
  }
}

// Classe para o Concorrente (NPC autônomo, focado apenas em morangos)
class Concorrente {
  constructor(x, y) {
    this.x = x; // Posição X
    this.y = y; // Posição Y
    this.emoji = '🧑🏻‍🌾'; // Emoji que representa o concorrente
    this.velocidade = 2; // Velocidade de movimento do concorrente
    this.timerVendaMorangos = 0; // Timer para venda de morangos colhidos
    this.frutosColhidosMorangos = 0; // Morangos colhidos por este concorrente

    this.targetX = x; // Posição X alvo para movimento
    this.targetY = y; // Posição Y alvo para movimento
    this.state = 'idle'; // Estado atual do concorrente: 'idle', 'moving', 'planting', 'harvesting'
    this.actionTimer = 0; // Timer para ações gerais (colher, mover)
    this.plantTimer = 0; // Novo timer para o plantio
  }

  // Atualiza o estado e as ações do concorrente
  atualizar() {
    this.actionTimer++; // Incrementa o timer de ação geral
    this.plantTimer++; // Incrementa o timer de plantio

    // Lógica de movimento
    if (dist(this.x, this.y, this.targetX, this.targetY) < this.velocidade) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.state = 'idle'; // Chegou ao destino, volta ao estado ocioso
    } else {
      // Move em direção ao alvo
      let angle = atan2(this.targetY - this.y, this.targetX - this.x);
      this.x += cos(angle) * this.velocidade;
      this.y += sin(angle) * this.velocidade;
    }

    // Limita o concorrente dentro dos limites do canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);

    // Lógica de decisão baseada no estado
    if (this.state === 'idle') {
      // Prioriza o plantio a cada 15 segundos
      if (this.plantTimer >= (15 * 60) && totalArvores < 50) { // 15 segundos = 900 frames, limite aumentado para 50 plantas
        this.state = 'planting';
        this.targetX = random(width);
        this.targetY = random(height);
        this.plantTimer = 0; // Reseta o timer de plantio
        this.actionTimer = 0; // Reseta o timer geral para evitar ações imediatas após o plantio
      } else if (this.actionTimer > 180) { // A cada 3 segundos (180 frames), tenta outras ações
        let action = random(['harvest', 'move']); // Remove 'plant' daqui, pois já é tratado acima

        if (action === 'harvest' && random() < 0.8) { // Chance de colher
          let morangoComFrutos = morangos.find(morango => morango.frutos > 0);

          if (morangoComFrutos) { // Apenas busca por morangos
            this.state = 'moving';
            this.targetX = morangoComFrutos.x;
            this.targetY = morangoComFrutos.y;
          } else {
            this.state = 'idle'; // Nenhuma planta para colher, volta a ser ocioso
          }
          this.actionTimer = 0;
        } else { // Se não plantou nem colheu, apenas se move para um novo local
          this.state = 'moving';
          this.targetX = random(width);
          this.targetY = random(height);
          this.actionTimer = 0;
        }
      }
    } else if (this.state === 'planting') {
      // Concorrente está se movendo para o local de plantio
      if (dist(this.x, this.y, this.targetX, this.targetY) < 40) { // Se perto do alvo
        if (this.actionTimer > 60) { // Espera um pouco para "plantar"
          let nova = new Morango(this.x, this.y); // Concorrente planta morangos
          morangos.push(nova); // Adiciona ao array de morangos
          totalArvores++; // Incrementa o total de plantas
          temperatura -= 0.5; // Plantar morangos afeta a temperatura menos
          if (temperatura < 0) temperatura = 0;
          this.state = 'idle';
          this.actionTimer = 0;
        }
      }
    } else if (this.state === 'moving') {
      let morangoProximo = morangos.find(morango => dist(this.x, this.y, morango.x, morango.y) < 40 && morango.frutos > 0);

      if (morangoProximo && this.actionTimer > 30 && dist(this.x, this.y, morangoProximo.x, morangoProximo.y) < 40) {
        if (morangoProximo.colher()) {
          this.frutosColhidosMorangos++; // Colhe morangos
          frutosColhidosMorangosConcorrente = this.frutosColhidosMorangos; // Atualiza a variável global
        }
        this.actionTimer = 0;
      }
    }
  }

  // Desenha o concorrente na tela
  mostrar() {
    textSize(32);
    text(this.emoji, this.x, this.y);
  }

  // Vende morangos colhidos periodicamente
  venderMorangosColhidos() {
    this.timerVendaMorangos++;
    if (this.frutosColhidosMorangos > 0 && this.timerVendaMorangos > 180) { // A cada 3 segundos, se tiver morangos
      let morangosParaVender = min(this.frutosColhidosMorangos, floor(random(1, 4))); // Vende 1 a 3 morangos
      lucroConcorrenteMorangosColhidos += morangosParaVender * 1.0; // Cada morango vale R$1.00 (preço do concorrente)
      this.frutosColhidosMorangos -= morangosParaVender;
      this.timerVendaMorangos = 0;
    }
  }
}

// Classe para o Ajudante (NPC autônomo, focado em ajudar o jogador)
class Ajudante {
  constructor(x, y) {
    this.x = x; // Posição X
    this.y = y; // Posição Y
    this.emoji = '👩🏽‍🌾'; // Emoji que representa o ajudante
    this.velocidade = 2.5; // Velocidade de movimento do ajudante
    this.frutosColhidosMorangos = 0; // Morangos colhidos por este ajudante
    this.frutosColhidosFrutas = 0; // Maçãs colhidas por este ajudante
    this.timerVendaMorangos = 0; // Timer para venda de morangos
    this.timerVendaFrutas = 0; // Timer para venda de maçãs

    this.targetX = x; // Posição X alvo para movimento
    this.targetY = y; // Posição Y alvo para movimento
    this.state = 'idle'; // Estado atual do ajudante: 'idle', 'moving', 'harvesting'
    this.actionTimer = 0; // Timer para ações específicas (colher)
  }

  // Atualiza o estado e as ações do ajudante
  atualizar() {
    this.actionTimer++; // Incrementa o timer de ação

    // Lógica de movimento
    if (dist(this.x, this.y, this.targetX, this.targetY) < this.velocidade) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.state = 'idle'; // Chegou ao destino, volta ao estado ocioso
    } else {
      // Move em direção ao alvo
      let angle = atan2(this.targetY - this.y, this.targetX - this.x);
      this.x += cos(angle) * this.velocidade;
      this.y += sin(angle) * this.velocidade;
    }

    // Limita o ajudante dentro dos limites do canvas
    this.x = constrain(this.x, 0, width);
    this.y = constrain(this.y, 0, height);

    // Lógica de decisão baseada no estado
    if (this.state === 'idle') {
      if (this.actionTimer > 90) { // A cada 1.5 segundos, tenta uma nova ação
        let morangoComFrutos = morangos.find(morango => morango.frutos > 0);
        let arvoreComFrutos = plantas.find(arvore => arvore.frutos > 0);

        if (morangoComFrutos && (!arvoreComFrutos || random() < 0.5)) { // Prioriza morangos ou escolhe aleatoriamente
          this.state = 'moving';
          this.targetX = morangoComFrutos.x;
          this.targetY = morangoComFrutos.y;
        } else if (arvoreComFrutos) {
          this.state = 'moving';
          this.targetX = arvoreComFrutos.x;
          this.targetY = arvoreComFrutos.y;
        } else { // Se não houver frutos, move-se aleatoriamente
          this.state = 'moving';
          this.targetX = random(width);
          this.targetY = random(height);
        }
        this.actionTimer = 0;
      }
    } else if (this.state === 'moving') {
      let morangoProximo = morangos.find(morango => dist(this.x, this.y, morango.x, morango.y) < 40 && morango.frutos > 0);
      let arvoreProxima = plantas.find(arvore => dist(this.x, this.y, arvore.x, arvore.y) < 40 && arvore.frutos > 0);

      if (morangoProximo && this.actionTimer > 30 && dist(this.x, this.y, morangoProximo.x, morangoProximo.y) < 40) {
        if (morangoProximo.colher()) {
          this.frutosColhidosMorangos++; // Colhe morangos
          frutosColhidosAjudanteMorangos = this.frutosColhidosMorangos; // Atualiza a variável global
        }
        this.actionTimer = 0;
      } else if (arvoreProxima && this.actionTimer > 30 && dist(this.x, this.y, arvoreProxima.x, arvoreProxima.y) < 40) {
        if (arvoreProxima.colher()) {
          this.frutosColhidosFrutas++; // Colhe maçãs
          frutosColhidosAjudanteFrutas = this.frutosColhidosFrutas; // Atualiza a variável global
        }
        this.actionTimer = 0;
      }
    }
  }

  // Desenha o ajudante na tela
  mostrar() {
    textSize(32);
    text(this.emoji, this.x, this.y);
  }

  // Vende morangos colhidos periodicamente
  venderMorangos() {
    this.timerVendaMorangos++;
    if (this.frutosColhidosMorangos > 0 && this.timerVendaMorangos > 180) { // A cada 3 segundos, se tiver morangos
      let morangosParaVender = min(this.frutosColhidosMorangos, floor(random(1, 4))); // Vende 1 a 3 morangos
      lucroAjudanteMorangos += morangosParaVender * 1.0; // Cada morango vale R$1.00 (preço do ajudante)
      this.frutosColhidosMorangos -= morangosParaVender;
      this.timerVendaMorangos = 0;
    }
  }

  // Vende maçãs colhidas periodicamente
  venderFrutas() {
    this.timerVendaFrutas++;
    if (this.frutosColhidosFrutas > 0 && this.timerVendaFrutas > 240) { // A cada 4 segundos, se tiver maçãs
      let frutasParaVender = min(this.frutosColhidosFrutas, floor(random(1, 3))); // Vende 1 a 2 maçãs
      lucroAjudanteFrutas += frutasParaVender * 2.5; // Cada maçã vale R$2.50 (preço do jogador)
      this.frutosColhidosFrutas -= frutasParaVender;
      this.timerVendaFrutas = 0;
    }
  }
}

// Classe para a Árvore com níveis e frutos regeneráveis
class Arvore {
  constructor(x, y) {
    this.x = x; // Posição X
    this.y = y; // Posição Y
    this.nivel = 1; // Nível da árvore
    this.frutos = 1; // Quantidade atual de frutos
    this.timerCrescimento = 0; // Timer para crescimento de nível
    this.maxFrutos = this.nivel; // Máximo de frutos que a árvore pode ter
  }

  // Atualiza o estado da árvore (crescimento e regeneração de frutos)
  atualizar() {
    this.timerCrescimento++;
    if (this.timerCrescimento > 300) { // Cresce de nível a cada 5 segundos
      if (this.nivel < 3) this.nivel++; // Limita o nível máximo a 3
      this.maxFrutos = this.nivel; // O máximo de frutos aumenta com o nível
      this.timerCrescimento = 0;
    }

    // Regenera frutos se não estiver cheio
    if (this.frutos < this.maxFrutos && frameCount % 180 === 0) { // A cada 3 segundos
      this.frutos++;
    }
  }

  // Desenha a árvore e seus frutos
  mostrar() {
    textSize(32);
    text('🌳', this.x, this.y); // Desenha a árvore
    textSize(16);
    text(`Lv.${this.nivel}`, this.x, this.y - 10); // Mostra o nível da árvore
    for (let i = 0; i < this.frutos; i++) {
      text('🍎', this.x + i * 15, this.y - 30); // Desenha os frutos
    }
  }

  // Tenta colher um fruto da árvore
  colher() {
    if (this.frutos > 0) {
      this.frutos--; // Diminui a quantidade de frutos
      return true; // Colheita bem-sucedida
    }
    return false; // Não há frutos para colher
  }
}

// Classe para o Morango com níveis e frutos regeneráveis
class Morango {
  constructor(x, y) {
    this.x = x; // Posição X
    this.y = y; // Posição Y
    this.nivel = 1; // Nível do morango
    this.frutos = 1; // Quantidade atual de morangos
    this.timerCrescimento = 0; // Timer para crescimento de nível
    this.maxFrutos = this.nivel * 2; // Morangos podem ter mais frutos por nível
  }

  // Atualiza o estado do morango (crescimento e regeneração de frutos)
  atualizar() {
    this.timerCrescimento++;
    if (this.timerCrescimento > 180) { // Cresce de nível a cada 3 segundos (mais rápido que árvores)
      if (this.nivel < 3) this.nivel++; // Limita o nível máximo a 3
      this.maxFrutos = this.nivel * 2; // O máximo de frutos aumenta com o nível
      this.timerCrescimento = 0;
    }

    // Regenera frutos se não estiver cheio
    if (this.frutos < this.maxFrutos && frameCount % 90 === 0) { // A cada 1.5 segundos (mais rápido)
      this.frutos++;
    }
  }

  // Desenha o morango e seus frutos
  mostrar() {
    textSize(32);
    text('🌱', this.x, this.y); // Desenha a planta de morango
    textSize(16);
    text(`Lv.${this.nivel}`, this.x, this.y - 10); // Mostra o nível da planta
    for (let i = 0; i < this.frutos; i++) {
      text('🍓', this.x + i * 15, this.y - 30); // Desenha os morangos
    }
  }

  // Tenta colher um morango da planta
  colher() {
    if (this.frutos > 0) {
      this.frutos--; // Diminui a quantidade de frutos
      return true; // Colheita bem-sucedida
    }
    return false; // Não há frutos para colher
  }
}

// Função chamada quando uma tecla é pressionada
function keyPressed() {
  // Plantar árvore
  if (key === 'p' || key === 'P') {
    let nova = new Arvore(jardineiro.x, jardineiro.y); // Cria uma nova árvore na posição do jardineiro
    plantas.push(nova); // Adiciona a nova árvore ao array
    totalArvores++; // Incrementa o contador de árvores
    temperatura -= 3; // Diminui a temperatura ao plantar
    if (temperatura < 0) temperatura = 0; // Garante que a temperatura não seja negativa
  }

  // Colher frutos
  if (key === 'c' || key === 'C') {
    for (let arvore of plantas) {
      let d = dist(jardineiro.x, jardineiro.y, arvore.x, arvore.y); // Calcula a distância do jardineiro à árvore
      if (d < 40 && arvore.colher()) { // Se estiver perto e a árvore tiver frutos para colher
        frutosColhidosJardineiro++; // Incrementa os frutos colhidos pelo jogador
        break; // Colhe apenas de uma árvore por vez
      }
    }
  }

  // Vender frutos
  if (key === 'v' || key === 'V') {
    if (frutosColhidosJardineiro > 0) { // Se o jogador tiver frutos para vender
      let precoPorFruto = 2.5; // Preço de venda por fruto
      lucroJardineiro += frutosColhidosJardineiro * precoPorFruto; // Adiciona ao lucro do jogador
      frutosColhidosJardineiro = 0; // Zera os frutos colhidos após a venda
    }
  }
}
