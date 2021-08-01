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

export let qT = new QuadTree(area, 5)



//____________________
// change the number in the for loop below to change the
//amount of vehicles on the screen
//____________________



for(let i = 0; i < 1000 ; i++)
{
    let location = generateRandomLocation(canvasHeight,canvasWidth);
    const newBoid = new Boids(location.x , location.y);
    qT.insert(newBoid)
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

    for (let h of boidsList)
    {
        qT.insert(h)
    }


    // ____________________________________
    // this picks a random vehicle, draws a circle around it and
    // colors every vehicle within this circle a different color
    // ____________________________________
    let subflock = []
    let circle = new Circle(boidsList[1].position.value1 , boidsList[1].position.value2 , 50 )
    qT.find(circle , subflock , boidsList[1])
    subflock = noRepNoThis( subflock , boidsList[1] )
    // ____________________________________
    // this section of code is showing off the quadtree find() function
    // The main animaion is using the naive n**2 algorithm in order to find the surrounding
    // vehicles.
    // I decided not to use the quadTree find function for the whole animation because I could
    // not get it to work efficiently
    // ____________________________________





    context.beginPath()
    context.arc(circle.x, circle.y , 50, 0, Math.PI * 2)
    context.stroke()
    context.closePath()


    for (let i of subflock)
    {
        i.draw()
    }


    for(let b of boidsList)
    {
        let neighbours = b.getSurroundingBoids(50)

        // let neighbours  = []
        // let circle = new Circle(b.position.value1 , b.position.value2 , 50 )
        // qT.find(circle , neighbours , b)
        // neighbours = noRepNoThis(neighbours)



        //_______________________
        // If you uncomment the code above (line 95 - 98)  and comment line 93
        // youll be able to see the QuadTree find() function for the whole animation
        // this will be significantly slower
        //_______________________



        b.flock(neighbours)
        b.drawline();
        b.update()
    }
    // qT.show()
    //________________
    // uncomment line 114 to see the quadTree visualisation
    //________________




    qT.clear()
}

function noRepNoThis(listOfBoids, boid)
{
    let result = []
    for(let b of listOfBoids)
    {
        if(boid !== b)
        {
            if(!repCheck(result, b))
            {
                result.push(b)
            }
        }
    }
    return result
}


function repCheck(list , boid)
{
    if(list.length === 0)
    {
        return false
    }
    for(let i of list)
    {
        if(i === boid)
        {
            return true
        }
    }
    return false
}
setInterval(start,10);

