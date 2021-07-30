const canvas = document.getElementById("simulation");
const context = canvas.getContext("2d");

export class QuadTree
{
    constructor( area , capacity )
    {
        this.area = area;
        this.capacity = capacity;
        this.boidsList = [];
        this.split = false;
        this.subTrees = []
    }


    subDivide(){

        let tl = new Area
        (
            this.area.x - this.area.w / 2,
            this.area.y - this.area.h / 2,
            this.area.h/2,
            this.area.w/2

        );
        this.topLeft = new QuadTree( tl , this.capacity ); //northwest
        this.subTrees.push(this.topLeft)

        let tr = new Area
        (
            this.area.x + this.area.w / 2,
            this.area.y - this.area.h / 2,
            this.area.h/2,
            this.area.w/2

        );
        this.topRight = new QuadTree( tr , this.capacity );// northeast
        this.subTrees.push(this.topRight)

        let bl = new Area
        (
            this.area.x - this.area.w / 2,
            this.area.y + this.area.h / 2,
            this.area.h/2,
            this.area.w/2
        );
        this.bottomLeft = new QuadTree( bl , this.capacity );//southwest
        this.subTrees.push(this.bottomLeft)

        let br = new Area
        (
            this.area.x + this.area.w / 2,
            this.area.y + this.area.h / 2,
            this.area.h/2,
            this.area.w/2
        );
        this.bottomRight = new QuadTree( br , this.capacity );//southeast
        this.subTrees.push(this.bottomRight)


        this.split = true;
    }

    show()
    {
        // console.log("here")
        context.beginPath()
        context.moveTo(this.area.x, this.area.y)
        context.lineTo(this.area.x + this.area.w, this.area.y)
        context.moveTo(this.area.x, this.area.y)
        context.lineTo(this.area.x - this.area.w, this.area.y)
        context.moveTo(this.area.x, this.area.y)
        context.lineTo(this.area.x, this.area.y + this.area.h)
        context.moveTo(this.area.x, this.area.y)
        context.lineTo(this.area.x , this.area.y - this.area.h)
        context.stroke()
        context.closePath()

        if (this.split)
        {
            this.topLeft.show()
            this.topRight.show()
            this.bottomRight.show()
            this.bottomLeft.show()
        }
    }


    getBoidsNum()
    {
        if (!this.split)
        {
            return this.boidsList.length
        }
        else
        {
            this.topLeft.getBoidsNum()
            this.topRight.getBoidsNum()
            this.bottomRight.getBoidsNum()
            this.bottomLeft.getBoidsNum()
        }

    }

    find(range, subFlock)
    {
        if (!subFlock)
        {
            console.log("there")
            subFlock = []
        }
        if (!this.area.overlap(range))
        {
            console.log("here")
            return subFlock;
        }
        else
        {
            console.log("oi")
            for (let b of this.boidsList)
            {
                if (range.have(b))
                {
                    console.log("oi2")
                    subFlock.push(b)

                }
            }
            if (this.split)
            {
                console.log("over here")
                this.topRight.find(range, subFlock);
                this.topLeft.find(range, subFlock);
                this.bottomRight.find(range, subFlock);
                this.bottomLeft.find(range, subFlock);
            }
        }
        return subFlock

    }

    clear()
    {
        this.boidsList = [];

        for (let i = 0 ; i < this.subTrees.length ; i ++)
        {
            if (this.subTrees.length)

            {
                this.subTrees[i].clear()
            }
        }
        this.subTrees = [];
        this.split = false;
    }



    insert(boid) {
        if (!this.area.contains(boid))
        {
            return;
        }
        if (this.boidsList.length < this.capacity)
        {
            this.boidsList.push(boid);
        }
        else
        {
            if (!this.split)
            {
                this.subDivide();
            }
            this.topLeft.insert(boid);
            this.topRight.insert(boid);
            this.bottomRight.insert(boid);
            this.bottomLeft.insert(boid);
        }
    }
}


export class Area
{
    constructor(x, y, h, w) {
        this.x = x
        this.y = y
        this.h = h
        this.w = w
    }

    contains(boid)
    {

        return(
            boid.position.value1 >= this.x - this.w &&
            boid.position.value1 <= this.x + this.w &&
            boid.position.value2 >= this.y - this.h &&
            boid.position.value2 <= this.y + this.h
        );
    }


    overlap(range)
    {
        return !(
            range.x - range.w > this.x + this.w ||
            range.x + range.w < this.x - this.w ||
            range.y - range.h > this.y + this.h ||
            range.y + range.h < this.y - this.h
        );
    }
}

export class Circle
{
    constructor(x , y ,r)
    {
        this.x = x;
        this.y = y;
        this.r = r;
        this.rSquared = this.r * this.r;
    }

    have(boid)
    {
        let d = Math.pow((boid.position.value1 - this.x), 2) + Math.pow((boid.position.value2 - this.y), 2);
        return d <= this.rSquared;
    }

    overlaps(area)
    {
        let xDist = Math.abs(area.x - this.x);
        let yDist = Math.abs(area.y - this.y);

        // radius of the circle
        let r = this.r;

        let w = area.w / 2;
        let h = area.h / 2;

        let edges = Math.pow((xDist - w), 2) + Math.pow((yDist - h), 2);

        // no intersection
        if (xDist > (r + w) || yDist > (r + h))
            return false;

        // intersection within the circle
        if (xDist <= w || yDist <= h)
            return true;

        // intersection on the edge of the circle
        return edges <= this.rSquared;
    }

}