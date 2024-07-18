
import Point from "./Point.js";
import Line from "./Line.js";
import Calculations from "../common/Calculations.js";
//import Calculations from "../common/Calculations.js";

export default class Triangle
{

    constructor(id)
    {
        this.id = id;
        this.kind = "triangle";

        // indexy pro jednotlive oznaceni bodu
        this.index_A = 0;
        this.index_B = 1;
        this.index_C = 2;

        // pole s body serazenymi dle indexu
        this.points = Array();
        this.points.push(new Point(this.id + "_point_A"));
        this.points.push(new Point(this.id + "_point_B"));
        this.points.push(new Point(this.id + "_point_C"));

        // pole s uhly serazenymi dle indexu
        this.angles = Array();
        this.angles.push(-1);
        this.angles.push(-1);
        this.angles.push(-1);

        // delky jednotlivych usecek (stran)
        this.lengths_lines = Array();
        this.lengths_lines.push(-1);
        this.lengths_lines.push(-1);
        this.lengths_lines.push(-1);

        // pole s useckami sreazenymi dle indexu
        this.lines = Array();
        this.lines.push(new Line(id + "_line_a", -1, -1, -1, -1));
        this.lines.push(new Line(id + "_line_b", -1, -1, -1, -1));
        this.lines.push(new Line(id + "_line_c", -1, -1, -1, -1));

        this.lines_to_draw = Array();
        this.lines_to_draw.push(true);
        this.lines_to_draw.push(true);
        this.lines_to_draw.push(true);

        

    }

    /**
     * Vykreslonavi je potrizeno poli lines_to_draw
     * @param {*} ctx 
     */
    draw_me(ctx)
    {


        if(this.lines_to_draw[this.index_A])
        {
            this.lines[this.index_A].draw_me(ctx);
        }

        if(this.lines_to_draw[this.index_B])
        {
            this.lines[this.index_B].draw_me(ctx);
        }
        
        if(this.lines_to_draw[this.index_C])
        {
            this.lines[this.index_C].draw_me(ctx);
        }


    }

    /**
     * 
     * 
     *   A
     *   |\
     *   | \ 
     * b |  \ c
     *   |___\
     *  C  a  B
     * 
     * @param {*} point_B - instance bodu B
     * @param {*} angle_B - uhel v bodu B
     * @param {*} length_c - delka strany c
     * @param {*} direction - tl / tr / bl / br - smer odvesny
     */
    point_B_angle_B_length_c_direction(point_B, angle_B, length_c)
    {
        //console.log("point_B_angle_B_lenght_c_direction");
        this.angles[this.index_C] = 90;
        this.angles[this.index_B] = angle_B;
        this.angles[this.index_A] = 180 - (this.angles[this.index_B] + this.angles[this.index_C]);

        this.points[this.index_B] = point_B;
        
        this.lengths_lines[this.index_C] = length_c;

        // vypocitani delky usecky a
        this.lengths_lines[this.index_A] = this.lengths_lines[this.index_C] * Math.cos(this.angles[this.index_B] * (Math.PI / 180));
        
        // vypocet delky usecky b
        this.lengths_lines[this.index_B] = this.lengths_lines[this.index_C] * Math.sin(this.angles[this.index_B] * Math.PI / 180);
        
        // vypocet a inicializace bodu C
        this.points[this.index_C].set_x_and_y(this.points[this.index_B].x + this.lengths_lines[this.index_A], this.points[this.index_B].y);

        // vypocet a inicializace bodu A
        this.points[this.index_A].set_x_and_y(this.points[this.index_C].x, this.points[this.index_C].y + this.lengths_lines[this.index_B]);

        // inicializace usecky a
        this.lines[this.index_A].set_points(this.points[this.index_C], this.points[this.index_B]);

        // inicializace usecky b
        this.lines[this.index_B].set_points(this.points[this.index_A], this.points[this.index_C]);

        // inicializace usecky c
        this.lines[this.index_C].set_points(this.points[this.index_B], this.points[this.index_A]);

    }


    /**
     * 
     * 
     *   A
     *   |\
     *   | \ 
     * b |  \ c
     *   |___\
     *  C  a  B
     * 
     * 
     */
    point_B_length_a_length_b(point_B, length_a, length_b)
    {
        this.angles[this.index_A] = null;
        this.angles[this.index_B] = null;
        this.angles[this.index_C] = 90;

        this.points[this.index_A].set_points(point_B.x + length_a, point_B.y);
        this.points[this.index_B] = point_B;
        this.points[this.index_A].set_x_and_y(point_B.x + length_a, point_B.y + length_b);

        this.lengths_lines[this.index_A] = length_a;
        this.lengths_lines[this.index_B] = length_b;
        this.lengths_lines[this.index_C] = Calculations.lenghtBetweenTwoPoints(this.points[this.index_A].x, this.points[this.index_A].y, this.points[this.index_B].x, this.points[this.index_B].y);

        // inicializace usecky a
        this.lines[this.index_A].set_points(this.points[this.index_C], this.points[this.index_B]);

        // inicializace usecky b
        this.lines[this.index_B].set_points(this.points[this.index_A], this.points[this.index_C]);

        // inicializace usecky c
        this.lines[this.index_C].set_points(this.points[this.index_B], this.points[this.index_A]);

    }

