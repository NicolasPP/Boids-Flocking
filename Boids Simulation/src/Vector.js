export class Vector
{
    constructor(value1, value2)
    {
        this.value1 = value1;
        this.value2 = value2;
    }

    add(vec)
    {
        return new Vector((this.value1 + vec.value1) , (this.value2 + vec.value2));
    }

    div(num)
    {
        return new Vector((this.value1 / num) , (this.value2 / num) )
    }

    subtract(vec)
    {
        return new Vector((this.value1 - vec.value1) , (this.value2 - vec.value2));
    }

    multiply(num)
    {
        return new Vector(this.value1 * num , this.value2 * num)
    }

    angleBetween(vec)
    {
        return Math.acos(this.scalarProduct(vec) / this.getLength() * vec.getLength())
    }

    getDirectionAngle()
    {
        return Math.atan(this.value2 / this.value1)
    }

    scalarProduct(vec)
    {
        return (this.value1 * vec.value1) + (this.value2 * vec.value2)
    }

    getLength()
    {
        return Math.sqrt((this.value1 * this.value1) + (this.value2 * this.value2))
    }

    dist(vec)
    {
        return Math.sqrt((this.value1 - vec.value1) ** 2 + (this.value2 - vec.value2) ** 2 )
    }

    setMag(len)
    {
        return this.unit().multiply(len)
    }

    limit(max)
    {
        const magSq = this.magSq()
        const mag = this.getLength()
        let result = new Vector(0,0);
        if(magSq > max * max )
        {
            result = this.div(mag);
            result = result.multiply(max)
        }
        return result
    }

    magSq()
    {
        return (this.value1 * this.value1) + (this.value2 * this.value2)
    }

    unit()
    {
        let mag = this.getLength()
        return new Vector((this.value1 / mag) , (this.value2 / mag))

    }
}