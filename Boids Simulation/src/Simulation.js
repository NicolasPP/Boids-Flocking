import {Boids} from "./Boids.js"
import {QuadTree, Area, Circle} from "./QuadTree.js";

const canvas = document.getElementById("simulation");
const context = canvas.getContext("2d");

const boidsList = []
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;
const area = new Area(canvasWidth / 2, canvasHeight / 2,canvasHeight / 2, canvasWidth / 2)

function generateRandomLocation(height, width)
{
    let x = Math.floor(Math.random() * width + 1);
    let y = Math.floor(Math.random() * height + 1);
    return {x, y};
}

export let qT = new QuadTree(area, 4)



for(let i = 0; i < 100 ; i++)
{
    let location = generateRandomLocation(canvasHeight,canvasWidth);
    const newBoid = new Boids(location.x , location.y);
    qT.insert(newBoid)
    newBoid.draw();
    boidsList.push(newBoid);
}


//measure performace canvas re -rendering

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
        qT.insert(b)
        b.flock()
        b.draw();
        b.update()
    }
    let subflock = []
    let circl = new Circle(boidsList[0].position.value1 , boidsList[0].position.value2 , 50 )
    qT.find(circl , subflock)

    context.beginPath()
    context.arc(circl.x, circl.y , 50, 0, Math.PI * 2)
    context.stroke()
    context.closePath()

    for (let i of subflock)
    {
        i.drawline()
    }
    qT.show()
    qT.clear()
}


setInterval(start,10);

