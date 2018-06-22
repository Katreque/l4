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
    $("#azulwins").addClass("nao-mostrar");
    $("#vermelhowins").addClass("nao-mostrar");
    $("#empatewins").addClass("nao-mostrar");
    $("#azulwins").removeClass("mostrar");
    $("#vermelhowins").removeClass("mostrar");
    $("#empatewins").removeClass("mostrar");
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
        $("#azulwins").removeClass("nao-mostrar");
        return $("#azulwins").addClass("mostrar");
      } else if (this.estadoAtual.resultado === players.vermelho) {
        $("#vermelhowins").removeClass("nao-mostrar");
        return $("#vermelhowins").addClass("mostrar");
      }

      $("#empatewins").removeClass("nao-mostrar");
      $("#empatewins").addClass("mostrar");

    } else {
      setTimeout(() => {
        if (this.estadoAtual.turno === players.azul) {
          return this.iaAzul.notificar(players.azul);
        }
        return this.iaVermelho.notificar(players.vermelho);
      }, 5000);
    }
  }

  aplicarGravidade(estado) {
    return new Promise((resolve, reject) => {
      for (let i = 0; i < 4; i++) {
        if(estado.board[i+4] === players.vazio) {
          if (estado.board[i] !== players.vazio) {
            estado.board[i+4] = estado.board[i];
            estado.board[i] = players.vazio;
          }
        }

        if (estado.board[i+8] === players.vazio) {
          if (estado.board[i+4] !== players.vazio) {
            estado.board[i+8] = estado.board[i+4];
            estado.board[i+4] = players.vazio;
          }
        }
      }
      resolve();
    })
  }

  atualizaGrafico(estado) {
    this.aplicarGravidade(estado)
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
