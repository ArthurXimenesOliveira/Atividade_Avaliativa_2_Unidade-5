import PJ from "../pessoas/PJ.mjs";

export default class PJDAO {
  constructor() {
    this.chave = "pessoasJuridicas";
  }

  toPlain(pj) {
    return {
      nome: pj.nome,
      email: pj.email,
      cnpj: pj.cnpj,
      endereco: pj.endereco || {},
      telefones: pj.telefones || [],
      ie: pj.ie || {},
    };
  }

  listar() {
    const dados = localStorage.getItem(this.chave);
    if (!dados) return [];
    try {
      return JSON.parse(dados);
    } catch {
      return [];
    }
  }

  salvar(pj) {
    const lista = this.listar();
    const obj = this.toPlain(pj);
    lista.push(obj);
    localStorage.setItem(this.chave, JSON.stringify(lista));
  }

  atualizar(cnpj, novoPJ) {
    const lista = this.listar();
    const idx = lista.findIndex((p) => p.cnpj === cnpj);
    if (idx >= 0) {
      lista[idx] = this.toPlain(novoPJ);
      localStorage.setItem(this.chave, JSON.stringify(lista));
    } else {
      console.warn("PJ não encontrado para atualização:", cnpj);
    }
  }

  excluir(cnpj) {
    const novaLista = this.listar().filter((p) => p.cnpj !== cnpj);
    localStorage.setItem(this.chave, JSON.stringify(novaLista));
  }

  limpar() {
    localStorage.removeItem(this.chave);
  }
}