import React, {useEffect, useState} from 'react';
import { useRouteMatch, Link } from "react-router-dom";
import { FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'

import logoImg from '../../assets/logo.svg'

import api from '../../services/api';

import { Header, RepositoryInfo, Issues } from './styles';

interface RepositoryParams {
    repository: string;
}

interface Repository {
    full_name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    owner: {
        login: string;
        avatar_url: string;
    }
    
}

interface Issue {
    id: number;
    title: string;
    html_url: string;
    user: {
        login: string;
    }

}

const Repository: React.FC = () => {
    const [repository, setRepository] = useState<Repository | null>(null);
    const [issues, setIssues] = useState<Issue[]>([]);

    const { params } = useRouteMatch<RepositoryParams>();

    useEffect(() => {

        api.get(`repos/${params.repository}`).then(response => {
            setRepository(response.data)
        })

        api.get(`repos/${params.repository}/issues`).then(response => {
            setIssues(response.data)
        })
    }, [params.repository]);

    

    return (

        <>
        <Header>
            <img src={logoImg} alt="Github explorer"/>
            <Link to="/">
                Voltar
                <FiChevronsLeft size={16} />
            </Link>
        </Header>

        {repository && (
        <RepositoryInfo>
            <header>
                <img src={repository.owner.avatar_url} alt= {repository.owner.login}></img>
                <div>
                    <strong>{repository.full_name}</strong>
                    <p>{repository.description}</p>
                </div>
            </header>
            <ul>
                <li>
                    <strong>{repository.stargazers_count}</strong>
                    <p>Stars</p>
                </li>
                <li>
                    <strong>{repository.forks_count}</strong>
                    <p>Forks</p>
                </li>
                <li>
                    <strong>{repository.open_issues_count}</strong>
                    <p>Open Issues</p>
                </li>
            </ul>
        </RepositoryInfo>)}

        <Issues>
            {issues.map(issue =>(
                <a key={issue.id} href={issue.html_url}>
                <div>
                    <strong>{issue.title}</strong>
                    <p>{issue.user.login}</p>
                </div>

                <FiChevronsRight size={20} />
                </a>
            ))}
        </Issues>

        </>
    )
}

export default Repository;