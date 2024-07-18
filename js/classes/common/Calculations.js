import Point from "../geometry/Point.js";

export default class Calculations
{
    constructor()
    {

    }

    /**
     * A---*
     * |   |
     * |   |
     * *---B
     * @param {Point} target 
     * @param {Point} pointA 
     * @param {Point} pointB 
     * @returns {boolean}
     */
    static isPointBetweenThosePoints(target, pointA, pointB) {
        if((pointA.x < target.x && target.x <= pointB.x)
         && (pointA.y < target.y && target.y <= pointB.y)) {
            return true;
        }
        return false;
    }

    /**
     * Funkce pro vypocet vzdalenosti mezi temito body
     * @param {int} x_a - pozice na X ose bodu a
     * @param {int} y_a - pozice na Y ose bodu a
     * @param {int} x_b - pozice na X ose bodu b
     * @param {int} y_b - pozice na Y ose bodu b
     */
    static lenghtBetweenTwoPoints(x_a, y_a, x_b, y_b)
    {
        var x_diff = x_a - x_b;
        var y_diff = y_a - y_b;

        return Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2));
        //return Math.floor(Math.sqrt(Math.pow(x_diff, 2) + Math.pow(y_diff, 2)));

    }

    /**
     * Pythagorova veta
     * @param {int} num_1 
     * @param {int} num_2 
     * @returns 
     */
    static pythagor(num_1, num_2)
    {
        return Math.sqrt(Math.pow(num_1, 2) + Math.pow(num_2, 2));
        //return Math.floor(Math.sqrt(Math.pow(num_1, 2) + Math.pow(num_2, 2)));


    }

    /**
     * Funkce vypocita uhel mezi temito body
     * @param {int} x_a - pozice na X ose bodu a
     * @param {int} y_a - pozice na Y ose bodu a
     * @param {int} x_b - pozice na X ose bodu b
     * @param {int} y_b - pozice na Y ose bodu b
     */
    static angleBetweenTwoPoints(x_a, y_a, x_b, y_b)
    {
        var x_diff = x_a - x_b;
        var y_diff = y_a - y_b;

        return Math.atan2(y_diff, x_diff) * 180/Math.PI;

    }

    /**
     *   A
     *   |\
     *   | \ 
     * b |  \ c
     *   |___\
     *  C  a  B
     * 
     * @param {Point} point_B 
     * @param {Number} angle_B 
     * @param {Number} length_c 
     */
    static point_B_angle_B_length_c_get_point_A(point_B, angle_B, length_c, pointAId) {

        // vypocitani delky usecky a
        let lengthA = length_c * Math.cos(angle_B * (Math.PI / 180));
        
        let lengthB = length_c * Math.sin(angle_B * (Math.PI / 180));

        return new Point(pointAId, point_B.x + lengthA, point_B.y + lengthB)

    }

}


