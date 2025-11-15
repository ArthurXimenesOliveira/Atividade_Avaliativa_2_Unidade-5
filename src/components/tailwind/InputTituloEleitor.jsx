import React, { useState } from 'react';

export default function InputTituloEleitor({ placeholder }) {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState("");

  function handleChange(e) {
    let novoValor = e.target.value;

    // Remove tudo que não for número
    const apenasNumeros = novoValor.replace(/\D/g, "");

    // Limita a 12 dígitos (formato do título de eleitor)
    const valorLimitado = apenasNumeros.slice(0, 12);

    setValor(valorLimitado);

    // Validação simples: o título deve ter 12 dígitos
    if (valorLimitado.length < 12) {
      setErro("O título de eleitor deve conter 12 dígitos.");
    } else {
      setErro("");
    }
  }

  return (
    <div className="flex flex-col mb-3">
      <input
        type="text"
        inputMode="numeric"
        placeholder={placeholder}
        value={valor}
        onChange={handleChange}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-400 outline-none ${
          erro ? "border-red-500" : "border-gray-300"
        }`}
      />
      {erro && (
        <p className="text-sm text-red-600 mt-1">
          ⚠️ {erro}
        </p>
      )}
    </div>
  );
}
