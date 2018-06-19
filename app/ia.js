class Ia {
  constructor(dificuldade) {
    this.nivelDificuldade = dificuldade;
  }

  resultadoMiniMax(estado) {
    if (estado.fimDeJogo()) {
      return score(estado);
    }

    let resultadoEstado;

    if (estado.turno === players.azul) {
      resultadoEstado = -1000;
    } else {
      resultadoEstado = 1000;
    }

    let posicoesDisponiveis = estado.posicoesVazias();

    let proximosEstadosDisponiveis = posicoesDisponiveis.map((posicao) => {
      let acao = new JogadaIa(posicao);
      let proximoEstado = acao.aplicar(estado);

      return proximoEstado;
    })

    proximosEstadosDisponiveis.forEach((proximoEstado) => {
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
    })

    return resultadoEstado;
  }

  jogadaRandom(turno) {
    let disponivel = gameSendoJogado.estadoAtual.posicoesVazias();
    let escolhaAleatoria = disponivel[Math.floor(Math.random() * disponivel.length)];
    let acao = new JogadaIa(escolhaAleatoria);
    let proximo = acao.aplicar(gameSendoJogado.estadoAtual);

    gameSendoJogado.proximoEstado(proximo);
  }

  jogadaExpert(turno) {
    let disponivel = gameSendoJogado.estadoAtual.posicoesVazias();
    let acoesDisponiveis = disponivel.map((posicao) => {
      let acao = new JogadaIa(posicao);
      let proximo = acao.aplicar(gameSendoJogado.estadoAtual);
      acao.valorMiniMax = this.resultadoMiniMax(proximo);

      return acao;
    })

    if (turno === players.azul) {
      acoesDisponiveis.sort(sortAcoesDecrescente)
    } else {
      acoesDisponiveis.sort(sortAcoesCrescente)
    }

    let acaoEscolhida = acoesDisponiveis[0];
    let proximo = acaoEscolhida.aplicar(gameSendoJogado.estadoAtual);

    gameSendoJogado.proximoEstado(proximo);
  }

  joga(game) {
    gameSendoJogado = game;
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
      proximo.jogadasAzul++;
    }

    if (estado.turno === players.vermelho) {
      proximo.jogadasVermelho++;
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
