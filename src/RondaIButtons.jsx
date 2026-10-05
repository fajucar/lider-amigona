import React, { useState, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

// Estrutura oficial dos 5 setores e 29 pontos de iButtons
// (Obs: o boton 22 não existe na numeração atual, total de 29 pontos)
export const SETORES_IBUTTONS = [
  {
    id: "setor-1",
    numero: 1,
    nome: "SETOR 1 · TÉRREO / ÁREA COMUM",
    subtitulo: "Pontos 1 a 5 · Início e áreas de convivência externa",
    pontos: [
      {
        numero: 1,
        local: "Portaria / Guarita",
        detalhe: "1º boton do térreo. Ponto de partida.",
      },
      {
        numero: 2,
        local: "T2, Térreo, Triagem",
        detalhe: "Boton extra (inativo). Bater mesmo assim.",
        inativo: true,
      },
      {
        numero: 3,
        local: "Área comum entre T2 e T1",
        detalhe: "Atrás da quadra recreativa de tênis/futebol.",
      },
      {
        numero: 4,
        local: "T1, Térreo",
        detalhe: "Espaço Pet.",
      },
      {
        numero: 5,
        local: "T1, 25º cavalete",
        detalhe: "Corredor da porta corta-fogo, entre finais 6 a 8.",
      },
    ],
  },
  {
    id: "setor-2",
    numero: 2,
    nome: "SETOR 2 · TORRE 1",
    subtitulo: "Pontos 6 a 8 · Torre 1",
    pontos: [
      {
        numero: 6,
        local: "T1, 13º andar",
        detalhe: "Dentro do shaft hidráulico.",
      },
      {
        numero: 7,
        local: "T1, 4º andar",
        detalhe: "Poste da quadra recreativa, na entrada (boton extra desativado). Bater mesmo assim.",
        inativo: true,
      },
      {
        numero: 8,
        local: "T1, último boton do térreo",
        detalhe: "Ao lado da porta trancada.",
      },
    ],
  },
  {
    id: "setor-3",
    numero: 3,
    nome: "SETOR 3 · TORRE 2",
    subtitulo: "Pontos 9 a 19 · Do alto descendo pelo shaft hidráulico",
    pontos: [
      {
        numero: 9,
        local: "T2, 25º andar",
        detalhe: "Corredor da porta corta-fogo.",
      },
      {
        numero: 10,
        local: "T2, 25º andar",
        detalhe: "Dentro do shaft hidráulico.",
      },
      {
        numero: 11,
        local: "T2, 23º andar",
        detalhe: "Shaft hidráulico.",
      },
      {
        numero: 12,
        local: "T2, 20º andar",
        detalhe: "Shaft hidráulico.",
      },
      {
        numero: 13,
        local: "T2, 17º andar",
        detalhe: "Shaft hidráulico.",
      },
      {
        numero: 14,
        local: "T2, 14º andar",
        detalhe: "Shaft hidráulico.",
      },
      {
        numero: 15,
        local: "T2, 13º andar",
        detalhe: "Shaft hidráulico (boton extra desativado). Bater mesmo assim.",
        inativo: true,
      },
      {
        numero: 16,
        local: "T2, 11º andar",
        detalhe: "Shaft hidráulico.",
      },
      {
        numero: 17,
        local: "T2, 8º andar",
        detalhe: "Shaft hidráulico.",
      },
      {
        numero: 18,
        local: "T2, 5º andar",
        detalhe: "Shaft hidráulico.",
      },
      {
        numero: 19,
        local: "T2, 4º andar",
        detalhe: "Shaft hidráulico.",
      },
    ],
  },
  {
    id: "setor-4",
    numero: 4,
    nome: "SETOR 4 · GARAGEM",
    subtitulo: "Pontos 20 a 24 · Descendo os pavimentos de garagem",
    pontos: [
      {
        numero: 20,
        local: "T2, 3º pavimento, G3",
        detalhe: "Primeiro boton.",
      },
      {
        numero: 21,
        local: "T2, 3º pavimento, G3",
        detalhe: "Segundo boton. [confirmar local exato]",
      },
      {
        numero: 23,
        local: "T2, 2º pavimento, G2",
        detalhe: "■ BOTON COM DEFEITO / CAÍDO. Não registra. Confirme a área visualmente e anote a passagem manualmente. Aguardando troca.",
        defeito: true,
      },
      {
        numero: 24,
        local: "T2, 1º pavimento, G1",
        detalhe: "Registrando normal.",
      },
    ],
  },
  {
    id: "setor-5",
    numero: 5,
    nome: "SETOR 5 · ENCERRAMENTO",
    subtitulo: "Pontos 25 a 30 · Térreo T2 e setores de utilidades",
    pontos: [
      {
        numero: 25,
        local: "T2, Térreo",
        detalhe: "Ao lado da porta corta-fogo.",
      },
      {
        numero: 26,
        local: "T2, Térreo",
        detalhe: "Ao lado da porta da lixeira.",
      },
      {
        numero: 27,
        local: "T2, Térreo",
        detalhe: "Em frente à porta da lixeira.",
      },
      {
        numero: 28,
        local: "T2, Térreo",
        detalhe: "Ao lado da porta corta-fogo.",
      },
      {
        numero: 29,
        local: "T2, 1º andar",
        detalhe: "Administração (boton extra).",
      },
      {
        numero: 30,
        local: "T2, Térreo",
        detalhe: "Quadro de Exaustores (sala Msg/Expedição).",
      },
    ],
  },
];

// Lista linear dos 29 pontos
export const TODOS_PONTOS_IBUTTONS = SETORES_IBUTTONS.flatMap((s) =>
  s.pontos.map((p) => ({ ...p, setorId: s.id, setorNome: s.nome, setorNumero: s.numero }))
);

const CHAVE_STORAGE = "lider_amigao_ronda_ibuttons";
const SUGESTOES_OBSERVACOES = [
  "Porta corta-fogo aberta",
  "Lâmpada queimada no local",
  "Vazamento / goteira de água",
  "Boton não bipou no bastão",
  "Shaft obstruído",
  "Vistoriado e em ordem",
];

function formatarHoraSimples(data) {
  return data.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function formatarDuracao(segundosTotais) {
  const h = Math.floor(segundosTotais / 3600);
  const m = Math.floor((segundosTotais % 3600) / 60);
  const s = segundosTotais % 60;
  const pad = (n) => String(n).padStart(2, "0");
  if (h > 0) {
    return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
  }
  return `${pad(m)}m ${pad(s)}s`;
}

export default function RondaIButtons({ cor, tema, nomeLider, posto, store, Icone }) {
  // Estado principal da ronda
  const [responsavel, setResponsavel] = useState(() => nomeLider || "Porteiro de Plantão");
  const [statusRonda, setStatusRonda] = useState("nao_iniciada"); // "nao_iniciada" | "em_andamento" | "finalizada"
  const [horaInicio, setHoraInicio] = useState(null);
  const [tsInicio, setTsInicio] = useState(null);
  const [horaFim, setHoraFim] = useState(null);
  const [tsFim, setTsFim] = useState(null);
  const [duracaoSegundos, setDuracaoSegundos] = useState(0);

  // Mapa de registros dos pontos: { [numero]: { batido: boolean, hora: string, observacao: string, ts: number } }
  const [registros, setRegistros] = useState({});

  // UI States
  const [filtroSetor, setFiltroSetor] = useState("todos"); // "todos" | "setor-1" ...
  const [obsAberta, setObsAberta] = useState(null); // número do ponto cuja obs está aberta para digitação
  const [textoObsTemp, setTextoObsTemp] = useState("");
  const [mostrarModalPDF, setMostrarModalPDF] = useState(false);
  const [carregado, setCarregado] = useState(false);

  // Carregar dados persistidos ao montar
  useEffect(() => {
    async function carregarDados() {
      try {
        let salvo = null;
        if (store && typeof store.get === "function") {
          salvo = await store.get(CHAVE_STORAGE, null);
        }
        if (!salvo) {
          const l = localStorage.getItem(CHAVE_STORAGE);
          if (l) salvo = JSON.parse(l);
        }

        if (salvo && typeof salvo === "object") {
          if (salvo.responsavel) setResponsavel(salvo.responsavel);
          else if (nomeLider) setResponsavel(nomeLider);

          if (salvo.statusRonda) setStatusRonda(salvo.statusRonda);
          if (salvo.horaInicio) setHoraInicio(salvo.horaInicio);
          if (salvo.tsInicio) setTsInicio(salvo.tsInicio);
          if (salvo.horaFim) setHoraFim(salvo.horaFim);
          if (salvo.tsFim) setTsFim(salvo.tsFim);
          if (salvo.registros) setRegistros(salvo.registros);

          // Calcular duração salva
          if (salvo.statusRonda === "em_andamento" && salvo.tsInicio) {
            const decorrido = Math.max(0, Math.floor((Date.now() - salvo.tsInicio) / 1000));
            setDuracaoSegundos(decorrido);
          } else if (salvo.duracaoSegundos) {
            setDuracaoSegundos(salvo.duracaoSegundos);
          }
        } else if (nomeLider) {
          setResponsavel(nomeLider);
        }
      } catch (err) {
        console.error("Erro ao carregar dados da ronda:", err);
      } finally {
        setCarregado(true);
      }
    }
    carregarDados();
  }, [store, nomeLider]);

  // Salvar no storage sempre que os dados mudarem
  const salvarEstado = async (novoEstado) => {
    try {
      const payload = {
        responsavel,
        statusRonda,
        horaInicio,
        tsInicio,
        horaFim,
        tsFim,
        duracaoSegundos,
        registros,
        atualizadoEm: new Date().toISOString(),
        ...novoEstado,
      };

      if (store && typeof store.set === "function") {
        await store.set(CHAVE_STORAGE, payload);
      }
      localStorage.setItem(CHAVE_STORAGE, JSON.stringify(payload));
    } catch (err) {
      console.warn("Falha ao persistir ronda iButtons:", err);
    }
  };

  // Cronômetro em tempo real
  useEffect(() => {
    let intervalo = null;
    if (statusRonda === "em_andamento" && tsInicio) {
      intervalo = setInterval(() => {
        const seg = Math.max(0, Math.floor((Date.now() - tsInicio) / 1000));
        setDuracaoSegundos(seg);
      }, 1000);
    }
    return () => {
      if (intervalo) clearInterval(intervalo);
    };
  }, [statusRonda, tsInicio]);

  // Contadores gerais
  const totalPontos = TODOS_PONTOS_IBUTTONS.length; // 29
  const pontosBatidos = useMemo(() => {
    return TODOS_PONTOS_IBUTTONS.filter((p) => registros[p.numero]?.batido).length;
  }, [registros]);

  const porcentagemProgresso = totalPontos > 0 ? Math.round((pontosBatidos / totalPontos) * 100) : 0;

  const totalObservacoes = useMemo(() => {
    return Object.values(registros).filter((r) => r?.observacao && r.observacao.trim().length > 0).length;
  }, [registros]);

  // Ação: Iniciar Ronda
  const handleIniciarRonda = () => {
    const agora = new Date();
    const h = formatarHoraSimples(agora);
    const ts = agora.getTime();

    setStatusRonda("em_andamento");
    setHoraInicio(h);
    setTsInicio(ts);
    setHoraFim(null);
    setTsFim(null);
    setDuracaoSegundos(0);

    salvarEstado({
      statusRonda: "em_andamento",
      horaInicio: h,
      tsInicio: ts,
      horaFim: null,
      tsFim: null,
      duracaoSegundos: 0,
    });
  };

  // Ação: Finalizar Ronda
  const handleFinalizarRonda = () => {
    if (pontosBatidos < totalPontos) {
      const confirmou = window.confirm(
        `Atenção: você bateu ${pontosBatidos} de ${totalPontos} botons.\n\nDeseja encerrar e finalizar a ronda mesmo com pontos pendentes?`
      );
      if (!confirmou) return;
    }

    const agora = new Date();
    const h = formatarHoraSimples(agora);
    const ts = agora.getTime();
    const duracaoFinal = tsInicio ? Math.max(0, Math.floor((ts - tsInicio) / 1000)) : duracaoSegundos;

    setStatusRonda("finalizada");
    setHoraFim(h);
    setTsFim(ts);
    setDuracaoSegundos(duracaoFinal);

    salvarEstado({
      statusRonda: "finalizada",
      horaFim: h,
      tsFim: ts,
      duracaoSegundos: duracaoFinal,
    });
  };

  // Ação: Limpar / Nova Ronda
  const handleLimparNovaRonda = () => {
    const confirmou = window.confirm(
      "Deseja iniciar uma Nova Ronda?\n\nIsso resetará todos os pontos batidos, cronômetro e observações para o próximo turno."
    );
    if (!confirmou) return;

    setStatusRonda("nao_iniciada");
    setHoraInicio(null);
    setTsInicio(null);
    setHoraFim(null);
    setTsFim(null);
    setDuracaoSegundos(0);
    setRegistros({});
    setObsAberta(null);

    salvarEstado({
      statusRonda: "nao_iniciada",
      horaInicio: null,
      tsInicio: null,
      horaFim: null,
      tsFim: null,
      duracaoSegundos: 0,
      registros: {},
    });
  };

  // Ação: Alternar Batimento de Ponto
  const handleAlternarPonto = (ponto) => {
    const num = ponto.numero;
    const atual = registros[num];
    const agora = new Date();
    const horaAtual = formatarHoraSimples(agora);

    // Se a ronda ainda não foi iniciada, inicia automaticamente
    let novoStatusRonda = statusRonda;
    let novoHoraInicio = horaInicio;
    let novoTsInicio = tsInicio;
    if (statusRonda === "nao_iniciada") {
      novoStatusRonda = "em_andamento";
      novoHoraInicio = horaAtual;
      novoTsInicio = agora.getTime();
      setStatusRonda(novoStatusRonda);
      setHoraInicio(novoHoraInicio);
      setTsInicio(novoTsInicio);
    }

    let novosRegistros = { ...registros };

    if (atual?.batido) {
      // Se já está batido, pergunta ou desmarca
      novosRegistros[num] = {
        ...atual,
        batido: false,
        hora: null,
        ts: null,
      };
    } else {
      // Marca como batido com carimbo de hora
      try {
        if (navigator.vibrate) navigator.vibrate([30]);
      } catch {}

      novosRegistros[num] = {
        ...(atual || {}),
        batido: true,
        hora: horaAtual,
        ts: agora.getTime(),
        defeitoAnotado: ponto.defeito || false,
      };

      // Se for o ponto 23 com defeito e não tem observação, sugere nota padrão
      if (ponto.defeito && !atual?.observacao) {
        novosRegistros[num].observacao = "Vistoriado visualmente (boton caído/com defeito)";
      }
    }

    setRegistros(novosRegistros);
    salvarEstado({
      registros: novosRegistros,
      statusRonda: novoStatusRonda,
      horaInicio: novoHoraInicio,
      tsInicio: novoTsInicio,
    });
  };

  // Abrir caixa de observação
  const handleAbrirObs = (num) => {
    if (obsAberta === num) {
      setObsAberta(null);
    } else {
      setObsAberta(num);
      setTextoObsTemp(registros[num]?.observacao || "");
    }
  };

  // Salvar observação
  const handleSalvarObs = (num) => {
    const novosRegistros = {
      ...registros,
      [num]: {
        ...(registros[num] || {}),
        observacao: textoObsTemp.trim(),
      },
    };
    setRegistros(novosRegistros);
    setObsAberta(null);
    salvarEstado({ registros: novosRegistros });
  };

  // Adicionar sugestão de tag à observação
  const handleAdicionarTagObs = (tag) => {
    setTextoObsTemp((prev) => (prev ? `${prev} · ${tag}` : tag));
  };

  // Disparar impressão / PDF
  const handleDispararImpressao = () => {
    window.print();
  };

  // Data atual formatada para o relatório
  const dataHojeFormatada = useMemo(() => {
    return new Date().toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="flex flex-col gap-5 px-3 md:px-0 py-3 md:py-2">
      {/* ---------------- CABEÇALHO DA TELA ---------------- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "3px 9px",
                borderRadius: 999,
                background: cor.subBlocoVerde,
                color: cor.verdeNumero,
                border: `1px solid ${cor.subBlocoVerdeBorda}`,
              }}
            >
              Condomínio Nativ Tatuapé Garden Club
            </span>
            <span style={{ fontSize: 11, color: cor.textoSecundario }}>·</span>
            <span style={{ fontSize: 11, color: cor.textoSecundario, fontWeight: 600 }}>29 Pontos</span>
          </div>
          <h2
            style={{
              fontFamily: "'Space Grotesk', 'Outfit', sans-serif",
              fontSize: 26,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              marginTop: 4,
            }}
          >
            Ronda iButtons
          </h2>
          <p style={{ fontSize: 13, color: cor.textoSecundario, marginTop: 2 }}>
            Roteiro oficial de verificação predial. Carimbo automático de hora e registro de irregularidades.
          </p>
        </div>

        {/* Botões de Ação Rápida no Topo (Desktop / Tablet) */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => setMostrarModalPDF(true)}
            className="transition-transform duration-150 active:scale-95"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 16px",
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 700,
              background: cor.cartao,
              border: `1px solid ${cor.cartaoBorda}`,
              color: cor.textoPrincipal,
              boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
            }}
          >
            <span style={{ fontSize: 15 }}>📄</span>
            <span>Relatório em PDF</span>
          </button>

          <button
            type="button"
            onClick={handleLimparNovaRonda}
            className="transition-transform duration-150 active:scale-95"
            title="Resetar ronda para o próximo plantão"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "10px 14px",
              borderRadius: 14,
              fontSize: 13,
              fontWeight: 600,
              background: "rgba(239, 68, 68, 0.12)",
              border: "1px solid rgba(239, 68, 68, 0.28)",
              color: "#F87171",
            }}
          >
            <span style={{ fontSize: 14 }}>🔄</span>
            <span>Nova Ronda</span>
          </button>
        </div>
      </div>

      {/* ---------------- PAINEL DE CONTROLE DA RONDA ---------------- */}
      <div
        style={{
          borderRadius: 24,
          padding: "18px 20px",
          background: cor.cartao,
          border: `1px solid ${cor.cartaoBorda}`,
          boxShadow: cor.cartaoSombra,
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          display: "flex",
          flexDirection: "column",
          gap: 16,
        }}
      >
        {/* Linha 1: Responsável + Status da Ronda */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <label style={{ display: "block", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.1em", color: cor.textoSecundario, fontWeight: 700, marginBottom: 5 }}>
              👤 Responsável pela Ronda / Porteiro
            </label>
            <input
              type="text"
              value={responsavel}
              onChange={(e) => {
                setResponsavel(e.target.value);
                salvarEstado({ responsavel: e.target.value });
              }}
              placeholder="Nome do porteiro / vigilante"
              style={{
                width: "100%",
                maxWidth: 420,
                background: cor.inputBg,
                border: `1px solid ${cor.inputBorda}`,
                borderRadius: 12,
                padding: "9px 13px",
                fontSize: 13.5,
                fontWeight: 600,
                color: cor.textoPrincipal,
              }}
            />
          </div>

          {/* Status Badge */}
          <div className="flex items-center gap-2 self-start md:self-auto">
            {statusRonda === "nao_iniciada" && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(148, 163, 184, 0.16)",
                  border: "1px solid rgba(148, 163, 184, 0.3)",
                  color: cor.textoSecundario,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#94A3B8" }} />
                Aguardando Início
              </span>
            )}
            {statusRonda === "em_andamento" && (
              <span
                className="animate-pulse"
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(212, 175, 95, 0.22)",
                  border: "1px solid rgba(212, 175, 95, 0.5)",
                  color: cor.verdeNumero,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#22C55E" }} />
                Ronda em Andamento
              </span>
            )}
            {statusRonda === "finalizada" && (
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  padding: "6px 14px",
                  borderRadius: 999,
                  background: "rgba(34, 197, 94, 0.20)",
                  border: "1px solid rgba(34, 197, 94, 0.45)",
                  color: "#4ADE80",
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <span>✓</span>
                Ronda Finalizada
              </span>
            )}
          </div>
        </div>

        {/* Linha 2: Cronômetro + Horários + Botões Principais */}
        <div
          style={{
            borderRadius: 18,
            padding: "16px 18px",
            background: cor.subBlocoVerde,
            border: `1px solid ${cor.subBlocoVerdeBorda}`,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
            alignItems: "center",
          }}
        >
          {/* Cronômetro */}
          <div>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: cor.textoSecundario, fontWeight: 700 }}>
              ⏱️ Cronômetro da Ronda
            </span>
            <div
              style={{
                fontFamily: "'Space Grotesk', monospace",
                fontSize: 28,
                fontWeight: 700,
                color: cor.textoPrincipal,
                letterSpacing: "-0.01em",
                marginTop: 2,
              }}
            >
              {formatarDuracao(duracaoSegundos)}
            </div>
            <p style={{ fontSize: 11, color: cor.textoSecundario, margin: "2px 0 0" }}>
              Duração estimada de referência: ~2h00
              {duracaoSegundos > 7200 && (
                <span style={{ color: "#F87171", fontWeight: 700, marginLeft: 6 }}>
                  (Tempo de referência excedido)
                </span>
              )}
            </p>
          </div>

          {/* Horários Início e Fim */}
          <div className="flex gap-4">
            <div>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: cor.textoSecundario, fontWeight: 700 }}>
                Início
              </span>
              <p style={{ fontSize: 17, fontWeight: 700, color: cor.verdeNumero, margin: "2px 0 0" }}>
                {horaInicio || "--:--"}
              </p>
            </div>
            <div style={{ width: 1, background: cor.subBlocoVerdeBorda }} />
            <div>
              <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.12em", color: cor.textoSecundario, fontWeight: 700 }}>
                Término
              </span>
              <p style={{ fontSize: 17, fontWeight: 700, color: cor.textoPrincipal, margin: "2px 0 0" }}>
                {horaFim || "--:--"}
              </p>
            </div>
          </div>

          {/* Botões de Ação do Ciclo da Ronda */}
          <div className="flex gap-2 justify-end">
            {statusRonda !== "em_andamento" ? (
              <button
                type="button"
                onClick={handleIniciarRonda}
                className="transition-all duration-200 hover:scale-[1.02] active:scale-95"
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: 14,
                  fontSize: 13.5,
                  fontWeight: 700,
                  background: cor.verde,
                  color: cor.textoSobreVerde,
                  border: "none",
                  boxShadow: "0 4px 14px rgba(212, 175, 95, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span>▶</span>
                <span>{statusRonda === "finalizada" ? "Reiniciar Ronda" : "Iniciar Ronda"}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleFinalizarRonda}
                className="transition-all duration-200 hover:scale-[1.02] active:scale-95"
                style={{
                  flex: 1,
                  padding: "12px 20px",
                  borderRadius: 14,
                  fontSize: 13.5,
                  fontWeight: 700,
                  background: "#22C55E",
                  color: "#052E16",
                  border: "none",
                  boxShadow: "0 4px 14px rgba(34, 197, 94, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <span>⏹</span>
                <span>Finalizar Ronda</span>
              </button>
            )}
          </div>
        </div>

        {/* Linha 3: Barra de Progresso Geral */}
        <div>
          <div className="flex items-center justify-between" style={{ marginBottom: 6 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: cor.textoPrincipal }}>
              Progresso Geral: {pontosBatidos} de {totalPontos} batidos ({porcentagemProgresso}%)
            </span>
            {totalObservacoes > 0 && (
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  padding: "2px 8px",
                  borderRadius: 999,
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#F59E0B",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                }}
              >
                ⚠️ {totalObservacoes} irregularidade{totalObservacoes > 1 ? "s" : ""}
              </span>
            )}
          </div>

          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.12)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div
              style={{
                width: `${porcentagemProgresso}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #D4AF5F 0%, #22C55E 100%)",
                boxShadow: "0 0 12px rgba(212, 175, 95, 0.5)",
                transition: "width 0.4s ease-out",
              }}
            />
          </div>
        </div>

        {/* Linha 4: Filtros de Setores para Navegação Rápida no Celular */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
          <button
            type="button"
            onClick={() => setFiltroSetor("todos")}
            style={{
              padding: "6px 12px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: filtroSetor === "todos" ? 700 : 500,
              background: filtroSetor === "todos" ? cor.verde : "transparent",
              color: filtroSetor === "todos" ? cor.textoSobreVerde : cor.textoSecundario,
              border: filtroSetor === "todos" ? "none" : `1px solid ${cor.cartaoBorda}`,
              whiteSpace: "nowrap",
            }}
          >
            Todos ({pontosBatidos}/{totalPontos})
          </button>
          {SETORES_IBUTTONS.map((s) => {
            const batidosSetor = s.pontos.filter((p) => registros[p.numero]?.batido).length;
            const totalSetor = s.pontos.length;
            const ativo = filtroSetor === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => setFiltroSetor(s.id)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 10,
                  fontSize: 12,
                  fontWeight: ativo ? 700 : 500,
                  background: ativo ? cor.verde : "transparent",
                  color: ativo ? cor.textoSobreVerde : cor.textoSecundario,
                  border: ativo ? "none" : `1px solid ${cor.cartaoBorda}`,
                  whiteSpace: "nowrap",
                }}
              >
                S{s.numero} ({batidosSetor}/{totalSetor})
              </button>
            );
          })}
        </div>
      </div>

      {/* ---------------- LISTAGEM DOS PONTOS POR SETOR ---------------- */}
      <div className="flex flex-col gap-6">
        {SETORES_IBUTTONS.filter((s) => filtroSetor === "todos" || filtroSetor === s.id).map((setor) => {
          const batidosSetor = setor.pontos.filter((p) => registros[p.numero]?.batido).length;
          const completo = batidosSetor === setor.pontos.length;

          return (
            <div key={setor.id} className="flex flex-col gap-2.5">
              {/* Título do Setor */}
              <div className="flex items-center justify-between px-1">
                <div>
                  <h3
                    style={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: cor.textoPrincipal,
                      textTransform: "uppercase",
                    }}
                  >
                    {setor.nome}
                  </h3>
                  <p style={{ fontSize: 11.5, color: cor.textoSecundario, marginTop: 1 }}>
                    {setor.subtitulo}
                  </p>
                </div>
                <span
                  style={{
                    fontSize: 11.5,
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: 999,
                    background: completo ? "rgba(34, 197, 94, 0.18)" : cor.subBlocoVerde,
                    color: completo ? "#4ADE80" : cor.verdeNumero,
                    border: `1px solid ${completo ? "rgba(34, 197, 94, 0.35)" : cor.subBlocoVerdeBorda}`,
                  }}
                >
                  {batidosSetor}/{setor.pontos.length} batidos
                </span>
              </div>

              {/* Cards dos Pontos no Setor */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {setor.pontos.map((ponto) => {
                  const reg = registros[ponto.numero];
                  const estaBatido = !!reg?.batido;
                  const temObs = !!(reg?.observacao && reg.observacao.trim().length > 0);
                  const isPonto23 = ponto.numero === 23;

                  return (
                    <div
                      key={ponto.numero}
                      className="transition-all duration-200"
                      style={{
                        borderRadius: 18,
                        padding: "14px 16px",
                        background: isPonto23
                          ? "rgba(239, 68, 68, 0.08)"
                          : estaBatido
                          ? "rgba(212, 175, 95, 0.08)"
                          : cor.cartao,
                        border: isPonto23
                          ? "1.5px solid rgba(239, 68, 68, 0.45)"
                          : estaBatido
                          ? `1.5px solid rgba(212, 175, 95, 0.45)`
                          : `1px solid ${cor.cartaoBorda}`,
                        backdropFilter: "blur(14px)",
                        WebkitBackdropFilter: "blur(14px)",
                        display: "flex",
                        flexDirection: "column",
                        gap: 10,
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Botão de Batimento / Contador Redondo */}
                        <button
                          type="button"
                          onClick={() => handleAlternarPonto(ponto)}
                          className="transition-transform duration-150 active:scale-90 shrink-0"
                          title={estaBatido ? "Clique para desmarcar ou atualizar" : "Marcar como batido"}
                          style={{
                            width: 44,
                            height: 44,
                            borderRadius: 14,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            background: estaBatido
                              ? "linear-gradient(135deg, #E2C47F 0%, #A67C2E 100%)"
                              : isPonto23
                              ? "rgba(239, 68, 68, 0.16)"
                              : cor.subBlocoVerde,
                            border: estaBatido
                              ? "none"
                              : isPonto23
                              ? "1.5px dashed rgba(239, 68, 68, 0.6)"
                              : `1.5px solid ${cor.subBlocoVerdeBorda}`,
                            color: estaBatido ? "#18140C" : isPonto23 ? "#F87171" : cor.textoPrincipal,
                            boxShadow: estaBatido ? "0 4px 12px rgba(212, 175, 95, 0.35)" : "none",
                            cursor: "pointer",
                          }}
                        >
                          {estaBatido ? (
                            <>
                              <span style={{ fontSize: 13, fontWeight: 800 }}>✓</span>
                              <span style={{ fontSize: 9.5, fontWeight: 700, lineHeight: 1 }}>{reg.hora}</span>
                            </>
                          ) : (
                            <>
                              <span style={{ fontSize: 15, fontWeight: 800 }}>{ponto.numero}</span>
                              <span style={{ fontSize: 8, fontWeight: 700, opacity: 0.9, textTransform: "uppercase" }}>
                                {isPonto23 ? "Vistoria" : "Ler"}
                              </span>
                            </>
                          )}
                        </button>

                        {/* Informações do Ponto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span style={{ fontSize: 11, fontWeight: 700, color: cor.verdeNumero }}>
                              Ponto #{ponto.numero}
                            </span>
                            {ponto.inativo && (
                              <span
                                style={{
                                  fontSize: 9.5,
                                  fontWeight: 700,
                                  padding: "2px 6px",
                                  borderRadius: 6,
                                  background: "rgba(148, 163, 184, 0.18)",
                                  color: cor.textoSecundario,
                                }}
                              >
                                Inativo / Bater
                              </span>
                            )}
                            {isPonto23 && (
                              <span
                                style={{
                                  fontSize: 9.5,
                                  fontWeight: 800,
                                  padding: "2px 7px",
                                  borderRadius: 6,
                                  background: "rgba(239, 68, 68, 0.2)",
                                  color: "#F87171",
                                  border: "1px solid rgba(239, 68, 68, 0.4)",
                                }}
                              >
                                ■ BOTON CAÍDO / DEFEITO
                              </span>
                            )}
                            {estaBatido && (
                              <span
                                style={{
                                  fontSize: 10,
                                  fontWeight: 700,
                                  color: "#22C55E",
                                  marginLeft: "auto",
                                }}
                              >
                                Batido às {reg.hora}
                              </span>
                            )}
                          </div>

                          <p
                            style={{
                              fontSize: 14,
                              fontWeight: 700,
                              color: cor.textoPrincipal,
                              marginTop: 2,
                              lineHeight: 1.25,
                            }}
                          >
                            {ponto.local}
                          </p>

                          <p
                            style={{
                              fontSize: 12,
                              color: isPonto23 ? "#FCA5A5" : cor.textoSecundario,
                              marginTop: 3,
                              lineHeight: 1.4,
                            }}
                          >
                            {ponto.detalhe}
                          </p>

                          {isPonto23 && (
                            <div style={{ marginTop: 8 }}>
                              <button
                                type="button"
                                onClick={() => handleAlternarPonto(ponto)}
                                className="transition-transform active:scale-95"
                                style={{
                                  width: "100%",
                                  padding: "8px 12px",
                                  borderRadius: 10,
                                  fontSize: 12,
                                  fontWeight: 700,
                                  background: estaBatido ? "rgba(34, 197, 94, 0.2)" : "rgba(239, 68, 68, 0.2)",
                                  border: estaBatido ? "1px solid rgba(34, 197, 94, 0.4)" : "1px solid rgba(239, 68, 68, 0.4)",
                                  color: estaBatido ? "#4ADE80" : "#F87171",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  gap: 6,
                                }}
                              >
                                <span>{estaBatido ? `✓ Vistoria Visual Realizada (${reg.hora})` : "👁️ Registrar Vistoria Visual"}</span>
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Botão de Observações / Irregularidade */}
                      <div className="flex items-center justify-between pt-1 border-t border-white/5">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          {temObs && (
                            <span
                              style={{
                                fontSize: 11,
                                color: "#F59E0B",
                                fontWeight: 600,
                                display: "flex",
                                alignItems: "center",
                                gap: 4,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              <span>📝</span> {reg.observacao}
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => handleAbrirObs(ponto.numero)}
                          className="transition-transform active:scale-95"
                          style={{
                            fontSize: 11.5,
                            fontWeight: 700,
                            padding: "5px 10px",
                            borderRadius: 8,
                            background: temObs ? "rgba(245, 158, 11, 0.15)" : cor.subBlocoVerde,
                            color: temObs ? "#F59E0B" : cor.verdeNumero,
                            border: temObs
                              ? "1px solid rgba(245, 158, 11, 0.35)"
                              : `1px solid ${cor.subBlocoVerdeBorda}`,
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            flexShrink: 0,
                          }}
                        >
                          <span>{temObs ? "Editar Obs" : "+ Obs"}</span>
                        </button>
                      </div>

                      {/* Caixa de Digitação de Observações (Inline) */}
                      {obsAberta === ponto.numero && (
                        <div
                          className="animate-fade-in"
                          style={{
                            marginTop: 4,
                            padding: 12,
                            borderRadius: 14,
                            background: cor.inputBg,
                            border: `1px solid ${cor.inputBorda}`,
                            display: "flex",
                            flexDirection: "column",
                            gap: 8,
                          }}
                        >
                          <span style={{ fontSize: 11, fontWeight: 700, color: cor.verdeNumero }}>
                            Anotar Irregularidade / Observação no Ponto #{ponto.numero}:
                          </span>

                          {/* Sugestões Rápidas de 1 toque */}
                          <div className="flex flex-wrap gap-1.5">
                            {SUGESTOES_OBSERVACOES.map((sugestao) => (
                              <button
                                key={sugestao}
                                type="button"
                                onClick={() => handleAdicionarTagObs(sugestao)}
                                style={{
                                  fontSize: 10.5,
                                  fontWeight: 600,
                                  padding: "3px 8px",
                                  borderRadius: 999,
                                  background: "rgba(255, 255, 255, 0.08)",
                                  border: "1px solid rgba(255, 255, 255, 0.12)",
                                  color: cor.textoPrincipal,
                                }}
                              >
                                + {sugestao}
                              </button>
                            ))}
                          </div>

                          <textarea
                            value={textoObsTemp}
                            onChange={(e) => setTextoObsTemp(e.target.value)}
                            placeholder="Descreva o que encontrou (ex: porta destrancada, lâmpada queimada, extintor vencido...)"
                            rows={2}
                            style={{
                              width: "100%",
                              background: "rgba(0,0,0,0.2)",
                              border: `1px solid ${cor.inputBorda}`,
                              borderRadius: 10,
                              padding: "8px 10px",
                              fontSize: 12.5,
                              color: cor.textoPrincipal,
                              resize: "vertical",
                            }}
                          />

                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => setObsAberta(null)}
                              style={{
                                padding: "6px 12px",
                                borderRadius: 8,
                                fontSize: 11.5,
                                color: cor.textoSecundario,
                                background: "transparent",
                              }}
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSalvarObs(ponto.numero)}
                              style={{
                                padding: "6px 14px",
                                borderRadius: 8,
                                fontSize: 11.5,
                                fontWeight: 700,
                                background: cor.verde,
                                color: cor.textoSobreVerde,
                              }}
                            >
                              Salvar Observação
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* ---------------- MODAL DE PREVIEW E IMPRESSÃO DO RELATÓRIO PDF ---------------- */}
      {mostrarModalPDF && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto no-print"
          style={{
            background: "rgba(0, 0, 0, 0.75)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 16,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 820,
              maxHeight: "90vh",
              overflowY: "auto",
              background: tema === "light" ? "#FFFFFF" : "#18160F",
              borderRadius: 24,
              border: `1px solid ${cor.cartaoBorda}`,
              padding: "24px 22px",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)",
              display: "flex",
              flexDirection: "column",
              gap: 16,
            }}
          >
            {/* Topo do Modal */}
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span style={{ fontSize: 22 }}>📄</span>
                <div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: cor.textoPrincipal }}>
                    Relatório Oficial de Ronda iButtons
                  </h3>
                  <p style={{ fontSize: 12, color: cor.textoSecundario }}>
                    Pré-visualização para impressão e geração de arquivo PDF
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDispararImpressao}
                  className="transition-transform active:scale-95"
                  style={{
                    padding: "9px 18px",
                    borderRadius: 12,
                    fontSize: 13,
                    fontWeight: 700,
                    background: cor.verde,
                    color: cor.textoSobreVerde,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    boxShadow: "0 2px 10px rgba(212, 175, 95, 0.4)",
                  }}
                >
                  <span>🖨️</span>
                  <span>Imprimir / Salvar PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMostrarModalPDF(false)}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 10,
                    background: cor.inputBg,
                    border: `1px solid ${cor.inputBorda}`,
                    color: cor.textoSecundario,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 16,
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Preview Documento Formal (Emulado em folha branca) */}
            <div
              style={{
                background: "#FFFFFF",
                color: "#111827",
                borderRadius: 12,
                padding: "24px 20px",
                fontFamily: "Arial, sans-serif",
                boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                overflowX: "auto",
              }}
            >
              {/* Cabeçalho */}
              <div style={{ textAlign: "center", borderBottom: "2px solid #111827", paddingBottom: 14, marginBottom: 16 }}>
                <h1 style={{ fontSize: 18, fontWeight: 800, textTransform: "uppercase", margin: 0, letterSpacing: "0.04em", color: "#111827" }}>
                  ROTEIRO DE RONDA NOTURNA — RELATÓRIO DE EXECUÇÃO
                </h1>
                <p style={{ fontSize: 13, fontWeight: 700, margin: "4px 0 0", color: "#4B5563" }}>
                  Condomínio Nativ Tatuapé Garden Club · Sistema Líder Amigona
                </p>
                <p style={{ fontSize: 11, color: "#6B7280", margin: "2px 0 0" }}>
                  Rua Coronel Gustavo Santiago, 100 · Tatuapé · São Paulo/SP
                </p>
              </div>

              {/* Tabela Resumo */}
              <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16, fontSize: 12 }}>
                <tbody>
                  <tr>
                    <td style={{ padding: "6px 8px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #D1D5DB", width: "20%" }}>
                      Data da Ronda:
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #D1D5DB", width: "30%" }}>
                      {dataHojeFormatada}
                    </td>
                    <td style={{ padding: "6px 8px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #D1D5DB", width: "20%" }}>
                      Responsável:
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #D1D5DB", width: "30%" }}>
                      {responsavel || "Não informado"}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 8px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #D1D5DB" }}>
                      Horário Início:
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #D1D5DB" }}>
                      {horaInicio || "Não registrado"}
                    </td>
                    <td style={{ padding: "6px 8px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #D1D5DB" }}>
                      Horário Término:
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #D1D5DB" }}>
                      {horaFim || (statusRonda === "em_andamento" ? "Em andamento..." : "Não registrado")}
                    </td>
                  </tr>
                  <tr>
                    <td style={{ padding: "6px 8px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #D1D5DB" }}>
                      Duração Total:
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #D1D5DB" }}>
                      {formatarDuracao(duracaoSegundos)}
                    </td>
                    <td style={{ padding: "6px 8px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #D1D5DB" }}>
                      Pontos Batidos:
                    </td>
                    <td style={{ padding: "6px 8px", border: "1px solid #D1D5DB", fontWeight: 700, color: pontosBatidos === totalPontos ? "#15803D" : "#B45309" }}>
                      {pontosBatidos} de {totalPontos} ({porcentagemProgresso}%)
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Seção em Destaque: Anormalidades & Observações */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ background: "#FEF3C7", border: "1px solid #F59E0B", borderRadius: 6, padding: "8px 12px", marginBottom: 6 }}>
                  <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#92400E", margin: 0 }}>
                    ⚠️ Anormalidades & Observações do Trajeto
                  </h4>
                </div>
                {totalObservacoes === 0 ? (
                  <p style={{ fontSize: 11.5, color: "#4B5563", fontStyle: "italic", margin: "6px 0 0" }}>
                    Nenhuma anormalidade ou irregularidade anotada durante a ronda.
                  </p>
                ) : (
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11.5 }}>
                    <thead>
                      <tr style={{ background: "#F9FAFB" }}>
                        <th style={{ border: "1px solid #D1D5DB", padding: "5px 8px", width: "45px", textAlign: "center" }}>Nº</th>
                        <th style={{ border: "1px solid #D1D5DB", padding: "5px 8px", textAlign: "left" }}>Local / Setor</th>
                        <th style={{ border: "1px solid #D1D5DB", padding: "5px 8px", width: "70px", textAlign: "center" }}>Horário</th>
                        <th style={{ border: "1px solid #D1D5DB", padding: "5px 8px", textAlign: "left" }}>Irregularidade / Observação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {TODOS_PONTOS_IBUTTONS.filter((p) => registros[p.numero]?.observacao?.trim()).map((p) => (
                        <tr key={p.numero}>
                          <td style={{ border: "1px solid #D1D5DB", padding: "5px 8px", textAlign: "center", fontWeight: 700 }}>
                            #{p.numero}
                          </td>
                          <td style={{ border: "1px solid #D1D5DB", padding: "5px 8px" }}>
                            <strong>{p.local}</strong>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>{p.setorNome}</div>
                          </td>
                          <td style={{ border: "1px solid #D1D5DB", padding: "5px 8px", textAlign: "center" }}>
                            {registros[p.numero]?.hora || "--:--"}
                          </td>
                          <td style={{ border: "1px solid #D1D5DB", padding: "5px 8px", color: "#B91C1C", fontWeight: 600 }}>
                            {registros[p.numero]?.observacao}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>

              {/* Tabela Completa Ponto a Ponto */}
              <div style={{ marginBottom: 20 }}>
                <h4 style={{ fontSize: 12, fontWeight: 800, textTransform: "uppercase", color: "#111827", margin: "0 0 6px 0", borderBottom: "1px solid #D1D5DB", paddingBottom: 4 }}>
                  Tabela Geral de Verificação dos 29 Pontos
                </h4>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                  <thead>
                    <tr style={{ background: "#F3F4F6" }}>
                      <th style={{ border: "1px solid #D1D5DB", padding: "4px 6px", width: "35px", textAlign: "center" }}>Nº</th>
                      <th style={{ border: "1px solid #D1D5DB", padding: "4px 6px", textAlign: "left" }}>Local & Descrição</th>
                      <th style={{ border: "1px solid #D1D5DB", padding: "4px 6px", width: "110px", textAlign: "center" }}>Status</th>
                      <th style={{ border: "1px solid #D1D5DB", padding: "4px 6px", width: "65px", textAlign: "center" }}>Hora</th>
                      <th style={{ border: "1px solid #D1D5DB", padding: "4px 6px", textAlign: "left" }}>Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {TODOS_PONTOS_IBUTTONS.map((p) => {
                      const reg = registros[p.numero];
                      const batido = reg?.batido;
                      const isPonto23 = p.numero === 23;

                      let statusTexto = "NÃO LIDO";
                      let statusCor = "#DC2626";
                      if (batido) {
                        statusTexto = isPonto23 ? "VISTORIA VISUAL" : "BATIDO (OK)";
                        statusCor = isPonto23 ? "#D97706" : "#16A34A";
                      } else if (isPonto23) {
                        statusTexto = "BOTON DEFEITO";
                        statusCor = "#DC2626";
                      }

                      return (
                        <tr key={p.numero} style={{ background: batido ? "#FFFFFF" : "#FEF2F2" }}>
                          <td style={{ border: "1px solid #D1D5DB", padding: "4px 6px", textAlign: "center", fontWeight: 700 }}>
                            {p.numero}
                          </td>
                          <td style={{ border: "1px solid #D1D5DB", padding: "4px 6px" }}>
                            <div style={{ fontWeight: 600 }}>{p.local}</div>
                            <div style={{ fontSize: 10, color: "#6B7280" }}>{p.detalhe}</div>
                          </td>
                          <td style={{ border: "1px solid #D1D5DB", padding: "4px 6px", textAlign: "center", fontWeight: 700, color: statusCor }}>
                            {statusTexto}
                          </td>
                          <td style={{ border: "1px solid #D1D5DB", padding: "4px 6px", textAlign: "center", fontWeight: 600 }}>
                            {reg?.hora || "--:--"}
                          </td>
                          <td style={{ border: "1px solid #D1D5DB", padding: "4px 6px", color: reg?.observacao ? "#B91C1C" : "#6B7280" }}>
                            {reg?.observacao || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Assinaturas */}
              <div style={{ marginTop: 32, paddingTop: 16, borderTop: "1px solid #D1D5DB", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, textAlign: "center" }}>
                <div>
                  <div style={{ borderBottom: "1px solid #111827", height: 35, width: "85%", margin: "0 auto 6px" }} />
                  <p style={{ fontSize: 11.5, fontWeight: 700, margin: 0 }}>
                    {responsavel || "Colaborador da Ronda"}
                  </p>
                  <p style={{ fontSize: 10, color: "#6B7280", margin: "1px 0 0" }}>
                    Assinatura do Colaborador (Ronda)
                  </p>
                </div>
                <div>
                  <div style={{ borderBottom: "1px solid #111827", height: 35, width: "85%", margin: "0 auto 6px" }} />
                  <p style={{ fontSize: 11.5, fontWeight: 700, margin: 0 }}>
                    Líder de Portaria / Supervisão
                  </p>
                  <p style={{ fontSize: 10, color: "#6B7280", margin: "1px 0 0" }}>
                    Visto da Supervisão Predial
                  </p>
                </div>
              </div>
            </div>

            {/* Rodapé do Modal */}
            <div className="flex justify-between items-center pt-2">
              <span style={{ fontSize: 12, color: cor.textoSecundario }}>
                Pressione "Imprimir / Salvar PDF" para gerar o documento via navegador.
              </span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMostrarModalPDF(false)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontSize: 13,
                    color: cor.textoSecundario,
                  }}
                >
                  Fechar
                </button>
                <button
                  type="button"
                  onClick={handleDispararImpressao}
                  style={{
                    padding: "8px 18px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    background: cor.verde,
                    color: cor.textoSobreVerde,
                  }}
                >
                  Imprimir / Salvar PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------- CONTAINER EXCLUSIVO DE IMPRESSÃO (Renderizado no body via Portal para impressão limpa) ---------------- */}
      {typeof document !== "undefined" && createPortal(
        <div id="relatorio-impressao-ronda">
          {/* Cabeçalho */}
          <div style={{ textAlign: "center", borderBottom: "2px solid #111827", paddingBottom: 12, marginBottom: 14 }}>
            <h1 style={{ fontSize: 17, fontWeight: 800, textTransform: "uppercase", margin: 0, letterSpacing: "0.04em", color: "#111827" }}>
              ROTEIRO DE RONDA NOTURNA — RELATÓRIO DE EXECUÇÃO
            </h1>
            <p style={{ fontSize: 12.5, fontWeight: 700, margin: "3px 0 0", color: "#374151" }}>
              Condomínio Nativ Tatuapé Garden Club · Sistema Líder Amigona
            </p>
            <p style={{ fontSize: 10.5, color: "#6B7280", margin: "1px 0 0" }}>
              Rua Coronel Gustavo Santiago, 100 · Tatuapé · São Paulo/SP
            </p>
          </div>

          {/* Tabela Resumo */}
          <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 14, fontSize: 11 }}>
            <tbody>
              <tr>
                <td style={{ padding: "5px 7px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #9CA3AF", width: "18%" }}>
                  Data da Ronda:
                </td>
                <td style={{ padding: "5px 7px", border: "1px solid #9CA3AF", width: "32%" }}>
                  {dataHojeFormatada}
                </td>
                <td style={{ padding: "5px 7px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #9CA3AF", width: "18%" }}>
                  Responsável:
                </td>
                <td style={{ padding: "5px 7px", border: "1px solid #9CA3AF", width: "32%" }}>
                  {responsavel || "Não informado"}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 7px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #9CA3AF" }}>
                  Horário Início:
                </td>
                <td style={{ padding: "5px 7px", border: "1px solid #9CA3AF" }}>
                  {horaInicio || "Não registrado"}
                </td>
                <td style={{ padding: "5px 7px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #9CA3AF" }}>
                  Horário Término:
                </td>
                <td style={{ padding: "5px 7px", border: "1px solid #9CA3AF" }}>
                  {horaFim || (statusRonda === "em_andamento" ? "Em andamento..." : "Não registrado")}
                </td>
              </tr>
              <tr>
                <td style={{ padding: "5px 7px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #9CA3AF" }}>
                  Duração Total:
                </td>
                <td style={{ padding: "5px 7px", border: "1px solid #9CA3AF" }}>
                  {formatarDuracao(duracaoSegundos)}
                </td>
                <td style={{ padding: "5px 7px", background: "#F3F4F6", fontWeight: 700, border: "1px solid #9CA3AF" }}>
                  Pontos Batidos:
                </td>
                <td style={{ padding: "5px 7px", border: "1px solid #9CA3AF", fontWeight: 700 }}>
                  {pontosBatidos} de {totalPontos} ({porcentagemProgresso}%) · {totalObservacoes} irregularidade(s)
                </td>
              </tr>
            </tbody>
          </table>

          {/* Anormalidades & Observações do Trajeto */}
          <div style={{ marginBottom: 14 }}>
            <div style={{ background: "#FEF3C7", border: "1px solid #F59E0B", padding: "6px 10px", marginBottom: 6 }}>
              <h4 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#92400E", margin: 0 }}>
                ⚠️ Anormalidades & Observações do Trajeto
              </h4>
            </div>
            {totalObservacoes === 0 ? (
              <p style={{ fontSize: 10.5, color: "#4B5563", fontStyle: "italic", margin: "4px 0 0" }}>
                Nenhuma anormalidade ou irregularidade anotada durante a ronda.
              </p>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10.5 }}>
                <thead>
                  <tr style={{ background: "#F9FAFB" }}>
                    <th style={{ border: "1px solid #9CA3AF", padding: "4px 6px", width: "40px", textAlign: "center" }}>Nº</th>
                    <th style={{ border: "1px solid #9CA3AF", padding: "4px 6px", textAlign: "left" }}>Local / Setor</th>
                    <th style={{ border: "1px solid #9CA3AF", padding: "4px 6px", width: "65px", textAlign: "center" }}>Horário</th>
                    <th style={{ border: "1px solid #9CA3AF", padding: "4px 6px", textAlign: "left" }}>Irregularidade / Observação</th>
                  </tr>
                </thead>
                <tbody>
                  {TODOS_PONTOS_IBUTTONS.filter((p) => registros[p.numero]?.observacao?.trim()).map((p) => (
                    <tr key={p.numero}>
                      <td style={{ border: "1px solid #9CA3AF", padding: "4px 6px", textAlign: "center", fontWeight: 700 }}>
                        #{p.numero}
                      </td>
                      <td style={{ border: "1px solid #9CA3AF", padding: "4px 6px" }}>
                        <strong>{p.local}</strong> ({p.setorNome})
                      </td>
                      <td style={{ border: "1px solid #9CA3AF", padding: "4px 6px", textAlign: "center" }}>
                        {registros[p.numero]?.hora || "--:--"}
                      </td>
                      <td style={{ border: "1px solid #9CA3AF", padding: "4px 6px", fontWeight: 700, color: "#B91C1C" }}>
                        {registros[p.numero]?.observacao}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Tabela dos 29 Pontos */}
          <div style={{ marginBottom: 18 }}>
            <h4 style={{ fontSize: 11, fontWeight: 800, textTransform: "uppercase", color: "#111827", margin: "0 0 5px 0", borderBottom: "1px solid #9CA3AF", paddingBottom: 3 }}>
              Tabela Completa de Verificação dos 29 Pontos de iButtons
            </h4>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 10 }}>
              <thead>
                <tr style={{ background: "#F3F4F6" }}>
                  <th style={{ border: "1px solid #9CA3AF", padding: "4px 5px", width: "30px", textAlign: "center" }}>Nº</th>
                  <th style={{ border: "1px solid #9CA3AF", padding: "4px 5px", textAlign: "left" }}>Local & Descrição</th>
                  <th style={{ border: "1px solid #9CA3AF", padding: "4px 5px", width: "95px", textAlign: "center" }}>Status</th>
                  <th style={{ border: "1px solid #9CA3AF", padding: "4px 5px", width: "55px", textAlign: "center" }}>Hora</th>
                  <th style={{ border: "1px solid #9CA3AF", padding: "4px 5px", textAlign: "left" }}>Observações</th>
                </tr>
              </thead>
              <tbody>
                {TODOS_PONTOS_IBUTTONS.map((p) => {
                  const reg = registros[p.numero];
                  const batido = reg?.batido;
                  const isPonto23 = p.numero === 23;

                  let statusTexto = "NÃO LIDO";
                  if (batido) {
                    statusTexto = isPonto23 ? "VISTORIA VISUAL" : "BATIDO (OK)";
                  } else if (isPonto23) {
                    statusTexto = "BOTON DEFEITO";
                  }

                  return (
                    <tr key={p.numero}>
                      <td style={{ border: "1px solid #9CA3AF", padding: "3px 5px", textAlign: "center", fontWeight: 700 }}>
                        {p.numero}
                      </td>
                      <td style={{ border: "1px solid #9CA3AF", padding: "3px 5px" }}>
                        <span style={{ fontWeight: 600 }}>{p.local}</span>
                        <span style={{ color: "#4B5563" }}> — {p.detalhe}</span>
                      </td>
                      <td style={{ border: "1px solid #9CA3AF", padding: "3px 5px", textAlign: "center", fontWeight: 700 }}>
                        {statusTexto}
                      </td>
                      <td style={{ border: "1px solid #9CA3AF", padding: "3px 5px", textAlign: "center" }}>
                        {reg?.hora || "--:--"}
                      </td>
                      <td style={{ border: "1px solid #9CA3AF", padding: "3px 5px" }}>
                        {reg?.observacao || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Assinaturas */}
          <div style={{ marginTop: 24, paddingTop: 12, borderTop: "1px solid #9CA3AF", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 30, textAlign: "center", pageBreakInside: "avoid" }}>
            <div>
              <div style={{ borderBottom: "1px solid #111827", height: 30, width: "80%", margin: "0 auto 5px" }} />
              <p style={{ fontSize: 11, fontWeight: 700, margin: 0 }}>
                {responsavel || "Colaborador da Ronda"}
              </p>
              <p style={{ fontSize: 9.5, color: "#4B5563", margin: "1px 0 0" }}>
                Assinatura do Colaborador (Ronda)
              </p>
            </div>
            <div>
              <div style={{ borderBottom: "1px solid #111827", height: 30, width: "80%", margin: "0 auto 5px" }} />
              <p style={{ fontSize: 11, fontWeight: 700, margin: 0 }}>
                Líder de Portaria / Supervisão
              </p>
              <p style={{ fontSize: 9.5, color: "#4B5563", margin: "1px 0 0" }}>
                Visto da Supervisão Predial
              </p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
