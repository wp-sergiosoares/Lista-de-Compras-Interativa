import { useEffect, useState } from "react";

export default function useTarefas() {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem("items");
    return saved ? JSON.parse(saved) : [];
  });
  const [nrConcluidas, setNrConcluidas] = useState("");
  const [nrPendentes, setNrPendentes] = useState("");
  const [filtro, setFiltro] = useState("todos");

  // Atualiza o localStorage sempre que 'todos' mudar
  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));

    const filtraConcluidas = items.filter((item) => item.bought);
    setNrConcluidas(filtraConcluidas.length);
    const filtraPendentes = items.filter((item) => !item.bought);
    setNrPendentes(filtraPendentes.length);
  }, [items]);

  const itensFiltrados = [...items]
    .sort((a, b) => a.bought - b.bought)
    .filter((item) => {
      if (filtro === "todos") return true;
      if (filtro === "concluidos") return item.bought;
      if (filtro === "pendentes") return !item.bought;
    });

  const addItem = (item) => {
    const newItem = {
      id: Date.now(),
      item,
      bought: false,
    };
    setItems([newItem, ...items]);
  };

  const removeItem = (id) => {
    // rmeove da lista
    setItems(items.filter((item) => item.id !== id));
  };

  const marcaConcluido = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, bought: !item.bought } : item
      )
    );
  };

  function diasDesde(timestamp) {
    const agora = Date.now();
    const diffMs = agora - timestamp;
    const msPorDia = 1000 * 60 * 60 * 24;
    return Math.floor(diffMs / msPorDia);
  }

  return {
    marcaConcluido,
    removeItem,
    addItem,
    itensFiltrados,
    nrConcluidas,
    nrPendentes,
    setNrConcluidas,
    setNrPendentes,
    filtro,
    setFiltro,
    diasDesde,
  };
}
