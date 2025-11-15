import React, { useEffect, useState } from 'react';
import FichaPessoaFisica from './FichaPessoaFisica';
import FichaPessoaJuridica from './FichaPessoaJuridica';
import PessoaFisica from '../back/pessoa/Fisica';
import PessoaJuridica from '../back/pessoa/Juridica';
import PFDAO from '../back/pessoa/PFDAO';
import PJDAO from '../back/pessoa/PJDAO';

function PessoaFormOOv2() {
  const [tipoPessoa, setTipoPessoa] = useState('pf');
  const [pessoasFisicas, setPessoasFisicas] = useState([]);
  const [pessoasJuridicas, setPessoasJuridicas] = useState([]);
  const [pessoaEdicao, setPessoaEdicao] = useState(null);

  useEffect(() => {
    const pfDAO = PFDAO.getInstance();
    const pjDAO = PJDAO.getInstance();
    setPessoasFisicas(pfDAO.getAll());
    setPessoasJuridicas(pjDAO.getAll());
  }, []);

  const handleEdit = (pessoa) => {
    setPessoaEdicao(pessoa);
    setTipoPessoa(pessoa.tipo === 'pf' ? 'pf' : 'pj');
  };

  const handleDelete = (id, tipo) => {
    if (tipo === 'pf') {
      PFDAO.getInstance().delete(id);
      setPessoasFisicas(PFDAO.getInstance().getAll());
    } else {
      PJDAO.getInstance().delete(id);
      setPessoasJuridicas(PJDAO.getInstance().getAll());
    }
  };

  const handleSave = (data) => {
    if (tipoPessoa === 'pf') {
      const novaPessoa = new PessoaFisica(
        data.id || Date.now(),
        data.nome,
        data.email,
        data.cpf,
        data.dataNascimento  // NOVO CAMPO — ADICIONADO
      );

      PFDAO.getInstance().save(novaPessoa);
      setPessoasFisicas(PFDAO.getInstance().getAll());
    } else {
      const novaPessoa = new PessoaJuridica(
        data.id || Date.now(),
        data.nome,
        data.email,
        data.cnpj,
        data.dataRegistro  // NOVO CAMPO — ADICIONADO
      );

      PJDAO.getInstance().save(novaPessoa);
      setPessoasJuridicas(PJDAO.getInstance().getAll());
    }

    setPessoaEdicao(null);
  };

  return (
    <div>
      <h2>Cadastro de Pessoas</h2>

      <div>
        <button onClick={() => setTipoPessoa('pf')}>Pessoa Física</button>
        <button onClick={() => setTipoPessoa('pj')}>Pessoa Jurídica</button>
      </div>

      {tipoPessoa === 'pf' ? (
        <FichaPessoaFisica onSave={handleSave} pessoaEdicao={pessoaEdicao} />
      ) : (
        <FichaPessoaJuridica onSave={handleSave} pessoaEdicao={pessoaEdicao} />
      )}

      <h3>Pessoas Físicas</h3>
      <ul>
        {pessoasFisicas.map((pf) => (
          <li key={pf.id}>
            {pf.nome} - {pf.cpf} - {pf.dataNascimento || '(sem data)'}
            <button onClick={() => handleEdit(pf)}>Editar</button>
            <button onClick={() => handleDelete(pf.id, 'pf')}>Excluir</button>
          </li>
        ))}
      </ul>

      <h3>Pessoas Jurídicas</h3>
      <ul>
        {pessoasJuridicas.map((pj) => (
          <li key={pj.id}>
            {pj.nome} - {pj.cnpj} - {pj.dataRegistro || '(sem data)'}
            <button onClick={() => handleEdit(pj)}>Editar</button>
            <button onClick={() => handleDelete(pj.id, 'pj')}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PessoaFormOOv2;
