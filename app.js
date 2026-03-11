import express from "express";

const PORT = 3030;
const app = express();

app.use(express.json());

const students = [
  { id: 1, name: "Ann", subject: "maths" },
  { id: 2, name: "Bob", subject: "IT" },
  { id: 3, name: "Cloe", subject: "PE" },
];

app.get("/students/:id",(req,res))
{
    const id = req.params.id
    students.method ="GET",
    const student = students.find((x) => x.id === id);

    if(student){
        return res.status(200).json({ students});
    }
    else{
        return res.status(404).json({ message: "Name and subject are required" });

    }

}
