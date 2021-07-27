import {Boids} from "./Boids.js"
const boidsList = []
const canvasHeight = 1200
const canvasWidth = 900

function generateRandomLocation(height, width)
{
    let x = Math.floor(Math.random() * width + 1);
    let y = Math.floor(Math.random() * height + 1);
    return {x, y};
}

for(let i = 0; i < 600 ; i++)
{
    let location = generateRandomLocation(canvasHeight,canvasWidth);
    const newBoid = new Boids(location.x , location.y);
    newBoid.drawline();
    boidsList.push(newBoid);
}

function clearAll()
{
    const canvas = document.getElementById("simulation");
    const context = canvas.getContext("2d");
    context.clearRect(0,0,canvasWidth,canvasHeight)
}

function start()
{
    clearAll()
    for(let b of boidsList)
    {
        b.flock()
        b.drawline();
        b.update()
    }
}
setInterval(start,10);

