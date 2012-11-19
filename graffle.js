
Raphael.fn.get_button_coordinate = function (path) {
    return path.getPointAtLength(path.getTotalLength()/2);
    };

Raphael.fn.connection = function (obj1, obj2, line, bg) {
    if (obj1.line && obj1.from && obj1.to) {
        line = obj1;
        obj1 = line.from;
        obj2 = line.to;
    }
    var bb1 = obj1.getBBox(),
        bb2 = obj2.getBBox(),
        p = [{x: bb1.x + bb1.width / 2, y: bb1.y - 1},
        {x: bb1.x + bb1.width / 2, y: bb1.y + bb1.height + 1},
        {x: bb1.x - 1, y: bb1.y + bb1.height / 2},
        {x: bb1.x + bb1.width + 1, y: bb1.y + bb1.height / 2},
        {x: bb2.x + bb2.width / 2, y: bb2.y - 1},
        {x: bb2.x + bb2.width / 2, y: bb2.y + bb2.height + 1},
        {x: bb2.x - 1, y: bb2.y + bb2.height / 2},
        {x: bb2.x + bb2.width + 1, y: bb2.y + bb2.height / 2}],
        d = {}, dis = [];
    for (var i = 0; i < 4; i++) {
        for (var j = 4; j < 8; j++) {
            var dx = Math.abs(p[i].x - p[j].x),
                dy = Math.abs(p[i].y - p[j].y);
            if ((i == j - 4) || (((i != 3 && j != 6) || p[i].x < p[j].x) && ((i != 2 && j != 7) || p[i].x > p[j].x) && ((i != 0 && j != 5) || p[i].y > p[j].y) && ((i != 1 && j != 4) || p[i].y < p[j].y))) {
                dis.push(dx + dy);
                d[dis[dis.length - 1]] = [i, j];
            }
        }
    }
    if (dis.length == 0) {
        var res = [0, 4];
    } else {
        res = d[Math.min.apply(Math, dis)];
    }
    var x1 = p[res[0]].x,
        y1 = p[res[0]].y,
        x4 = p[res[1]].x,
        y4 = p[res[1]].y;
    dx = Math.max(Math.abs(x1 - x4) / 2, 10);
    dy = Math.max(Math.abs(y1 - y4) / 2, 10);
    var x2 = [x1, x1, x1 - dx, x1 + dx][res[0]].toFixed(3),
        y2 = [y1 - dy, y1 + dy, y1, y1][res[0]].toFixed(3),
        x3 = [0, 0, 0, 0, x4, x4, x4 - dx, x4 + dx][res[1]].toFixed(3),
        y3 = [0, 0, 0, 0, y1 + dy, y1 - dy, y4, y4][res[1]].toFixed(3);
    var path = ["M", x1.toFixed(3), y1.toFixed(3), "C", x2, y2, x3, y3, x4.toFixed(3), y4.toFixed(3)].join(",");

    if (line && line.line) {
        line.bg && line.bg.attr({path: path});
        line.line.attr({path: path});
        var button_coordinates = this.get_button_coordinate(line.line);
        line.circle.attr({cx: button_coordinates.x, cy: button_coordinates.y});
    } else {
        var color = typeof line == "string" ? line : "#000";
        var relation = this.path(path); 
        var button_coordinates = this.get_button_coordinate(relation);
        //circles[obj1.id] = [];
        //alert(obj1.id+"--"+obj2.id);
        //circles[obj1.id][obj2.id]=this.circle(button_coordinates.x, button_coordinates.y, 13).attr({fill: "#ccc", stroke: "#fff", "stroke-width": 2})
        return {
            bg: bg && bg.split && relation.attr({stroke: bg.split("|")[0], fill: "none", "stroke-width": bg.split("|")[1] || 3}),
            line: relation.attr({stroke: color, fill: "none"}),
            from: obj1,
            to: obj2,
            circle: this.circle(button_coordinates.x, button_coordinates.y, 13).attr({fill: "#ccc", stroke: "#fff", "stroke-width": 2})
        };
    }
};

