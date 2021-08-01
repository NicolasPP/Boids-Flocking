import {Vector} from "./Vector.js";


const canvas = document.getElementById("simulation");
const context = canvas.getContext("2d");
const canvasHeight = window.innerHeight;
const canvasWidth = window.innerWidth;
canvas.width  = canvasWidth
canvas.height = canvasHeight
const boidsList = [];



export class Boids
{
    constructor(x , y)
    {
        this.x = x;
        this.y = y;
        this.maxSpeed = 3.5;
        this.maxForce = 0.2;
        this.position = new Vector(this.x , this.y);
        this.velocity = this.randUnitVectors().setMag(this.maxSpeed);
        this.acceleration  = new Vector(0,0);
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
        for(let b of boidsList)
        {
            let distance = this.position.dist(b.position);
            if (radius >= distance && b !== this)
            {
                subFlock.push(b);
            }
        }
        return subFlock;
    }


    alignment(closeBoids)
    {
        let average = new Vector(0,0)
        for (let b of closeBoids)
        {
            average = average.add(b.velocity)
        }
        if (closeBoids.length > 0)
        {
            average = average.div(closeBoids.length)
                .setMag(this.maxSpeed)
                .subtract(this.velocity)
                .limit(this.maxForce)
        }
        return average

    }

    cohesion(closeBoids)
    {
        let average = new Vector(0,0)
        for(let b of closeBoids)
        {
            average = average.add(b.position)
        }
        if(closeBoids.length > 0)
        {
            average = average.div(closeBoids.length)
                .subtract(this.position)
                .setMag(this.maxSpeed)
                .subtract(this.velocity)
                .limit(this.maxForce)
        }
        return average
    }

    repulsion(closeBoids)
    {
        let average = new Vector(0,0)
        for(let b of closeBoids)
        {
            let difference = this.position.subtract(b.position)
            let distance = this.position.dist(b.position)
            let change =  difference.div(distance **2)
            average = average.add(change)
        }
        if(closeBoids.length > 0)
        {
            average = average
                .div(closeBoids.length)
                .setMag(this.maxSpeed)
                .add(this.velocity)
                .limit(this.maxForce + 0.002 )
        }
        return average
    }


    flock(closeBoids)
    {
        let cohesion = this.cohesion(closeBoids)
        let repulsion = this.repulsion(closeBoids)
        let alignment = this.alignment(closeBoids)
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

    }

    applyForce(force)
    {
        return this.acceleration = this.acceleration.add(force)
    }
}