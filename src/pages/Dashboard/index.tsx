import React, {useState, FormEvent, useEffect} from 'react';
import { Link } from "react-router-dom";


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
    const [repositories , setRepositories] = useState<Repository[]>(() => {
        const storageRepositories = localStorage.getItem('@GithubExplorer:repositories');

        if(storageRepositories) {
            return JSON.parse(storageRepositories);
        }
        else {
            return [];
        }
    });
    const [inputError, setInputError] = useState('');

    useEffect(() => {
        localStorage.setItem('@GithubExplorer:repositories', JSON.stringify(repositories))
    }, [repositories])

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
                    <Link key={repository.full_name} to= {`/Repository/${repository.full_name}`}>
                        <img src={repository.owner.avatar_url} alt={repository.owner.login}/>
                    <div>
                <strong>{repository.full_name}</strong>
                        <p>{repository.description}</p>
                    </div>
                    <FiChevronRight size={20}/>
                    </Link>
                ))}
            </Repositories>
        </>
    ) 
}

export default Dashboard;