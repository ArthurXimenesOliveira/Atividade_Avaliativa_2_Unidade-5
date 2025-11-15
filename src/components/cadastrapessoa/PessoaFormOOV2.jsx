import React, { useState, useEffect } from "react";
import { Form, Input, Button, Radio, DatePicker, message } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

// === Subcomponentes ===
import EnderecoForm from "./EnderecoFormEXV2.jsx";
import TelefoneList from "./TelefoneListOOV2.jsx";
import PFForm from "./PFForm.jsx";
import PJForm from "./PJForm.jsx";

// === DAOs ===
import PFDAO from "../../objetos/dao/PFDAOLocalV2.mjs";
import PJDAO from "../../objetos/dao/PJDAOLocalV2.mjs";

// === Classes ===
import PF from "../../objetos/pessoas/PF.mjs";
import PJ from "../../objetos/pessoas/PJ.mjs";
import Endereco from "../../objetos/pessoas/Endereco.mjs";
import Telefone from "../../objetos/pessoas/Telefone.mjs";
import Titulo from "../../objetos/pessoas/Titulo.mjs";
import IE from "../../objetos/pessoas/IE.mjs";

export default function PessoaFormOOV2() {
  const [tipo, setTipo] = useState("PF");
  const [editando, setEditando] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { tipo: tipoParam, id } = useParams();

  const pfDAO = new PFDAO();
  const pjDAO = new PJDAO();

  // =========================
  // CARREGAR PARA EDITAR
  // =========================
  useEffect(() => {
    if (id && tipoParam) {
      setEditando(true);
      setTipo(tipoParam);

      const dao = tipoParam === "PF" ? pfDAO : pjDAO;
      const pessoa = dao.listar().find((p) => p.id === id);

      if (pessoa) {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const valores = {
          id: pessoa.id, // <-- garante que o form carrega o id
          tipo: tipoParam,
          nome: pessoa.nome,
          email: pessoa.email,
          endereco: pessoa.endereco || {},
          telefones: pessoa.telefones || [],
        };

        if (tipoParam === "PF") {
          valores.cpf = pessoa.cpf;
          valores.dataNascimento = pessoa.dataNascimento
            ? dayjs(pessoa.dataNascimento)
            : null;

          valores.titulo = pessoa.titulo || {
            numero: "",
            zona: "",
            secao: "",
          };
        }

        if (tipoParam === "PJ") {
          valores.cnpj = pessoa.cnpj;
          valores.dataRegistro = pessoa.dataRegistro
            ? dayjs(pessoa.dataRegistro)
            : null;

          const ieObj = pessoa.ie || {};
          valores.ie = {
            numero: ieObj.numero || "",
            estado: ieObj.estado || "",
            dataRegistro: ieObj.dataRegistro
              ? dayjs(ieObj.dataRegistro)
              : null,
          };
        }

        // seta somente campos válidos
        form.setFieldsValue(valores);
      } else {
        message.error("Pessoa não encontrada!");
        navigate("/listar");
      }
    }
  }, [id, tipoParam]);

  // =========================
  // TROCAR PF/PJ
  // =========================
  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);

    const valores = form.getFieldsValue();
    form.resetFields();

    form.setFieldsValue({
      ...valores,
      tipo: novoTipo,
    });
  }

  // =========================
  // SALVAR / ATUALIZAR
  // =========================
  async function onFinish(values) {
    try {
      // validação final (força campos obrigatórios do form)
      await form.validateFields();

      let pessoaObj;
      const endVals = values.endereco || {};

      const end = new Endereco();
      end.setCep(endVals.cep);
      end.setLogradouro(endVals.logradouro);
      end.setBairro(endVals.bairro);
      end.setCidade(endVals.cidade);
      end.setUf(endVals.uf);
      end.setRegiao(endVals.regiao);

      if ((values.tipo || tipo) === "PF") {
        const pf = new PF();
        pf.setNome(values.nome);
        pf.setEmail(values.email);
        pf.setCPF(values.cpf);
        pf.setEndereco(end);

        // dataNascimento (se existir)
        if (values.dataNascimento) {
          const dn =
            typeof values.dataNascimento.format === "function"
              ? values.dataNascimento.format("YYYY-MM-DD")
              : values.dataNascimento;
          if (typeof pf.setData === "function") pf.setData(dn);
          if (typeof pf.setDataNascimento === "function")
            pf.setDataNascimento(dn);
        }

        if (values.titulo) {
          const t = new Titulo();
          t.setNumero(values.titulo.numero || "");
          t.setZona(values.titulo.zona || "");
          t.setSecao(values.titulo.secao || "");
          pf.setTitulo(t);
        }

        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const f = new Telefone();
            f.setDdd(tel.ddd);
            f.setNumero(tel.numero);
            pf.addTelefone(f);
          });
        }

        // garante id no objeto (opcional, alguns DAOs usam direto)
        if (values.id) {
          if (typeof pf.setId === "function") pf.setId(values.id);
          else pf.id = values.id;
        }

        pessoaObj = pf;
      } else {
        const pj = new PJ();
        pj.setNome(values.nome);
        pj.setEmail(values.email);
        pj.setCNPJ(values.cnpj);
        pj.setEndereco(end);

        // dataRegistro (se existir)
        if (values.dataRegistro) {
          const dr =
            typeof values.dataRegistro.format === "function"
              ? values.dataRegistro.format("YYYY-MM-DD")
              : values.dataRegistro;
          if (typeof pj.setData === "function") pj.setData(dr);
          if (typeof pj.setDataRegistro === "function")
            pj.setDataRegistro(dr);
        }

        if (values.ie) {
          const ie = new IE();
          ie.setNumero(values.ie.numero || "");
          ie.setEstado(values.ie.estado || "");
          if (values.ie.dataRegistro) {
            const drIE =
              typeof values.ie.dataRegistro.format === "function"
                ? values.ie.dataRegistro.format("YYYY-MM-DD")
                : values.ie.dataRegistro;
            ie.setDataRegistro(drIE);
          }
          pj.setIE(ie);
        }

        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const f = new Telefone();
            f.setDdd(tel.ddd);
            f.setNumero(tel.numero);
            pj.addTelefone(f);
          });
        }

        if (values.id) {
          if (typeof pj.setId === "function") pj.setId(values.id);
          else pj.id = values.id;
        }

        pessoaObj = pj;
      }

      // escolhe DAO com fallback
      const dao = (values.tipo || tipo) === "PF" ? pfDAO : pjDAO;

      // identifica id alvo (prioriza o id do form, senão param)
      const targetId = values.id ?? id;

      console.debug("Salvando/Atualizando pessoa:", {
        tipo: values.tipo || tipo,
        id: targetId,
        objeto: pessoaObj,
      });

      // usa await para compatibilidade sync/async
      if (editando && targetId) {
        // se o DAO retornar promise, await; se não, await resolve imediatamente
        await dao.atualizar(targetId, pessoaObj);
        message.success("Registro atualizado com sucesso!");
      } else {
        await dao.salvar(pessoaObj);
        message.success("Registro criado com sucesso!");
      }

      form.resetFields();

      // navega para a lista — sem depender de setTimeout longo
      setTimeout(() => navigate("/listar"), 250);
    } catch (erro) {
      console.error("❌ Erro ao salvar:", erro);
      // mostra a mensagem; se for erro do DAO, mostra a mensagem ou uma genérica
      message.error(
        "Erro ao salvar registro: " + (erro?.message || JSON.stringify(erro))
      );
    }
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div
      className="main-scroll"
      style={{
        overflowY: "auto",
        overflowX: "hidden",
        height: "100vh",
        background: "#f9f9f9",
      }}
    >
      <div
        className="form-container"
        style={{
          maxWidth: 800,
          margin: "24px auto",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        }}
      >
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>
          {editando
            ? `Editar ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`
            : `Cadastro de ${tipo === "PF" ? "Pessoa Física" : "Pessoa Jurídica"}`}
        </h2>

        <Form
          layout="vertical"
          form={form}
          onFinish={onFinish}
          scrollToFirstError
        >
          {/* ID oculto para garantir edição */}
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Tipo de Pessoa"
            name="tipo"
            initialValue="PF"
            style={{ marginBottom: 10 }}
          >
            <Radio.Group onChange={onChangeTipo}>
              <Radio value="PF">Pessoa Física</Radio>
              <Radio value="PJ">Pessoa Jurídica</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            label="Nome"
            name="nome"
            rules={[{ required: true, message: "Informe o nome!" }]}
          >
            <Input placeholder="Nome completo ou razão social" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Informe o e-mail!" },
              { type: "email", message: "Formato de e-mail inválido!" },
            ]}
          >
            <Input placeholder="exemplo@email.com" />
          </Form.Item>

          {tipo === "PF" && (
            <Form.Item
              label="Data de Nascimento"
              name="dataNascimento"
              rules={[{ required: true, message: "Informe a data de nascimento!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          )}

          {tipo === "PJ" && (
            <Form.Item
              label="Data de Registro"
              name="dataRegistro"
              rules={[{ required: true, message: "Informe a data de registro!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          )}

          {tipo === "PF" ? (
            <Form.Item
              label="CPF"
              name="cpf"
              rules={[{ required: true, message: "Informe o CPF!" }]}
            >
              <Input placeholder="Somente números" maxLength={11} />
            </Form.Item>
          ) : (
            <Form.Item
              label="CNPJ"
              name="cnpj"
              rules={[{ required: true, message: "Informe o CNPJ!" }]}
            >
              <Input placeholder="Somente números" maxLength={18} />
            </Form.Item>
          )}

          <EnderecoForm />
          <TelefoneList form={form} />
          {tipo === "PF" ? <PFForm /> : <PJForm />}

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" htmlType="submit" block>
              {editando ? "Salvar Alterações" : "Salvar"}
            </Button>
          </Form.Item>

          {editando && (
            <Form.Item>
              <Button block onClick={() => navigate("/listar")}>
                Cancelar
              </Button>
            </Form.Item>
          )}
        </Form>
      </div>
    </div>
  );
}