var el;
window.onload = function () {
    var dragger = function () {
        this.title.hide();

        //Hide from connections
        for (var kk in this.moves) {
            this.moves[kk].circle_text.hide();
            }

        //Hide to connections
        for (var k in shapes) {
            for (kk in shapes[k].moves)
                {
                if(kk==this.id)
                    {
                    shapes[k].moves[kk].circle_text.hide();
                    }
                }
            }

        this.ox = this.type == "rect" ? this.attr("x") : this.attr("cx");
        this.oy = this.type == "rect" ? this.attr("y") : this.attr("cy");
        this.animate({"fill-opacity": .2}, 500);
    },
        move = function (dx, dy) {
            var att = this.type == "rect" ? {x: this.ox + dx, y: this.oy + dy} : {cx: this.ox + dx, cy: this.oy + dy};
            this.attr(att);
            for (var i = connections.length; i--;) {
                r.connection(connections[i]);
            }
            r.safari();
        },
        up = function () {
            this.title.show();
            this.animate({"fill-opacity": 0}, 500);
            //alert(this.title.getBBox().x)
            this.title.attr({x: this.getBBox().x+10, y: this.getBBox().y+20})

            //Show from connections
            for (var kk in this.moves) {
                this.moves[kk].circle_text.show().attr({x: this.moves[kk].circle.getBBox().x+12, y: this.moves[kk].circle.getBBox().y+13});
                }
            //Show to connections
            for (var k in shapes) {
                for (kk in shapes[k].moves)
                    {
                    if(kk==this.id)
                        {
                        shapes[k].moves[kk].circle_text.show().attr({x: shapes[k].moves[kk].circle.getBBox().x+12, y: shapes[k].moves[kk].circle.getBBox().y+13});
                        }
                    }
                }
        },

        get_reverse_move_num = function (from_id, to_id) {
            if(typeof issues_moves[from_id] == 'undefined')
                return 0;
            else
                {
                if(typeof issues_moves[from_id][to_id] == 'undefined')
                    return 0;
                else
                    return issues_moves[from_id][to_id];
                }
        },


        r = Raphael("holder", 640, 480),

        connections = [];
        statuses = [];
        
        issues_moves = [];
        issues_buttons = [];
        circles = [];
        

        issues_moves[2] = [];
        issues_moves[2][4] = 1;
        issues_moves[2][5] = 2;

        issues_moves[4] = [];
        issues_moves[4][5] = 3;

        issues_moves[6] = [];
        issues_moves[6][12] = 9;
        issues_moves[12] = [];
        issues_moves[12][6] = 17;
        issues_moves[12][12] = 17;

        issues_moves[5] = [];
        issues_moves[5][12] = 9;
        issues_moves[5][21] = 2;
        issues_moves[5][6] = 5;

        issues_moves[21] = [];
        issues_moves[21][63] = 0;

        issues_moves[41] = [];
        issues_moves[41][63] = 1;

        issues_button_counts = [];

        statuses[2] = "Новая";
        statuses[4] = "В очереди";
        statuses[5] = "В работе";
        statuses[12] = "Закрыта";
        statuses[41] = "На проверке";
        statuses[6] = "Проверена";
        statuses[21] = "Выполнена";
        statuses[63] = "В эксплуатации";

        shapes = [];
        titles = [];

        var i=0;
        for (var k = 0 in statuses) 
            {
            var x = i*70+10;
            if(i%2 == 0)
                {
                var y = 100;
                }
            else
                {
                if(i%3 == 0)
                    var y = 200;
                else
                    var y = 10;
                }

            shapes[k]=r.rect(x, y, 60, 40, 10);
            attr = {font: "10pt Helvetica", opacity: 1};
            titles[k] = r.text(x+10, y+20, statuses[k]).attr(attr).attr({fill: "#fff"}).attr({'text-anchor': 'start'});
            shapes[k].attr({width: titles[k].getBBox().width+20});
            shapes[k].title=titles[k]
            shapes[k].id=k
            shapes[k].moves = []
            //alert();
            i++;
            };


    for (var k in shapes) {
        var color = Raphael.getColor();
        shapes[k].attr({fill: color, stroke: color, "fill-opacity": 0, "stroke-width": 2, cursor: "move"});
        shapes[k].drag(move, dragger, up);
    };

    for (var k in issues_moves) {
        for (var kk in issues_moves[k]) {
            if(k==kk)
                {
                r.circle(shapes[k].getBBox().x+shapes[k].getBBox().width+10, shapes[k].getBBox().y+shapes[k].getBBox().height/2, 13).attr({fill: "#ccc", stroke: "#fff", "stroke-width": 2})
                shapes[k].attr({width: shapes[k].getBBox().width+30});
                }
            else
                {
                if(typeof shapes[kk].moves[k] == 'undefined')
                    {
                    var conn = r.connection(shapes[k], shapes[kk], "#fff", "#fff|3");
                    var attr = {font: "9pt Helvetica", opacity: 1, 'font-weight': 'bold'};
                    var circle_bbox = conn.circle.getBBox();
                    conn.circle_text = r.text(circle_bbox.x+12, circle_bbox.y+13, issues_moves[k][kk]+get_reverse_move_num(kk, k)).attr(attr).attr({fill: "#000"}) //shapes[k].attr('stroke')
                    connections.push(conn);
                    
                    shapes[k].moves[kk] = conn
                    }
                }
            }
    };

};
