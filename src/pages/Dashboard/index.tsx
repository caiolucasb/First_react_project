import React, {useState, FormEvent} from 'react';

import api from '../../services/api'

import logoImg from '../../assets/logo.svg'
import { FiChevronRight } from 'react-icons/fi'

import { Title, Form, Repositories, Error  } from './styles'

interface Repository {
    full_name: string;
    description: string;
    owner: {
        login: string;
        avatar_url: string;
    }
    
}

const Dashboard: React.FC = () => {
    const [newRepo, setNewRepo] = useState('');
    const [repositories , setRepositories] = useState<Repository[]>([]);
    const [inputError, setInputError] = useState('');

    async function handleAddRepository(event: FormEvent<HTMLFormElement>): Promise<void>{
        event.preventDefault();
        if(!newRepo) {
            setInputError('Digite autor/nome do repositório');
            return;
        }

       
        try {const response = await api.get<Repository>(`repos/${newRepo}`)
        const repository = response.data;

        setRepositories([...repositories, repository]);
        setInputError('');
        setNewRepo('');
        } catch(err) {
            setInputError('Erro na busca por esse repositório')
            setNewRepo('');
        }
    }

    return(
        <>
            <img src={logoImg} alt="Github explorer"/>
            <Title>Explore repositórios no Github</Title>

            <Form hasError={!!inputError} onSubmit={handleAddRepository}>
                <input
                 value={newRepo}
                 onChange={(e) => setNewRepo(e.target.value)}
                 placeholder="Digite o nome do repositorio"/>
                 <button type="submit">Pesquisar</button>
            </Form>
            {inputError && <Error>{inputError}</Error>}
            <Repositories>
                {repositories.map( repository => (
                    <a key={repository.full_name} href= "">
                        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                    <div>
                <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20}/>
                    </a>
                ))}
            </Repositories>
        </>
    ) 
}

export default Dashboard;