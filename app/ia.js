class Ia {
  constructor(dificuldade) {
    this.nivelDificuldade = dificuldade;
  }

  resultadoMiniMax(estado) {
    return new Promise((resolve, reject) => {
      if (estado.fimDeJogo()) {
        score(estado).then((resultado) => {
          resolve(resultado);
        })
      }

      if (estado.turno === players.azul) {
        let resultadoEstado = -1000000;

        return estado.posicoesVazias()
        .then((posicoesDisponiveis) => {
          let proximosEstadosDisponiveis = posicoesDisponiveis.map((posicao) => {
            let acao = new JogadaIa(posicao);
            let proximoEstado = acao.aplicar(estado);

            return proximoEstado;
          })

          proximosEstadosDisponiveis.forEach((proximoEstado) => {
            return this.resultadoMiniMax(proximoEstado)
              .then((proximoResultado) => {
                resultadoEstado = Math.max(proximoResultado, resultadoEstado);
              })
          })
          resolve(resultadoEstado);
        })
      } else {
        let resultadoEstado = 1000000;

        return estado.posicoesVazias()
        .then((posicoesDisponiveis) => {
          let proximosEstadosDisponiveis = posicoesDisponiveis.map((posicao) => {
            let acao = new JogadaIa(posicao);
            let proximoEstado = acao.aplicar(estado);

            return proximoEstado;
          })

          proximosEstadosDisponiveis.forEach((proximoEstado) => {
            return this.resultadoMiniMax(proximoEstado)
              .then((proximoResultado) => {
                resultadoEstado = Math.min(proximoResultado, resultadoEstado);
              })
          })
          resolve(resultadoEstado);
        })
      }
    })
  }

  jogadaRandom(turno) {
    return gameSendoJogado.estadoAtual.posicoesVazias()
      .then((disponivel) => {
        let escolhaAleatoria = disponivel[Math.floor(Math.random() * disponivel.length)];
        let acao = new JogadaIa(escolhaAleatoria);
        let proximo = acao.aplicar(gameSendoJogado.estadoAtual);

        return gameSendoJogado.proximoEstado(proximo);
      })
  }

  jogadaExpert(turno) {
    return gameSendoJogado.estadoAtual.posicoesVazias()
      .then((disponivel) => {
        let acoesDisponiveis = disponivel.map((posicao) => {
          let acao = new JogadaIa(posicao);
          let proximo = acao.aplicar(gameSendoJogado.estadoAtual);
          return this.resultadoMiniMax(proximo)
            .then((retorno) => {
              acao.valorMiniMax = retorno;
              return acao;
            })
          });

          if (turno === players.azul) {
            acoesDisponiveis.sort(sortAcoesDecrescente)
          } else {
            acoesDisponiveis.sort(sortAcoesCrescente)
          }

          let acaoEscolhida = acoesDisponiveis[0];
          let proximo = acaoEscolhida.aplicar(gameSendoJogado.estadoAtual);

          debugger
          return gameSendoJogado.proximoEstado(proximo);
      })
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

var score = function(estado) {
  return new Promise((resolve, reject) => {
    if (estado.resultado !== resultados.rodando) {
      let _countScoreAzul = 0;
      let _countScoreVermelho = 0;

      //Colunas
      let _azulNaColuna = 0;
      let _vermelhoNaColuna = 0;
      for (let i = 0; i < 4; i++) {
        if (estado.board[i] === players.azul) {
          _azulNaColuna++;
        } else if (estado.board[i] === players.vermelho){
          _vermelhoNaColuna++;
        }

        if (estado.board[i+4] === players.azul) {
          _azulNaColuna++;
        } else if (estado.board[i+4] === players.vermelho){
          _vermelhoNaColuna++;
        }

        if (estado.board[i+8] === players.azul) {
          _azulNaColuna++;
        } else if (estado.board[i+8] === players.vermelho){
          _vermelhoNaColuna++;
        }

        if ((_azulNaColuna === 0 && _vermelhoNaColuna !== 0) || (_azulNaColuna !== 0 && _vermelhoNaColuna === 0)) {
          _countScoreAzul += this.balanceamentoScore(_azulNaColuna);
          _countScoreVermelho += this.balanceamentoScore(_vermelhoNaColuna);
        }
      }

      //3 primeiros horizontal
      let _azulNaHorizontal = 0;
      let _vermelhoNaHorizontal = 0;
      for (let i = 0; i < 12; i+=4) {
        if (estado.board[i] === players.azul) {
          _azulNaHorizontal++;
        } else if (estado.board[i] === players.vermelho){
          _vermelhoNaHorizontal++;
        }

        if (estado.board[i+1] === players.azul) {
          _azulNaHorizontal++;
        } else if (estado.board[i+1] === players.vermelho){
          _vermelhoNaHorizontal++;
        }

        if (estado.board[i+2] === players.azul) {
          _azulNaHorizontal++;
        } else if (estado.board[i+2] === players.vermelho){
          _vermelhoNaHorizontal++;
        }

        if ((_azulNaHorizontal === 0 && _vermelhoNaHorizontal !== 0) || (_azulNaHorizontal !== 0 && _vermelhoNaHorizontal === 0)) {
          _countScoreAzul += this.balanceamentoScore(_azulNaHorizontal);
          _countScoreVermelho += this.balanceamentoScore(_vermelhoNaHorizontal);
        }
      }

      //3 últimos horizontal
      _azulNaHorizontal = 0;
      _vermelhoNaHorizontal = 0;
      for (let i = 0; i < 12; i+=4) {
        if (estado.board[i+1] === players.azul) {
          _azulNaHorizontal++;
        } else if (estado.board[i+1] === players.vermelho){
          _vermelhoNaHorizontal++;
        }

        if (estado.board[i+2] === players.azul) {
          _azulNaHorizontal++;
        } else if (estado.board[i+2] === players.vermelho){
          _vermelhoNaHorizontal++;
        }

        if (estado.board[i+3] === players.azul) {
          _azulNaHorizontal++;
        } else if (estado.board[i+3] === players.vermelho){
          _vermelhoNaHorizontal++;
        }

        if ((_azulNaHorizontal === 0 && _vermelhoNaHorizontal !== 0) || (_azulNaHorizontal !== 0 && _vermelhoNaHorizontal === 0)) {
          _countScoreAzul += this.balanceamentoScore(_azulNaHorizontal);
          _countScoreVermelho += this.balanceamentoScore(_vermelhoNaHorizontal);
        }
      }

      //Diagonal cima
      let _azulNaDiagonal = 0;
      let _vermelhoNaDiagonal = 0;
      for (let i = 0; i < 2; i++) {
        if (estado.board[i] === players.azul) {
          _azulNaDiagonal++;
        } else if (estado.board[i] === players.vermelho){
          _vermelhoNaDiagonal++;
        }

        if (estado.board[i+5] === players.azul) {
          _azulNaDiagonal++;
        } else if (estado.board[i+5] === players.vermelho){
          _vermelhoNaDiagonal++;
        }

        if (estado.board[i+10] === players.azul) {
          _azulNaDiagonal++;
        } else if (estado.board[i+10] === players.vermelho){
          _vermelhoNaDiagonal++;
        }

        if ((_azulNaDiagonal === 0 && _vermelhoNaDiagonal !== 0) || (_azulNaDiagonal !== 0 && _vermelhoNaDiagonal === 0)) {
          _countScoreAzul += this.balanceamentoScore(_azulNaDiagonal);
          _countScoreVermelho += this.balanceamentoScore(_vermelhoNaDiagonal);
        }
      }

      //Diagonal baixo
      _azulNaDiagonal = 0;
      _vermelhoNaDiagonal= 0;
      for (let i = 0; i < 2; i++) {
        if (estado.board[i+2] === players.azul) {
          _azulNaDiagonal++;
        } else if (estado.board[i+2] === players.vermelho){
          _vermelhoNaDiagonal++;
        }

        if (estado.board[i+5] === players.azul) {
          _azulNaDiagonal++;
        } else if (estado.board[i+5] === players.vermelho){
          _vermelhoNaDiagonal++;
        }

        if (estado.board[i+8] === players.azul) {
          _azulNaDiagonal++;
        } else if (estado.board[i+8] === players.vermelho){
          _vermelhoNaDiagonal++;
        }

        if ((_azulNaDiagonal === 0 && _vermelhoNaDiagonal !== 0) || (_azulNaDiagonal !== 0 && _vermelhoNaDiagonal === 0)) {
          _countScoreAzul += this.balanceamentoScore(_azulNaDiagonal);
          _countScoreVermelho += this.balanceamentoScore(_vermelhoNaDiagonal);
        }
      }

      resolve(_countScoreAzul - _countScoreVermelho);
    }
  })
}

var balanceamentoScore = function (valor) {
  if (valor === 0) {
    return 0;
  }

  if (valor === 1) {
    return 2;
  }

  if (valor === 2) {
    return 4;
  }

  if (valor === 3) {
    return 10000;
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
