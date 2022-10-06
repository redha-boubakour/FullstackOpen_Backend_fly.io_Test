const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.static("build"));
app.use(cors());
app.use(
    morgan(
        ":method :url :status :res[content-length] - :response-time ms {:reqBody}"
    )
);

morgan.token("reqBody", function (req, res) {
    return JSON.stringify(req.body);
});

let persons = [
    {
        id: 1,
        name: "Arto Hellas",
        number: "040-123456",
    },
    {
        id: 2,
        name: "Ada Lovelace",
        number: "39-44-5323523",
    },
    {
        id: 3,
        name: "Dan Abramov",
        number: "12-43-234345",
    },
    {
        id: 4,
        name: "Mary Poppendieck",
        number: "39-23-6423122",
    },
];

app.get("/", (request, response) => {
    response.send("<h1>Hello World!</h1>");
});

app.get("/api/persons", (request, response) => {
    response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
    const identifier = Number(request.params.id);
    const person = persons.find((person) => person.id === identifier);

    if (person) {
        response.json(person);
    } else {
        response.status(404).end();
    }
});

app.delete("/api/persons/:id", (request, response) => {
    const identifier = Number(request.params.id);
    persons = persons.filter((person) => person.id !== identifier);

    response.status(204).end();
});

const generateId = () => {
    const maxId =
        persons.length > 0
            ? Math.max(...persons.map((person) => person.id))
            : 0;
    return maxId + 1;
};

app.post("/api/persons", (request, response) => {
    const body = request.body;

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: "the name or the number are missing",
        });
    }

    const alreadyExist = persons.find((person) => person.name === body.name);

    if (alreadyExist) {
        return response.status(400).json({
            error: "name must be unique",
        });
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    };

    persons = persons.concat(person);
    response.json(person);
});

app.get("/info", (request, response) => {
    response.send(
        `<div>
            <p>Phonebook has info for ${persons.length} people</p>
            <p>${new Date()}</p>
        </div>`
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
