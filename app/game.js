var gameSendoJogado = {};

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
      $('#' + i).removeClass('red');
      $('#' + i).removeClass('blue');
    }
  }

  proximoEstado(estado) {
    this.estadoAtual = estado;
    this.atualizaGrafico(estado);

    if (this.estadoAtual.fimDeJogo()) {
      this.status = resultados.vitoria;

      if (this.estadoAtual.resultado === players.azul) {
        return console.log("Blue");
      } else if (this.estadoAtual.resultado === players.vermelho) {
        return console.log("Red");
      }
      return console.log("Draw");

    } else {
      setTimeout(() => {
        if (this.estadoAtual.turno === players.azul) {
          return this.iaAzul.notificar(players.azul);
        }
        return this.iaVermelho.notificar(players.vermelho);        
      }, 1000);
    }
  }

  atualizaGrafico(estado) {
    for (let i = 0; i < 12; i++) {
      if (estado.board[i] === players.azul) {
        $('#' + i).addClass("blue");
      } else if (estado.board[i] === players.vermelho) {
        $('#' + i).addClass("red");
      }
    }
  }
}

var score = function(estado) {
  if (estado.resultado !== resultados.rodando) {
    if (estado.resultado === players.azul) {
      return 10 - estado.jogadasVermelho;

    } else if (estado.resultado === players.vermelho) {
      return -10 + estado.jogadasAzul;

    } else {
      return 0;
    }
  }
}
