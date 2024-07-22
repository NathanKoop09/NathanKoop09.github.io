class floater{
    constructor(start_width_ratio, width_to_height_ratio, imgSrc){
        this.start_width_ratio = start_width_ratio;
        this.width_to_height_ratio = width_to_height_ratio;
        this.imgSrc = imgSrc;
        this.element = null;
        this.width = 0;
        this.trans = 1;
        this.alive_time = 0;
    }
}

const fl1 = new floater(0.339, 0.1799, './images/formulas/01.png');
const fl2 = new floater(0.321, 0.1495, './images/formulas/02.png');
const fl3 = new floater(0.272, 0.1764, './images/formulas/03.png');
const fl4 = new floater(0.298, 0.1442, './images/formulas/04.png');
const fl5 = new floater(0.253, 0.1541, './images/formulas/05.png');
const fl6 = new floater(0.192, 0.1718, './images/formulas/06.png');
const fl7 = new floater(0.225, 0.2888, './images/formulas/07.png');
const fl8 = new floater(0.150, 0.2733, './images/formulas/08.png');
const fl9 = new floater(0.223, 0.2780, './images/formulas/09.png');
const fl10 = new floater(0.304, 0.2894, './images/formulas/10.png');
const fl11 = new floater(0.275, 0.2400, './images/formulas/11.png');
const fl12 = new floater(0.318, 0.2012, './images/formulas/12.png');
const fl13 = new floater(0.379, 0.0976, './images/formulas/13.png');
const fl14 = new floater(0.129, 0.3023, './images/formulas/14.png');
const fl15 = new floater(0.254, 0.1614, './images/formulas/15.png');
const fl16 = new floater(0.359, 0.2451, './images/formulas/16.png');
const fl17 = new floater(0.289, 0.2698, './images/formulas/17.png');
const fl18 = new floater(0.182, 0.2527, './images/formulas/18.png');
const fl19 = new floater(0.234, 0.1752, './images/formulas/19.png');
const fl20 = new floater(0.155, 0.5677, './images/formulas/20.png');
const fl21 = new floater(0.178, 0.5112, './images/formulas/21.png');
const fl22 = new floater(0.089, 0.8539, './images/formulas/22.png');
const fl23 = new floater(0.259, 0.4169, './images/formulas/23.png');
const floaters = [fl1,fl2,fl3,fl4,fl5,fl6,fl7,fl8,fl9,fl10,fl11,fl12,fl13,fl14,fl15,fl16,fl17,fl18,fl19,fl20,fl21,fl22,fl23];
const spawned_objects = [];
const ALIVE_TIME = 10000;
const GROWTH_MULTIPLIER = 2;
const NUM_OBJECTS = 16;

const nodes = [[false, false, false, false, false],[false, false, false, false, false],[false, false, false, false, false],[false, false, false, false, false]];
var threads = 0;
let adj_id = setInterval(adjust_objects, 20);
start_spawn_thread();

function start_spawn_thread(){
    spawn_object();
    threads++;
    setInterval(spawn_object,ALIVE_TIME);
    if(threads<NUM_OBJECTS){
        setTimeout(start_spawn_thread, Math.floor(ALIVE_TIME/NUM_OBJECTS));
    }
}
function adjust_objects(){
    if(!document.hasFocus()){
        return;
    }
    for(let i = 0; i<spawned_objects.length; i++){
        var e = spawned_objects[i].element;
        spawned_objects[i].alive_time+=20;
        if(spawned_objects[i].alive_time >= ALIVE_TIME){
            e.remove();
            spawned_objects.splice(i,1);
            return;
        }
        if(i==0){
            console.log(e.style.left, e.style.top);
        }
        var x = Number(e.style.left.slice(0,e.style.left.length-2));
        var y = Number(e.style.top.slice(0,e.style.top.length-2));
        var w = Math.floor(document.body.offsetWidth*spawned_objects[i].start_width_ratio);
        var width_scale_delta = (w*(GROWTH_MULTIPLIER-1)*25)/ALIVE_TIME;
        var height_scale_delta = Math.floor(width_scale_delta*spawned_objects[i].width_to_height_ratio);
        w = spawned_objects[i].width+width_scale_delta;
        var h = Math.floor(w*spawned_objects[i].width_to_height_ratio)+height_scale_delta;
        e.style.width = w+'px';
        e.style.height = h+'px';
        spawned_objects[i].width = spawned_objects[i].width+width_scale_delta;
        
        e.style.opacity = 1-(spawned_objects[i].alive_time/ALIVE_TIME);
        e.style.left = (x-(width_scale_delta/2)).toString()+'px';
        e.style.top = (y-(height_scale_delta/2)).toString()+'px';
    }
}

