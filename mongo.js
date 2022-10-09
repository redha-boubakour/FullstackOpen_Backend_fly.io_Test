require("dotenv").config();
const mongoose = require("mongoose");

if (process.argv.length < 3) {
    console.log(
        "Please provide the password as an argument: node mongo.js <password>"
    );
    process.exit(1);
}

const url = process.env.MONGODB_URI;

const personSchema = new mongoose.Schema({
    name: String,
    number: Number,
});

const Person = mongoose.model("Person", personSchema);

mongoose
    .connect(url)
    .then((result) => {
        console.log("connected!");

        if (process.argv.length > 3) {
            const person = new Person({
                name: process.argv[3],
                number: process.argv[4],
            });

            return person.save();
        } else if (process.argv.length === 3) {
            Person.find({}).then((result) => {
                result.forEach((person) => {
                    console.log(`${person.name} ${person.number}`);
                });
                mongoose.connection.close();
            });
        }
    })
    .then((person) => {
        if (process.argv.length > 3) {
            console.log(
                `added ${person.name} number ${person.number} to phonebook`
            );
        }
        return mongoose.connection.close();
    })
    .catch((err) => console.log(err));
