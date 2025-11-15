import React, { useState } from 'react';

export default function InputEndereco({ placeholder }) {
  const [valor, setValor] = useState("");
  const [erro, setErro] = useState(false);

  function handleChange(e) {
    const novoValor = e.target.value;
    setValor(novoValor);
    setErro(novoValor.trim() === ""); // Verifica se o campo está vazio
  }

  return (
    <div className="flex flex-col mb-3">
      <input
        type="text"
        placeholder={placeholder}
        value={valor}
        onChange={handleChange}
        className={`w-full px-3 py-2 text-sm border rounded-md focus:border-blue-600 focus:ring-1 focus:ring-blue-400 outline-none ${
          erro ? "border-red-500" : "border-gray-300"
        }`}
      />
      {erro && (
        <p className="text-sm text-red-600 mt-1">
          ⚠️ O campo de endereço não pode ficar vazio.
        </p>
      )}
    </div>
  );
}