//minpx and maxpx are cordinates of corners
function get_rect_bounds(minpx, maxpx, rectNum){
    var midx = minpx[0]+((maxpx[0]-minpx[0])/2);
    var midy = minpx[1]+((maxpx[1]-minpx[1])/2);
    if(rectNum==0){
        return [minpx, [midx, midy]];
    }
    if(rectNum==1){
        return[[midx,minpx[1]],[maxpx[0],midy]];
    }
    if(rectNum==2){
        return[[minpx[0],midy],[midx,maxpx[1]]];
    }
    return[[midx, midy], maxpx];
}

function get_node_spawning_position(){
    //define position variables
    let parent_rect = null;
    let child_rect = null;
    let minpx = [0,100];
    let maxpx = [document.body.offsetWidth-379, document.body.offsetHeight-108];

    let debug_index = -1;

    //select node
    var avail_nodes = [];
    for(let i = 0; i<nodes.length; i++){
        if(!nodes[i][0]){
            avail_nodes[avail_nodes.length] = i;
        }
    }
    let selected_node = null;
    if(avail_nodes.length == 0){
        for(let i = 0; i<nodes.length; i++){
            nodes[i][0] = false;
        }
        let index = Math.floor(Math.random()*nodes.length)
        selected_node = nodes[index];
        nodes[index][0] = true;
        debug_index = index;
        parent_rect = get_rect_bounds(minpx, maxpx, index);
    }else{
        let index = avail_nodes[Math.floor(Math.random()*avail_nodes.length)];
        selected_node = nodes[index];
        nodes[index][0] = true;
        debug_index = index
        parent_rect = get_rect_bounds(minpx, maxpx, index);
    }

    //select subnode
    var avail_subs = [];
    for(let i = 1; i<selected_node.length; i++){
        if(!selected_node[i]){
            avail_subs[avail_subs.length] = i;
        }
    }
    if(avail_subs.length == 0){
        for(let i = 1; i<selected_node.length; i++){
            selected_node[i] = false;
        }
        let index = Math.floor(Math.random()*(selected_node.length-1))+1
        child_rect = get_rect_bounds(parent_rect[0], parent_rect[1], index-1);
        selected_node[index] = true;
    }else{
        let index = avail_subs[Math.floor(Math.random()*avail_subs.length)];
        selected_node[index] = true;
        child_rect = get_rect_bounds(parent_rect[0], parent_rect[1], index-1);
    }

    //console.log(nodes);

    //return spawn position
    return [(Math.random()*(child_rect[1][0]-child_rect[0][0])) + child_rect[0][0], (Math.random()*(child_rect[1][1]-child_rect[0][1])) + child_rect[0][1]];
}

function spawn_object(){
    if(floaters.length >= 2*NUM_OBJECTS || !document.hasFocus()){
        return;
    }
    var chosen_obejct = floaters[Math.floor(Math.random()*floaters.length)];
    var object = document.createElement("img");
    object.setAttribute('src', chosen_obejct.imgSrc);
    object.setAttribute('alt', "formula");
    object.style.position = "absolute";
    let w = Math.floor(document.body.offsetWidth*chosen_obejct.start_width_ratio);
    object.style.width = w.toString()+'px';
    var h = w*chosen_obejct.width_to_height_ratio;
    object.style.height = h.toString()+'px';
    let position = get_node_spawning_position();
    let x = position[0]-(w/2);
    let y = position[1]-(h/2);

    object.style.left = x+'px';
    object.style.top = y+'px';
    object.style.zIndex = -1;
    object.style.overflow = "hidden";
    var clone = structuredClone(chosen_obejct);
    clone.width = w;
    clone.element = object;
    document.body.appendChild(object);
    spawned_objects[spawned_objects.length] = clone;
}