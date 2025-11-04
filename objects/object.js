const person = {
    name :"Alice",
    age:19,
    city:"Szeged",
    driverLicense:true
}
person.greet = function(){
    console.log(`Hello ${this.name}`)
}

const person2 = {
    name :"Bob",
    age:20,
    city:"London",
    driverLicense:true,
    greet(){
        console.log(`Hello ${this.name}`)
    }
}

//person2.greet()

for(let key in person){
    console.log(`Key: ${key} >> Value: ${person[key]}`)
}