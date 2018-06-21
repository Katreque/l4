class Estado {
  constructor(estadoAnterior) {
    this.board = [];
    this.turno = "";
    this.jogadasAzul = 0;
    this.jogadasVermelho = 0;
    this.resultado = resultados.rodando;

    if (!!estadoAnterior) {
      let len = estadoAnterior.board.length;

      this.board = new Array(len);
      for (let i = 0; i < 12; i++) {
        if (!estadoAnterior.board[i]) {
          this.board[i] = players.vazio;
        } else {
          this.board[i] = estadoAnterior.board[i];
        }
      }
      this.turno = estadoAnterior.turno;
      this.jogadasAzul = estadoAnterior.jogadasAzul;
      this.jogadasVermelho = estadoAnterior.jogadasVermelho;
      this.resultado = estadoAnterior.resultado;
    }
  }

  proximoTurno() {
    this.turno = (this.turno === players.azul)? players.vermelho:players.azul;
  }

  posicoesVazias() {
    let posicoes = []

    for (let i = 0; i < 12; i++) {
      if (this.board[i] === players.vazio) {
        posicoes.push(i);
      }
    }

    return posicoes;
  }

  fimDeJogo() {
    //Vertical
    for (let i = 0; i < 4; i++) {
      if (this.board[i] !== players.vazio && ((this.board[i] === this.board[4+i]) && (this.board[4+i] === this.board[8+i]))) {
        this.resultado = this.board[i];
        return true;
      }
    }

    //Horizontal
    for (let i = 0; i < 12; i+=4) {
      if (this.board[i] !== players.vazio && ((this.board[i] === this.board[1+i]) && (this.board[1+i] === this.board[2+i]))) {
        this.resultado = this.board[i];
        return true;
      }

      if (this.board[1+i] !== players.vazio && ((this.board[1+i] === this.board[2+i]) && (this.board[2+i] === this.board[3+i]))) {
        this.resultado = this.board[1+i];
        return true;
      }
    }

    //Diagonal
    for (let i = 0; i < 2; i++) {
      if (this.board[i] !== players.vazio && ((this.board[i] === this.board[5+i]) && (this.board[5+i] === this.board[10+i]))) {
        this.resultado = this.board[i];
        return true;
      }

      if (this.board[2+i] !== players.vazio && ((this.board[2+i] === this.board[5+i]) && (this.board[5+i] === this.board[8+i]))) {
        this.resultado = this.board[2+i];
        return true;
      }
    }

    //Empate
    if (!this.posicoesVazias().length) {
      this.resultado = resultados.empate;
      return true;
    }

    return false;
  }
}
