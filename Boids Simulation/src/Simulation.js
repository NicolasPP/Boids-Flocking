import {Boids} from "./Boids.js"
import {Area, QuadTree} from "./QuadTree.js";

const boidsList = []
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;

function generateRandomLocation(height, width)
{
    let x = Math.floor(Math.random() * width + 1);
    let y = Math.floor(Math.random() * height + 1);
    return {x, y};
}

for(let i = 0; i < 1000 ; i++)
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
// console.log(quadTree)

function start()
{
    clearAll()
    // quadTree = new QuadTree( area , 5)
    for(let b of boidsList)
    {
        b.flock()
        b.drawline();
        b.update()
    }
    // for(let b of boidsList)
    // {
    //     quadTree.insert(b)
    // }
    //
    // // quadTree.show()
    // quadTree = null
}




setInterval(start,10);

