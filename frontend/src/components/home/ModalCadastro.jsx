import { Modal } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { Row } from "react-bootstrap";
import { Button } from "react-bootstrap";
import { useForm, useWatch } from "react-hook-form";
import { FormProvider } from "react-hook-form";
import CadastroEndereco from "./CadastroEndereco";
import CadastroPessoa from "./CadastroPessoa";
import { useEffect, useState } from "react";
import ModalAdicionarEndereco from "./ModalAdicionarEndereco";
import { useNavigate } from "react-router-dom"

function ModalCadastro(props) {
  const metodos = useForm();
  const navigate = useNavigate();
  const utilizar = useWatch({
    control: metodos.control,
    name: "utilizarIgual",
  });

  const { usuario } = props;
  const propsSomenteLeitura = usuario !== undefined ? { readOnly: true } : {};
  const [endereceos, setEnderecos] = useState([]);
  const [showModalAddMaisEndereco, setShowModalAddMaisEndereco] = useState(false)
  const [pessoasmCadastradas, setPessoasCadastradas] = useState([])

  const getEnderecos = async (pessoaId) => {
    const response = await fetch(
      `http://localhost:8080/api/enderecos/por-pessoa/${pessoaId}`
    );

    if (response.ok) {
      const data = await response.json();
      console.log(data);
      await setEnderecos(data);
      return data;
    }
  };

  const getPessoasCadastradas = async () => {
    const response = await fetch(
      `http://localhost:8080/api/pessoas`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data)
      setPessoasCadastradas(data);
    }
  }

  const criarUsuario = async (data) => {
    function validarCPF(cpf) {
      cpf = cpf.replace(/[^\d]+/g, "");
      if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

      let soma = 0;
      for (let i = 0; i < 9; i++) {
        soma += parseInt(cpf.charAt(i)) * (10 - i);
      }
      let resto = 11 - (soma % 11);
      if (resto === 10 || resto === 11) resto = 0;
      if (resto !== parseInt(cpf.charAt(9))) return false;

      soma = 0;
      for (let i = 0; i < 10; i++) {
        soma += parseInt(cpf.charAt(i)) * (11 - i);
      }
      resto = 11 - (soma % 11);
      if (resto === 10 || resto === 11) resto = 0;
      return resto === parseInt(cpf.charAt(10));
    }

    if (!validarCPF(data.cpf)) {
      alert("CPF INVÁLIDO");
      throw new Error("Error");
    }

    if(data.senha.trim() != data.confirmarSenha.trim()){
      alert("Senhas não coincidem");
      throw new Error("Error");
    }

    const pessoa = {
      nome: data.nome,
      cpf: data.cpf,
      data_nascimento: new Date(data.nascimento).toISOString().split("T")[0],
      genero: data.genero,
      email: data.email,
      senha: data.senha,
      status: "ativo",
      grupo: "cliente",
    };

    const texto = utilizar ? "faturamento" : "entrega e faturamento";
    try {

      const emailExistente = pessoasmCadastradas.some(
        (element) => element.email === data.email
      );
      if (emailExistente) {
        throw new Error("E-mail já cadastrado");
      }
      const response = await fetch("http://localhost:8080/api/pessoas", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify(pessoa),
      });
      if (response.ok) {
        const url = `http://localhost:8080/api/pessoas/buscar?email=${encodeURIComponent(
          data.email
        )}&senha=${encodeURIComponent(data.senha)}`;

        const resposta = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const dado = await resposta.json();

        const id_pessoas = dado.id;

        console.log(dado);
        console.log(id_pessoas);

        const faturamento = {
          cep: data.cepfaturamento1,
          bairro: data.bairrofaturamento1,
          logradouro: data.logradourofaturamento1,
          numero: data.numerofaturamento1,
          complemento: data.complementofaturamento1,
          cidade: data.cidadefaturamento1,
          estado: data.estadofaturamento1,
          tipo: texto,
          pessoa: {
            id: id_pessoas,
          },
        };

        const resps = await fetch("http://localhost:8080/api/enderecos", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify(faturamento),
        });

        if (!resps.ok) {
          const errorMessage = await resps.text();
          throw new Error(errorMessage);
        }

        if (utilizar == false) {
          const entrega = {
            cep: data.cepentrega1,
            bairro: data.bairroentrega1,
            logradouro: data.logradouroentrega1,
            numero: data.numeroentrega1,
            complemento: data.complementoentrega1,
            cidade: data.cidadeentrega1,
            estado: data.estadoentrega1,
            tipo: "entrega",
            pessoa: {
              id: id_pessoas,
            },
          };

          const resps2 = await fetch("http://localhost:8080/api/enderecos", {
            method: "POST",
            headers: {
              "Content-type": "application/json",
            },
            body: JSON.stringify(entrega),
          });
          if (!resps2.ok) {
            const errorMessage = await resps2.text();
            throw new Error(errorMessage);
          }
        }
        props.onHide();
        alert("Adicionado com sucesso");
      }
    } catch (erro) {
      alert("erro ao adicionar: " + erro.message);
      console.log(erro.message);
    }
    console.log(pessoa);
  };

  const atualizarUsuario = async (data) => {
    try {
      const pessoa = {
        nome: data.nome,
        cpf: data.cpf,
        data_nascimento: new Date(data.nascimento).toISOString().split("T")[0],
        genero: data.genero,
        email: data.email,
        senha: data.senha,
        status: "ativo",
        grupo: "cliente",
      };

      const response = await fetch(
        `http://localhost:8080/api/pessoas/${usuario.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pessoa),
        }
      );
      if (!response.ok) {
        alert("Erro");
        throw new Error("Erro");
      }

      for (const [index, endereco] of endereceos.entries()) {
        console.log(endereco);

        const entrega = {
          id: endereco.id,
          cep: data[`cep${endereco.tipo}${index}`],
          bairro: data[`bairro${endereco.tipo}${index}`],
          logradouro: data[`logradouro${endereco.tipo}${index}`],
          numero: data[`numero${endereco.tipo}${index}`],
          complemento: data[`complemento${endereco.tipo}${index}`],
          cidade: data[`cidade${endereco.tipo}${index}`],
          estado: data[`estado${endereco.tipo}${index}`],
          tipo: endereco.tipo,
          pessoa: {
            id: usuario.id,
          },
        };

        const resposta = await fetch(
          `http://localhost:8080/api/enderecos/${endereco.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(entrega),
          }
        );

        if (!resposta.ok) {
          alert("Erro");
          throw new Error("erro");
        }
        getEnderecos();
      }

      const url = `http://localhost:8080/api/pessoas/buscar?email=${encodeURIComponent(
        data.email
      )}&senha=${encodeURIComponent(data.senha)}`;

      const responset = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (!responset.ok) {
        throw new Error("Erro no servidor. Tente novamente.");
      }

      const pessoar = await responset.json();

      if (!pessoar) {
        throw new Error("E-mail ou senha incorretos.");
      }

      if (pessoar.status !== "ativo") {
        throw new Error("Usuário inativo. Entre em contato com o administrador.");
      }

      const grupo = pessoar.grupo;
      getEnderecos(usuario.id)
      props.onHide();
      navigate("/homepagelogado", { state: { grupo: grupo, pessoa: pessoar } });

      alert('Atualizado com sucesso')
    } catch (erro) {
      alert(erro);
    }
  };

  const metodoEnvio = usuario != undefined ? atualizarUsuario : criarUsuario;


  useEffect(() => {
    getPessoasCadastradas();
    if (usuario != undefined) {
      metodos.setValue("nome", usuario.nome);
      metodos.setValue("cpf", usuario.cpf);
      metodos.setValue("genero", usuario.genero);
      metodos.setValue("nascimento", usuario.data_nascimento);
      metodos.setValue("senha", usuario.senha);
      metodos.setValue("email", usuario.email);
      getEnderecos(usuario.id);
    }
  }, [metodos, usuario,]);



  useEffect(() => {
    getPessoasCadastradas();
    if (endereceos.length > 0) {
      endereceos.forEach((endereco, index) => {
        const tipo = endereco.tipo;
        console.log(endereco.tipo + index);

        metodos.setValue(`cep${tipo}${index}`, endereco.cep);
        metodos.setValue(`bairro${tipo}${index}`, endereco.bairro);
        metodos.setValue(`logradouro${tipo}${index}`, endereco.logradouro);
        metodos.setValue(`numero${tipo}${index}`, endereco.numero);
        metodos.setValue(`complemento${tipo}${index}`, endereco.complemento);
        metodos.setValue(`cidade${tipo}${index}`, endereco.cidade);
        metodos.setValue(`estado${tipo}${index}`, endereco.estado);
      });
    }
  }, [endereceos, props.show, metodos]);

  return (
    <Modal show={props.show} onHide={props.onHide} centered size="lg">
      <Modal.Header
        className="text-light"
        style={{ backgroundColor: "#34495E" }}
        closeButton
      >
        {showModalAddMaisEndereco &&
          <ModalAdicionarEndereco
            fecharPai={props.onHide}
            getEndereco={getEnderecos}
            id={usuario?.id}
            show={showModalAddMaisEndereco}
            onHide={() => setShowModalAddMaisEndereco(false)}
          />}
        <Modal.Title>
          {usuario == undefined ? "Cadastra-se" : "Seu perfil"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="w-100 text-white d-flex flex-column align-content-center justify-content-center"
        style={{ backgroundColor: "#EDEFF2" }}
      >
        <FormProvider {...metodos}>
          <Form onSubmit={metodos.handleSubmit(metodoEnvio)}>
            <CadastroPessoa onlyRead={propsSomenteLeitura} />
            {usuario == undefined ? (
              <>
                <CadastroEndereco index={1} tipo={"faturamento"} />
                <Row className="mb-3 d-flex justify-content-center">
                  <Row
                    className="fw-bolder mb-3"
                    style={{ width: "86%", color: "#34495E" }}
                  >
                    <Form.Check
                      defaultChecked
                      type="switch"
                      id="custom-switch"
                      label="Utilizar o mesmo endereço de faturamento para a entrega"
                      {...metodos.register("utilizarIgual")}
                    />
                  </Row>
                  {utilizar == false && (
                    <CadastroEndereco index={1} tipo={"entrega"} />
                  )}
                </Row>
              </>
            ) : (
              <>
                {endereceos.map((endereco, index) => (
                  <CadastroEndereco tipo={endereco.tipo} index={index} />
                ))}
              </>
            )}

            <Row className="col-11">
              <Button
                type="submit"
                style={{ height: "40px" }}
                className="bnt col-3 ms-auto me-2"
              >
                {usuario != undefined ? "Atualizar" : "Cadastrar"}
              </Button>
              {usuario != undefined && (
                <Button
                  type="button"
                  style={{ height: "40px" }}
                  className="bnt col-3"
                  onClick={() => setShowModalAddMaisEndereco(true)}
                >
                  adicionar endereço
                </Button>
              )}
            </Row>
          </Form>
        </FormProvider>
      </Modal.Body>
    </Modal>
  );
}

export default ModalCadastro;
