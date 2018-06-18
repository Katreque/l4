class Ia {
  constructor(dificuldade) {
    this.nivelDificuldade = dificuldade;
    this.game = {};
  }

  resultadoMiniMax(estado) {
    if (estado.fimDeJogo()) {
      return score(estado);
    }

    let resultadoEstado;

    if (estado.turno === players.azul) {
      resultadoEstado = -100000;
    } else {
      resultadoEstado = 100000;
    }

    let posicoesDisponiveis = estado.posicoesVazias();

    let proximosEstadosDisponiveis = posicoesDisponiveis.map(function (posicao) {
      let acao = new JogadaIa(posicao);
      let proximoEstado = acao.aplicar(estado);

      return proximoEstado;
    })

    proximosEstadosDisponiveis.forEach(function (proximoEstado) {
      var proximoResultado = this.resultadoMiniMax(proximoEstado);

      if (estado.turno === players.azul) {
        if (proximoResultado > resultadoEstado) {
          resultadoEstado = proximoResultado;
        }
      } else {
        if (proximoResultado < resultadoEstado) {
          resultadoEstado = proximoResultado;
        }
      }
    }.bind(this))

    return resultadoEstado;
  }

  jogadaRandom(turno) {
    let disponivel = this.game.estadoAtual.posicoesVazias();
    let escolhaAleatoria = disponivel[Math.floor(Math.random() * disponivel.length)];
    let acao = new JogadaIa(escolhaAleatoria);
    let proximo = acao.aplicar(this.game.estadoAtual);

    this.game.proximoEstado(proximo);
  }

  jogadaExpert(turno) {
    let disponivel = this.game.estadoAtual.posicoesVazias();

    let acoesDisponiveis = disponivel.map(function (posicao) {
      let acao = new JogadaIa(posicao);
      let proximo = acao.aplicar(this.game.estadoAtual);
      acao.valorMiniMax = this.resultadoMiniMax(proximo);

      return acao;
    }.bind(this))

    if (turno === players.azul) {
      acoesDisponiveis.sort(sortAcoesDecrescente)
    } else {
      acoesDisponiveis.sort(sortAcoesCrescente)
    }

    let acaoEscolhida = acoesDisponiveis[0];
    let proximo = acaoEscolhida.aplicar(this.game.estadoAtual);

    this.game.proximoEstado(proximo);
  }

  joga(game) {
    this.game = game;
  }

  notificar(turno) {
    if (this.nivelDificuldade === dificuldades.random) {
      return this.jogadaRandom(turno);
    }

    return this.jogadaExpert(turno);
  }
}

class JogadaIa {
  constructor(posicao) {
    this.posicaoAcao = posicao;
    this.valorMiniMax = 0;
  }

  aplicar(estado) {
    let proximo = new Estado(estado);
    proximo.board[this.posicaoAcao] = estado.turno;

    if (estado.turno === players.azul) {
      proximo.jogadasIA++;
    }

    proximo.proximoTurno();
    return proximo;
  }
}

var sortAcoesCrescente = function (primeiraJogada, segundaJogada) {
  if (primeiraJogada.valorMiniMax < segundaJogada.valorMiniMax) {
    return -1;

  } else if (primeiraJogada.valorMiniMax > segundaJogada.valorMiniMax) {
    return 1;
  }

  return 0;
}

var sortAcoesDecrescente = function (primeiraJogada, segundaJogada) {
  if (primeiraJogada.valorMiniMax > segundaJogada.valorMiniMax) {
    return -1;

  } else if (primeiraJogada.valorMiniMax < segundaJogada.valorMiniMax) {
    return 1;
  }

  return 0;
}
