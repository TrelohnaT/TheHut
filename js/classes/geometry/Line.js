
import Point from "./Point.js";
import Calculations from "../common/Calculations.js";
import Vector from "./Vector.js";


/**
 * Trida pro modelovani usecek (car)
 */
export default class Line
{
    /**
     * construktor pro novou instanci linky
     * @param {string} id - ID dane primky
     */
    constructor(id, x_start, y_start, x_end, y_end)
    {
        this.id = id;
        this.kind = "line";

        this.point_start = new Point("start_line_" + id, x_start, y_start);
        this.point_end = new Point("end_line_" + id, x_end, y_end);

        this.color = "#000000";

        // nastaveni barvy bodu
        this.point_start.color = "#FF0000";

        this.point_end.color = "#0000FF";
        
        this.angle_to_base = 0;

        //this.point_start.x = x_start;
        //this.point_start.y = y_start;
        //this.point_end.x = x_end;
        //this.point_end.y = y_end;

        this.vector_start_end = null;

        this.do_calculations();


        /**
         * a parametr v obecne rovnici primky
         */
        this.a = null;

        /**
         * b parametr v obecne ronvici primky
         */
        this.b = null;

        /**
         * c parameter v obecne rovnici primky
         */
        this.c = null;
        

    }


    draw_me(ctx, drawPoints = false)
    {
        // vykresleni bodu teto usecky
        if(drawPoints) {
            this.point_start.draw_me(ctx);
            this.point_end.draw_me(ctx);
        }
        // vykresleni teto usecky jako takove
        ctx.moveTo(this.point_start.x, this.point_start.y);
        ctx.lineTo(this.point_end.x, this.point_end.y);
        ctx.strokeStyle = this.color;
        ctx.stroke();


    }

    do_calculations()
    {
        this.vector_start_end = new Vector(this.id + "_vector_start_end", this.point_start, this.point_end);

        //this.set_middle_point();

        this.angle_to_base_calculation();

    }

    angle_to_base_calculation()
    {

        var rad_angle = this.vector_start_end.x / this.vector_start_end.get_length();

        //console.log("vector - X: " + this.vector_start_end.x + " Y: " + this.vector_start_end.y);

        //console.log(this.id + " acos: " + Math.acos(rad_angle));


        // this make sure the rotation wokrs as it should
        let tmp = 0;
        // this is how I know I am under or upper the start point
        if(this.vector_start_end.y < 0)
        {
            //this.angle_to_base = 180 - (Math.floor(Math.acos(rad_angle)  * (180/Math.PI)));
            tmp = -1 * (Math.acos(rad_angle) * (180 / Math.PI));
        }
        else
        {
            // this returns number 1 - 180 no matter if it is up or under zero
            tmp = (Math.acos(rad_angle)  * (180/Math.PI));
        }
        this.angle_to_base = 180 + tmp;


    }

    /**
     * Funkce pro ziskani ID teto instance
     */
    get_id()
    {
        return this.id;
    }

    get_kind()
    {
        return this.kind;
    }

    get_angle_to_base()
    {
        return this.angle_to_base;
    }

    /**
     * Funkce pro pristup k dvou bodu ktere definuji tuto usecku
     * @param {string} kind - start / middle / end
     */
    get_point(kind)
    {
        //console.log(this.id + ".get_point: " + kind);

        var to_return = null;

        if(kind == "start")
        {
            to_return = this.point_start;

        }
        else if(kind == "end")
        {
            to_return = this.point_end;

        }
        else
        {
            console.log(id + ".get_point: Unknown point kind")

        }

        //console.log("...returning: " + to_return);
        return to_return;

    }

    /**
     * Funkce pro ziskani parametru obecne rovnice teto primky
     * @param {string} name - a / b / c
     */
    get_general_formula_parameter(name)
    {
        if(name == "a")
        {
            return this.a;
        }
        else if(name == "b")
        {
            return this.b;
        }
        else if(name == "c")
        {
            return this.c;
        }
        else
        {
            console.log("line_cl.get_general_formula_parameter: Unknown parameter: " + name);
            return null;
        }

    }

    /**
     * Funkce pro ziskani vektoru od pocatecniho bodu ke konecnemu bodu
     */
    get_vector()
    {
        return this.vector_start_end;

    }

    get_lenght()
    {
        return this.vector_start_end.get_length();
    }

    get_size_of_hitcircle()
    {
        return this.size_of_hitcircle;
    }

    /**
     * Funkce pro nastavovani souradnic pro body teto usecky
     * @param {string} kind - start / end
     * @param {int} x_new - souradnice na X ose
     * @param {int} y_new - souradnice na Y ose
     */
    set_point(kind, x_new, y_new)
    {
        //console.log("set_point: kind: " + kind + " X: " + x_new + " Y: " + y_new);

        if(kind == "start")
        {
            this.point_start.set_x_and_y(x_new, y_new);

        }
        else if(kind == "end")
        {
            this.point_end.set_x_and_y(x_new, y_new);


        }
        else
        {
            console.log("Error, uknown kind or point: " + kind);

        }

    }

    set_points(point_start, point_end)
    {
        this.point_start = point_start;
        this.point_end = point_end;

        this.do_calculations();

    }

    /**
     * Funkce pro vypis informaci o teto usecce
     */
    print_info()
    {
        console.log("Line: " + this.id);
        this.point_start.print_info();
        this.point_end.print_info();

        this.vector_start_end.print_info();

        console.log("Angle to base: " + this.angle_to_base);

    }


}




