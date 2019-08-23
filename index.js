const express = require('express');

const server = express();

server.use(express.json())

const projects = [

    {
        id: "1",
        title: "Trabalhar",
        task: []
    },
    {
        id: "2",
        title: "Academia",
        task: []
    },
    {
        id: "3",
        title: "Estudar",
        task: []
    }

];

let qutReq = 0;

function middlewareIsProjectExist(req, res, next) {
    const { id } = req.params;

    projects.filter((el) => {
        if (el.id === id) {
            req.project = el;
            return;
        }
    });

    if (!req.project) {
        return res.status(400).send('Projeto não encontrado!')
    }
    return next();
}

function middlewareQutReq(req, res, next) {
    qutReq = qutReq + 1;
    console.log('Quantidade de requisições: ', qutReq)
    return next()
}

server.get('/projects', middlewareQutReq, (req, res) => {
    return res.json(projects)
})

server.post('/projects', middlewareQutReq, (req, res) => {
    const { id, title, task } = req.body;
    projects.push({
        id,
        title,
        task
    })
    return res.json(projects)
})

server.put('/projects/:id/task', middlewareIsProjectExist, middlewareQutReq, (req, res) => {
    const { title } = req.body;
    req.project.task.push(title.toString());
    return res.json(req.project);
})

server.put('/projects/:id', middlewareIsProjectExist, middlewareQutReq, (req, res) => {
    const { title } = req.body;
    req.project.title = title;
    return res.json(req.project)
})

server.delete('/projects/:id', middlewareIsProjectExist, middlewareQutReq, (req, res) => {
    const { id } = req.params;
    const index = projects.indexOf(req.project);
    projects.splice(index, 1);
    res.status(200).send('Projeto excluido com sucesso');
})

server.listen(3000);