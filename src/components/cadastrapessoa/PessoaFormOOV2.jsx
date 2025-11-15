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
  // EFEITO: Carregar dados no modo edição
  // =========================
  useEffect(() => {
    if (id && tipoParam) {
      setEditando(true);
      setTipo(tipoParam);

      const dao = tipoParam === "PF" ? pfDAO : pjDAO;
      const lista = dao.listar();
      const pessoa = lista.find((p) => p.id === id);

      if (pessoa) {
        window.scrollTo({ top: 0, behavior: "smooth" });

        const valores = {
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
          valores.titulo = pessoa.titulo || { numero: "", zona: "", secao: "" };
        } else {
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

        form.setFieldsValue(valores);
      } else {
        message.error("Pessoa não encontrada!");
        navigate("/listar");
      }
    }
  }, [id, tipoParam]);

  // =========================
  // TROCA PF/PJ
  // =========================
  function onChangeTipo(e) {
    const novoTipo = e.target.value;
    setTipo(novoTipo);
    const valoresAtuais = form.getFieldsValue();

    form.resetFields();
    form.setFieldsValue({
      ...valoresAtuais,
      tipo: novoTipo,
    });
  }

  // =========================
  // SALVAR / ATUALIZAR
  // =========================
  async function onFinish(values) {
    try {
      let pessoa;
      const endVals = values.endereco || {};

      const end = new Endereco();
      end.setCep(endVals.cep);
      end.setLogradouro(endVals.logradouro);
      end.setBairro(endVals.bairro);
      end.setCidade(endVals.cidade);
      end.setUf(endVals.uf);
      end.setRegiao(endVals.regiao);

      if (values.tipo === "PF") {
        const pf = new PF();
        pf.setNome(values.nome);
        pf.setEmail(values.email);
        pf.setCPF(values.cpf);
        pf.setEndereco(end);

        // Data de nascimento PF
        if (values.dataNascimento) {
          pf.setDataNascimento(values.dataNascimento.format("YYYY-MM-DD"));
        }

        // Título
        if (values.titulo) {
          const t = new Titulo();
          t.setNumero(values.titulo.numero);
          t.setZona(values.titulo.zona);
          t.setSecao(values.titulo.secao);
          pf.setTitulo(t);
        }

        // Telefones
        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pf.addTelefone(fone);
          });
        }

        pessoa = pf;
      } else {
        const pj = new PJ();
        pj.setNome(values.nome);
        pj.setEmail(values.email);
        pj.setCNPJ(values.cnpj);
        pj.setEndereco(end);

        // Data de registro PJ
        if (values.dataRegistro) {
          pj.setDataRegistro(values.dataRegistro.format("YYYY-MM-DD"));
        }

        // Insc. Estadual
        if (values.ie) {
          const ie = new IE();
          ie.setNumero(values.ie.numero);
          ie.setEstado(values.ie.estado);

          const dr = values.ie.dataRegistro;
          const dataRegistroIE =
            dr && typeof dr === "object" && typeof dr.format === "function"
              ? dr.format("YYYY-MM-DD")
              : dr || "";

          ie.setDataRegistro(dataRegistroIE);
          pj.setIE(ie);
        }

        // Telefones
        if (values.telefones?.length > 0) {
          values.telefones.forEach((tel) => {
            const fone = new Telefone();
            fone.setDdd(tel.ddd);
            fone.setNumero(tel.numero);
            pj.addTelefone(fone);
          });
        }

        pessoa = pj;
      }

      const dao = tipo === "PF" ? pfDAO : pjDAO;

      if (editando && id) {
        dao.atualizar(id, pessoa);
        message.success("Registro atualizado com sucesso!");
      } else {
        dao.salvar(pessoa);
        message.success("Registro criado com sucesso!");
      }

      form.resetFields();
      setTimeout(() => navigate("/listar"), 600);
    } catch (erro) {
      console.error("❌ Erro ao salvar:", erro);
      message.error("Erro ao salvar registro: " + erro.message);
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

          {/* DATA PF */}
          {tipo === "PF" && (
            <Form.Item
              label="Data de Nascimento"
              name="dataNascimento"
              rules={[{ required: true, message: "Informe a data de nascimento!" }]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>
          )}

          {/* DATA PJ */}
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
