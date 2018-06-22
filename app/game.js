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
      }, 1500);
    }
  }

  atualizaGrafico(estado) {
    aplicarGravidade(estado.board)
      .then(() => {
        for (let i = 0; i < 12; i++) {
          if (estado.board[i] === players.azul) {
            $('#' + i).addClass("blue");
          } else if (estado.board[i] === players.vermelho) {
            $('#' + i).addClass("red");
          }
        }
      })
  }
}

var aplicarGravidade = function (board) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < 4; i++) {
        if(board[i+4] === players.vazio) {
          if (board[i] !== players.vazio) {
            board[i+4] = board[i];
            board[i] = players.vazio;
          }
        }

        if (board[i+8] === players.vazio) {
          if (board[i+4] !== players.vazio) {
            board[i+8] = board[i+4];
            board[i+4] = players.vazio;
          }
        }
      }
      resolve();
    })
  }
