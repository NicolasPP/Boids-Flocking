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
        this.bad = []
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

        let tr = new Area
        (
            this.area.x + this.area.w / 2,
            this.area.y - this.area.h / 2,
            this.area.h/2,
            this.area.w/2

        );
        this.topRight = new QuadTree( tr , this.capacity );// northeast

        let bl = new Area
        (
            this.area.x - this.area.w / 2,
            this.area.y + this.area.h / 2,
            this.area.h/2,
            this.area.w/2
        );
        this.bottomLeft = new QuadTree( bl , this.capacity );//southwest

        let br = new Area
        (
            this.area.x + this.area.w / 2,
            this.area.y + this.area.h / 2,
            this.area.h/2,
            this.area.w/2
        );
        this.bottomRight = new QuadTree( br , this.capacity );//southeast
        this.split = true;
    }

    show()
    {
        console.log("here")
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

    find(range, subFlock)
    {
        if (!subFlock)
        {
            subFlock = []
        }
        if (!this.area.overlaps(range))
        {
            return subFlock;
        }
        else
        {
            for (let b of this.boidsList)
            {
                if (range.contains(b))
                {
                    subFlock.push(b)
                }
            }
            if (this.split)
            {
                this.topRight.find(range, subFlock);
                this.topLeft.find(range, subFlock);
                this.bottomRight.find(range, subFlock);
                this.bottomLeft.find(range, subFlock);
            }
        }
        return subFlock

    }

    addList(list, list2)
    {
        for(let b of list1)
        {
            list2.push(b)
        }
    }

    // clear()
    // {
    //     for ()
    // }



    insert(boid)
    {
        if (!this.area.contains(boid))
        {
            this.bad.push(boid)
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
            boid.x >= this.x - this.w &&
            boid.x <= this.x + this.w &&
            boid.y >= this.y - this.h &&
            boid.y <= this.y + this.h
        );
    }


    overlaps(range)
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

    contains(boid)
    {
        let d = Math.pow((boid.x - this.x), 2) + Math.pow((boid.y - this.y), 2);
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