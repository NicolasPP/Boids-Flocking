import {Boids} from "./Boids.js"
const boidsList = []

function generateRandomLocation(height, width)
{
    let x = Math.floor(Math.random() * width + 1);
    let y = Math.floor(Math.random() * height + 1);
    return {x, y};
}

for(let i = 0; i < 1000 ; i++)
{
    let location = generateRandomLocation(900,600);
    const newBoid = new Boids(location.x , location.y);
    newBoid.draw();
    boidsList.push(newBoid);
}

function clearAll()
{
    const canvas = document.getElementById("simulation");
    const context = canvas.getContext("2d");
    context.clearRect(0,0,600,900)
}

function start()
{
    for(let b of boidsList)
    {
        b.flock()
    }
    clearAll()
    let index = 0;
    for(let i of boidsList)
    {
        i.update(index);
        i.draw();
        index += 1;
    }
    // for(let j of boidsList[0].getSurroundingBoids(100))
    // {
    //     console.log(j)
    //     j.draw2()
    // }
    boidsList[0].clearUpdateArray()
}
setInterval(start,10);

