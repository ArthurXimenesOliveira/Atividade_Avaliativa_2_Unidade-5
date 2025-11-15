import React from "react";

import Label from "./Label.jsx";
import LabelTitle from "./LabelTitle.jsx";
import Button from "./Button.jsx";
import InputText from "./InputText.jsx";
import InputPassword from "./InputPassword.jsx";
import InputTelefone from "./InputTelefone.jsx";
import InputEndereco from "./InputEndereco.jsx";
import InputTituloEleitor from "./InputTituloEleitor.jsx";

function Login() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-100">
      <form className="bg-white p-8 rounded-lg shadow-md w-80">
        <LabelTitle texto="CADASTRO" />
        <LabelTitle texto="de" />
        <LabelTitle texto="Pessoa Física" />

        <div className="mb-4 flex flex-col">
          <Label texto="Nome completo:" />
          <InputText placeholder="Nome..." />
        </div>
        
        <div className="mb-4 flex flex-col">
          <Label texto="Título:" />
          <InputTituloEleitor placeholder="Digite seu título de eleitor" />
        </div>
        
        <div className="mb-4 flex flex-col">
          <Label texto="CPF:" />
          <InputText placeholder="000.000.000-00" />
        </div>

        <div className="mb-4 flex flex-col">
          <Label texto="Telefone:"/>
          <InputTelefone placeholder="(11) 91234-5678 / (11) 2345-6789"/>
        </div>

        <div className="mb-4 flex flex-col">
          <Label texto="Endereço:"/>
          <InputEndereco placeholder="Digite seu endereço completo"/>
        </div>
        
        <div className="mb-4 flex flex-col">
          <Label texto="Email:" />
          <InputText placeholder="nome@gmail.com" />
        </div>

        <div className="mb-4 flex flex-col">
          <Label texto="Senha:" />
          <InputPassword placeholder="password..." />
        </div>

        <Button valor="Cadastrar" />
      </form>
    </div>
  );
}
export default Login;