    /**
     * 
     * 
     *   A
     *   |\
     *   | \ 
     * b |  \ c
     *   |___\
     *  C  a  B
     * 
     * 
     */
    point_B_point_C_length_b(point_B, point_C, length_b)
    {
        this.angles[this.index_A] = null;
        this.angles[this.index_B] = null;
        this.angles[this.index_C] = 90;

        this.points[this.index_A].set_x_and_y(point_C.x, point_C.y + length_b);
        this.points[this.index_B] = point_B;
        this.points[this.index_C] = point_C;
    
        this.lengths_lines[this.index_A] = Calculations.lenghtBetweenTwoPoints(point_B.x, point_B.y, point_C.x, point_C.y);
        this.lengths_lines[this.index_B] = length_b;
        this.lengths_lines[this.index_C] = Calculations.lenghtBetweenTwoPoints(this.points[this.index_A].x, this.points[this.index_A].y, this.points[this.index_B].x, this.points[this.index_B].y);
        
        // inicializace usecky a
        this.lines[this.index_A].set_points(this.points[this.index_C], this.points[this.index_B]);

        // inicializace usecky b
        this.lines[this.index_B].set_points(this.points[this.index_A], this.points[this.index_C]);

        // inicializace usecky c
        this.lines[this.index_C].set_points(this.points[this.index_B], this.points[this.index_A]);



    }

    /**
     * 
     * 
     *   A
     *   |\
     *   | \ 
     * b |  \ c
     *   |___\
     *  C  a  B
     * 
     * 
     */
    point_A_point_B(point_A, point_B)
    {

        //this.angles[this.index_C] = 90;

        this.points[this.index_A] = point_A;
        this.points[this.index_B] = point_B;
        this.points[this.index_C] = new Point(this.id + "_point_C", this.points[this.index_A].x, this.points[this.index_B].y);

        this.lines[this.index_A] = new Line(this.id + "_line_a", this.points[this.index_C].x, this.points[this.index_C].y, this.points[this.index_B].x, this.points[this.index_B].y);
        this.lines[this.index_B] = new Line(this.id + "_line_b", this.points[this.index_A].x, this.points[this.index_A].y, this.points[this.index_C].x, this.points[this.index_C].y);
        this.lines[this.index_C] = new Line(this.id + "_this_c", this.points[this.index_B].x, this.points[this.index_B].y, this.points[this.index_A].x, this.points[this.index_A].y);


        this.angles[this.index_A] = this.lines[this.index_A].get_angle_to_base();
        this.angles[this.index_B] = this.lines[this.index_B].get_angle_to_base();
        this.angles[this.index_C] = this.lines[this.index_C].get_angle_to_base();

        this.lengths_lines[this.index_C] = this.lines[this.index_C].get_lenght();
        

        //console.log(this.id + " lenght " + this.lines[this.index_C].get_lenght());

    }


    /**
     * 
     * @param {Point} point_A - instance bodu A
     * @param {Point} point_B - instance bodu B
     * @param {int} angle_A - velikost uhlu v bodu A
     */
    point_point_angle_angle(point_A, point_B, angle_A, angle_B)
    {   
        this.points[this.index_A] = point_A;
        this.points[this.index_B] = point_B;

        this.angles[this.index_A] = angle_A;
        this.angles[this.index_B] = angle_B;

        this.lines[this.index_C].set_point("start", point_A.x, point_A.y);
        this.lines[this.index_C].set_point("end", point_B.x, point_B.y);
        this.lines[this.index_C].do_calculations();

        this.points[this.index_C].set_x()


        //this.print_info();
    }

    get_id()
    {
        return this.id;
    }

    get_kind()
    {
        return this.kind;
    }

    /**
     * 
     * @param {string} name - A / B / C
     */
    get_point(name)
    {
        if(name == "A")
        {
            return this.points[this.index_A];
        }
        else if(name == "B")
        {
            return this.points[this.index_B];
        }
        else if(name == "C")
        {
            return this.points[this.index_C];
        }
        else
        {
            console.log("Triangle ID: " + this.id + " unknown name of point: " + name);
        }
    }

    /**
     * Funkce pro ziskani uhlu z trouhelniku
     * @param {String} name - Nazev vrcholu od ktereho chceme uhel - A / B / C
     */
    get_angle(name)
    {
        if(name == "A")
        {
            return this.angles[this.index_A];
        }
        else if(name == "B")
        {
            return this.angles[this.index_B];
        }
        else if(name == "C")
        {
            return this.angles[this.index_C];
        }
        else
        {
            console.log("Triangle ID: " + this.id + " unknown name of point: " + name);
        }

    }

    /**
     * Funkce pro vraceni delky stran
     * @param {String} name - nazev strany ktere delku chceme - A / B / C
     */
    get_length(name)
    {
        if(name == "A")
        {
            return this.lengths_lines[this.index_A];
        }
        else if(name == "B")
        {
            return this.lengths_lines[this.index_B];
        }
        else if(name == "C")
        {
            return this.lengths_lines[this.index_C];
        }
        else
        {
            console.log("Triangle ID: " + this.id + " unknown name of point: " + name);
        }

    }

    /**
     * 
     * 
     *   A
     *   |\
     *   | \ 
     * b |  \ c
     *   |___\
     *  C  a  B
     * 
     * Funkce pro nastaveni jake linie se maji vykreslit
     * @param {Boolean} line_a - pokud true, linka a se vykresli
     * @param {Boolean} line_b - pokud true, linka b se vykresli
     * @param {Boolean} line_c - pokud true, linka c se vykresli
     */
    set_lines_to_draw(line_a, line_b, line_c)
    {
        this.lines_to_draw[this.index_A] = line_a;
        this.lines_to_draw[this.index_B] = line_b;
        this.lines_to_draw[this.index_C] = line_c;
    }

    print_info()
    {
        console.log("Triangle ID: " + this.id);

        for(var i = 0; i < this.points.length; i++)
        {
            this.points[i].print_info();
            console.log("Angle - index: " + i + " : " + this.angles[i]);
            //this.lines[i].print_info();
            //console.log("length - index: " + i + " : " + this.lengths_lines[i]);

        }


    }
    
}



