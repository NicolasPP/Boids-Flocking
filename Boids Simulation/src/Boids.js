import {Vector} from "./Vector.js";

const canvas = document.getElementById("simulation");
const context = canvas.getContext("2d");
let updateArray = [];
const boidsList = [];
const radius = 100;

export class Boids
{
    constructor(x , y)
    {
        this.x = x;
        this.y = y;
        this.position = new Vector(this.x , this.y);
        this.velocity = this.randUnitVectors();
        this.acceleration  = new Vector(0,0);
        this.maxSpeed = 2.5;
        this.maxForce = 0.04;
        boidsList.push(this);

    }

    draw()
    {
        context.beginPath();
        context.arc(this.position.value1, this.position.value2, 10, 0, Math.PI * 2);
        context.fillStyle = "#0095DD";
        context.fill();
        context.closePath();
    }


    goThroughWall()
    {
        if(this.position.value1 < 0)
        {
            this.position.value1 = 600;
        }
        if(this.position.value1 > 600)
        {
            this.position.value1 = 0;
        }
        if(this.position.value2 < 0)
        {
            this.position.value2 = 900;
        }
        if(this.position.value2 > 900)
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
            if (distance <= radius && b !== this)
            {
                subFlock.push(b);
            }
        }
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
            average = average.setMag(this.maxSpeed)
            average = average.subtract(this.velocity)
            average = average.limit(this.maxForce)
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
            average = average.subtract(this.position)
            average = average.setMag(this.maxSpeed)
            average = average.subtract(this.velocity)
            average = average.limit(this.maxForce)
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
            average = average.div(neighbours.length)
            average = average.subtract(this.position)
            average = average.setMag(this.maxSpeed)
            average = average.subtract(this.velocity)
            average = average.limit(this.maxForce)
        }
        return average
    }

    flock()
    {
        // this.acceleration = this.cohesion()
        // this.acceleration = this.acceleration.add(this.alignment())
        // this.acceleration = this.acceleration.add(this.repulsion())
        let cohesion = this.cohesion()
        let repulsion = this.repulsion()
        let alignment = this.alignment()
        // this.applyForce(alignment)
        // this.applyForce(cohesion)
        this.applyForce(repulsion)
        // updateArray.push(alignment)
        // updateArray.push([cohesion,repulsion,alignment])
        // console.log(updateArray)
    }

    clearUpdateArray()
    {
        // console.log("amen")
        for(let i of updateArray)
        {
            updateArray.pop()
        }
    }


    update(index)
    {
        // let cohesion = updateArray[index][0];
        // let repulsion = updateArray[index][1];
        // this.acceleration = updateArray[index][2];
        // this.acceleration = this.acceleration.add(repulsion);
        // this.acceleration = this.acceleration.add(cohesion);
        // console.log((updateArray)[index])
        // this.applyForce(updateArray[index])
        // this.velocity = this.velocity.setMag(this.maxSpeed);
        // this.acceleration = this.acceleration.limit(this.maxForce)
        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);
        this.goThroughWall();
        this.acceleration = this.acceleration.multiply(0)
        // this.acceleration = this.acceleration.multiply(0);
    }

    applyForce(force)
    {
        // this.acceleration = this.acceleration.limit(this.maxForce)
        return this.acceleration = this.acceleration.add(force)
    }
}


