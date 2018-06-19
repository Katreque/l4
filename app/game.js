class Game {
  constructor(iaAzul, iaVermelho) {
    this.iaAzul = iaAzul;
    this.iaVermelho = iaVermelho;
    this.estadoAtual = new Estado();
    this.estadoAtual.turno = players.azul;
    this.status = resultados.inicio;
  }

  iniciar() {
    this.inicializaBoard(this.estadoAtual.board);
    if (this.status === resultados.inicio) {
      this.proximoEstado(this.estadoAtual);
      this.status = resultados.rodando;
    }
  }

  inicializaBoard(board) {
    for (let i = 0; i < 12; i++) {
      board[i] = (players.vazio);
    }
  }

  proximoEstado(estado) {
    this.estadoAtual = estado;
    debugger
    if (this.estadoAtual.fimDeJogo()) {
      this.status = resultados.vitoria;

      if (this.estadoAtual.resultado === players.azul) {
        console.log("Blue");
      } else if (this.estadoAtual.resultado === players.vermelho) {
        console.log("Red");
      }
      console.log("Draw");

    } else {
      if (this.estadoAtual.turno === players.azul) {
        return this.iaAzul.notificar(players.azul);
      }
      return this.iaVermelho.notificar(players.vermelho);
    }
  }
}

var score = function(estado) {
  if (estado.resultado !== resultados.rodando) {
    if (estado.resultado === players.azul) {
      return 10 - estado.jogadasIA;

    } else if (estado.resultado === players.vermelho) {
      return -10 + estado.jogadasIA;

    } else {
      return 0;
    }
  }
}
