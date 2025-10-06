import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Login() {
    const { register, handleSubmit, reset } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            const url = `http://localhost:8080/api/pessoas/buscar?email=${encodeURIComponent(
                data.email
            )}&senha=${encodeURIComponent(data.senha)}`;

            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (response.ok) {
                const pessoa = await response.json();
                if (pessoa.length > 0) {
                    if (pessoa[0].status !== "ativo") {
                        throw new Error('Usuário inativo. Entre em contato com o administrador.');
                    }
                    const url = pessoa[0].grupo == "administrativo" ? '/backbone?grupo=adm' : '/backbone?grupo=ext';
                    navigate(url);
                } else {
                    throw new Error('Email ou senha incorretos.');
                }
            }
        } catch (error) {
            alert(error.message);

        }


    }


    return (
        <div style={{ backgroundColor: '#1c1f23' }} className="min-vh-100 w-100 d-flex justify-content-center align-items-center  text-light">
            <section style={{ height: '75vh' }} className="w-100 d-flex flex-column justify-content-center align-items-center">
                <div style={{ width: '25vw', height: '50vh' }} className='rounded bg-dark d-flex flex-column justify-content-center align-items-center'>
                    <h1 className='fs-2'>Login</h1>
                    <div style={{ width: '80%', height: '60%' }} className='d-flex flex-column align-items-start justify-content-center gap-2'>
                        <form onSubmit={handleSubmit(onSubmit)} className='w-100 h-100'>
                            <Form.Group className='w-100 p-0 m-0 d-flex flex-column justify-content-start align-items-start' >
                                <Form.Label className='mt-3 fs-5 p-0 mb-1 m-0'>Email</Form.Label>
                                <Form.Control {...register("email")} className=' me-3 w-100 m-0' type="email" placeholder="Digite seu email" />
                                <Form.Label className='mt-3 fs-5 m-0 mb-1'>Senha</Form.Label>
                                <Form.Control {...register("senha")} className=' me-3 w-100 m-0' type="password" placeholder="Digite sua senha" />
                                <Button type='submit' className='mt-5 w-100'>Login</Button>
                            </Form.Group>
                        </form>
                    </div>

                </div>
            </section >
        </div >
    )
}

export default Login;