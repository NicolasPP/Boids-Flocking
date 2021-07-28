import {Vector} from "./Vector.js";
import {Area, Circle, QuadTree} from "./QuadTree.js";



const canvas = document.getElementById("simulation");
const context = canvas.getContext("2d");
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;
canvas.width  = canvasWidth
canvas.height = canvasHeight
const boidsList = [];
const radius = 50;

// const area = new Area
// (
//     canvasWidth / 2 ,
//     canvasHeight / 2 ,
//     canvasHeight / 2 ,
//     canvasWidth / 2
// )
// export let quadTree = new QuadTree( area , 5 )


export class Boids
{
    constructor(x , y)
    {
        this.x = x;
        this.y = y;
        this.position = new Vector(this.x , this.y);
        this.velocity = this.randUnitVectors();
        this.acceleration  = new Vector(0,0);
        this.maxSpeed = 3.5;
        this.maxForce = 0.2;
        // this.recAreaRadius = new Area(this.x - radius /2 , this.y - radius/2 ,radius  , radius )
        // this.circle = new Circle(this.x , this.y , radius)

        boidsList.push(this);

    }

    draw()
    {
        context.beginPath();
        context.arc(this.position.value1, this.position.value2, 5, 0, Math.PI * 2);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }


    drawline()
    {
        const arrowSize = 20
        let val = this.position.value1 + arrowSize * this.velocity.unit().value1
        let val2 = this.position.value2 + arrowSize * this.velocity.unit().value2
        context.beginPath()
        context.moveTo(val , val2)
        context.lineTo(this.position.value1, this.position.value2 )
        context.stroke()
        context.closePath()
    }



    goThroughWall()
    {
        if(this.position.value1 < 0)
        {
            this.position.value1 = canvasWidth;
        }
        if(this.position.value1 > canvasWidth)
        {
            this.position.value1 = 0;
        }
        if(this.position.value2 < 0)
        {
            this.position.value2 = canvasHeight;
        }
        if(this.position.value2 > canvasHeight)
        {
            this.position.value2 = 0;
        }
    }


    bounceOnThroughWall()
    {
        if(this.position.value1 < 0)
        {
            this.velocity = this.velocity.multiply(-1)
            this.maxForce = 2
        }
        if(this.position.value1 > canvasWidth)
        {
            this.velocity = this.velocity.multiply(-1)
            this.maxForce = 2
        }
        if(this.position.value2 < 0)
        {
            this.velocity = this.velocity.multiply(-1)
            this.maxForce = 2

        }
        if(this.position.value2 > canvasHeight)
        {
            this.velocity = this.velocity.multiply(-1)
            this.maxForce = 2
        }
    }


    randUnitVectors()
    {
        let mag = 1;
        let angle = Math.random() * (0 - (Math.PI * 2)) + (Math.PI * 2);
        let x = mag * Math.cos(angle)
        let y = mag * Math.sin(angle)
        return new Vector(x, y)
    }


    getSurroundingBoids(radius)
    {
        let subFlock = [];
        // let test = []
        // quadTree.find(this.circle, test)
        // console.log(test)
        for(let b of boidsList)
        {
            let distance = this.position.dist(b.position);
            if (radius >= distance && b !== this)
            {
                subFlock.push(b);
            }
        }
        // console.log(subFlock + "  hey")
        return subFlock;
    }

    alignment()
    {
        let neighbours = this.getSurroundingBoids(radius)
        let average = new Vector(0,0)
        for (let b of neighbours)
        {
            average = average.add(b.velocity)
        }
        if (neighbours.length > 0)
        {
            average = average.div(neighbours.length)
                .setMag(this.maxSpeed)
                .subtract(this.velocity)
                .limit(this.maxForce)
        }
        return average

    }

    cohesion()
    {
        let neighbours = this.getSurroundingBoids(radius)
        let average = new Vector(0,0)
        for(let b of neighbours)
        {
            average = average.add(b.position)
        }
        if(neighbours.length > 0)
        {
            average = average.div(neighbours.length)
                .subtract(this.position)
                .setMag(this.maxSpeed)
                .subtract(this.velocity)
                .limit(this.maxForce)
        }
        return average
    }

    repulsion()
    {
        let neighbours = this.getSurroundingBoids(radius)
        let average = new Vector(0,0)
        for(let b of neighbours)
        {
            let difference = this.position.subtract(b.position)
            let distance = this.position.dist(b.position)
            let change =  difference.div(distance **2)
            average = average.add(change)
        }
        if(neighbours.length > 0)
        {
            average = average
                .div(neighbours.length)
                .setMag(this.maxSpeed)
                .add(this.velocity)
                .limit(this.maxForce + 0.002 )
        }
        return average
    }

    flock()
    {
        let cohesion = this.cohesion()
        let repulsion = this.repulsion()
        let alignment = this.alignment()
        this.applyForce(alignment)
        this.applyForce(cohesion)
        this.applyForce(repulsion)
    }

    update()
    {
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
        this.goThroughWall()
        this.acceleration = this.acceleration.multiply(0)
        this.maxForce =0.2

    }

    applyForce(force)
    {
        return this.acceleration = this.acceleration.add(force)
    }

}


