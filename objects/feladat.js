import input from "./input.js"

const text = await input("Hány db adatot szeretnél megadni?\n");
const students = [];

for(let i = 0;i < text;i++){
    let name = await input("tanulo neve:")
    let email = await input("tanulo email cim:")
    students.push({name: name,email: email})
}

students.forEach(item => {console.log(`Név: ${item.name}, email: ${item.email}`)})
