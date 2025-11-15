import React, { useState } from 'react';

export default function InputTelefone({ placeholder }) {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState("");

  function handleChange(e) {
    const novoValor = e.target.value;

    // Mantém apenas números
    const apenasNumeros = novoValor.replace(/\D/g, "");

    // Formata como (XX) XXXXX-XXXX ou (XX) XXXX-XXXX dependendo do tamanho
    let formatado = apenasNumeros;
    if (apenasNumeros.length <= 10) {
      formatado = apenasNumeros.replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3");
    } else {
      formatado = apenasNumeros.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
    }

    setValor(formatado);

    // Validação simples: precisa ter pelo menos 10 ou 11 dígitos
    if (apenasNumeros.length < 10 || apenasNumeros.length > 11) {
      setErro("Número de telefone inválido.");
    } else {
      setErro("");
    }
  }

  return (
    <div className="flex flex-col mb-3">
      <input
        type="tel"
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
