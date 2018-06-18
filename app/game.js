class Game {
  constructor(Ia) {
    this.ia = Ia;
    this.estadoAtual = new Estado();
    this.estadoAtual.inicializaBoard();
    this.estadoAtual.turno = players.azul;
    this.status = resultados.inicio;
  }

  iniciar() {
    if (this.status === resultados.inicio) {
      this.proximoEstado(this.estadoAtual);
      this.status =  resultados.rodando;
    }
  }

  proximoEstado(estado) {
    this.estadoAtual = estado;
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
        return this.ia.notificar(players.azul);
      }

      return this.ia.notificar(players.vermelho);
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
