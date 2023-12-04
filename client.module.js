import {
    O_vec2, 
    O_vec3, 
    O_vec4
} from "https://deno.land/x/vector@1.1/mod.js"
// window.O_vec2 = O_vec2
import { 
    o_variables, 
    f_s_css_from_o_variables,
    f_add_css,
} from "https://deno.land/x/f_add_css@0.8/mod.js"

import {
    f_o_html__and_make_renderable,
    f_o_jsh__select
} from "https://deno.land/x/f_o_html_from_o_js@2.0/mod.js"

  // o_variables.n_rem_font_size_base = 1.2
  f_add_css(
    f_s_css_from_o_variables(
      o_variables
    )
  );
  f_add_css(
    `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css`
  )

class O_file{
    constructor(
        o_js_file, 
        v_data,
        s_mime_type,
        s_name
    ){
        this.o_js_file = o_js_file, 
        this.v_data = v_data
        this.s_mime_type = s_mime_type
        this.s_name = s_name
    }
}
class O_paper_format{
    constructor(
        s_name, 
        o_scl_mm
    ){
        this.s_name = s_name
        this.o_scl_mm = o_scl_mm
    }
}
let a_o_paper_format = [
    new O_paper_format(
        'DIN A4', 
        new O_vec2(210,297)
    ), 
    new O_paper_format(
        'DIN A3', 
        new O_vec2(297,420)
    ),
    new O_paper_format(
        'DIN A5', 
        new O_vec2(148, 210)
    ),
    new O_paper_format(
        'DIN A2', 
        new O_vec2(420, 594)
    ),
    new O_paper_format(
        'DIN A1', 
        new O_vec2(594, 841)
    ),
    new O_paper_format(
        'DIN A0', 
        new O_vec2(841, 1189)
    ),
    new O_paper_format(
        'DIN B4', 
        new O_vec2(250, 353)
    ),
    new O_paper_format(
        'DIN B5', 
        new O_vec2(176, 250)
    ),
    new O_paper_format(
        'DIN B3', 
        new O_vec2(353, 500)
    ),
    new O_paper_format(
        'DIN B2', 
        new O_vec2(500, 707)
    ),
    new O_paper_format(
        'DIN B1', 
        new O_vec2(707, 1000)
    ),
    new O_paper_format(
        'DIN B0', 
        new O_vec2(1000, 1414)
    ),
    new O_paper_format(
        'DIN C4', 
        new O_vec2(229, 324)
    ),
    new O_paper_format(
        'DIN C5', 
        new O_vec2(162, 229)
    ),
    new O_paper_format(
        'DIN C3', 
        new O_vec2(324, 458)
    ),
    new O_paper_format(
        'DIN C2', 
        new O_vec2(458, 648)
    ),
    new O_paper_format(
        'DIN C1', 
        new O_vec2(648, 917)
    ),
    new O_paper_format(
        'DIN C0', 
        new O_vec2(917, 1297)
    ),
    new O_paper_format(
        'Letter', 
        new O_vec2(216, 279)
    ),
    new O_paper_format(
        'Legal', 
        new O_vec2(216, 356)
    ),
];
class O_unit{
    constructor(
        s_name, 
        n_millimeter
    ){
        this.s_name = s_name
        this.n_millimeter = n_millimeter
    }
}

let o_unit__mm = new O_unit('millimeter', 1)
let o_unit__inch = new O_unit('inch', 25.4);

let a_o_unit = [
    o_unit__mm,
    o_unit__inch,
    new O_unit('centimeter', 10), 
    new O_unit('meter', 1000)
]
let f_n_converted = function(
    n, 
    s_unit__from, 
    s_unit__to
){
    let o_unit__from = o_state.a_o_unit.find(o=>o.s_name == s_unit__from);
    let o_unit__to = o_state.a_o_unit.find(o=>o.s_name == s_unit__to);
    if(!o_unit__from){
        throw Error(`cannot find unit with name '${s_unit__from}'`)
    }
    if(!o_unit__to){
        throw Error(`cannot find unit with name '${s_unit__to}'`)
    }
    let n_ratio = o_unit__from.n_millimeter / o_unit__to.n_millimeter
    return n * n_ratio
}
let o_unit = o_unit__mm;
let o_state = {
    a_o_unit, 
    o_unit,
    o_file: null, 
    a_o_file: [],
    s_url_preview_image: '',
    o_scl_mm_poster: new O_vec2(471), 
    o_scl_px_image_original: new O_vec2(),
    o_img: null,
    n_ratio_image_o_scl_x_to_y: 1., 
    a_o_paper_format: a_o_paper_format,
    o_paper_format: a_o_paper_format[0],
    n_dots_per_inch: 300,// the more common dpi value just for the user to enter just for convinience
    n_dots_per_unit: 0, // will be calculated automatically, 
    n_mm_per_inch: 25.4, 
    // a security margin because printers cannot print all paper area on the edges
    // vec4 -> (top, right, bottom, left);
    // the default unit is always millimeter, all values have to be stored as millimeter
    // and then can get calculated to the o_unit selected by the user
    b_onevalue_only_o_thickness_mm_glue_border: true,
    b_onevalue_only_o_thickness_mm_print_border: true,
    o_thickness_mm_print_border: new O_vec4(10),
    o_thickness_mm_glue_border: new O_vec4(10),//a border that will be used for gluing or overlaying the cut out papers
    // o_scl_mm_image_and_glue_border_and_print_border// this would be the same size as the current selected o_paper_format
    o_scl_mm_paper: new O_vec2(),
    o_scl_mm_image_and_glue_border: new O_vec2(),//the actual canvas size includes glue border and image
    o_scl_mm_image: new O_vec2(),
    o_trn_mm_image_and_glue_border: new O_vec2(), 
    o_trn_mm_image: new O_vec2(),
     
    //   |   |
    // ---------
    //   |   |
    //   |img|
    //   |   |  
    // ---------
    //   |   |  
    o_el_style: null

};

window.o_state = o_state
o_state.o_el_style = document.createElement('style');
document.head.appendChild(o_state.o_el_style);
o_state.o_el_style.innerHTML = ``

let f_o_vec_px_from_unit = function(o){
    // let n_pixel_per_unit = n_dots_per_unit//
    return o.mul(
        o_state.n_dots_per_unit
    );
}

let f_o_vec_current_unit_from_mm = function(o_vec){
    let a_n = o_vec.a_n_comp.map(
        n=>{
            return f_n_converted(
                n,
                'millimeter',
                o_state.o_unit.s_name
            )
        }
    );
    let o_n_len_O_vec = {2:O_vec2, 3:O_vec3, 4:O_vec4};
    return new o_n_len_O_vec[a_n.length](a_n);

}
let f_update_all_o_scl_unit = function(){
   


    o_state.o_scl_mm_image_and_glue_border = o_state.o_paper_format.o_scl_mm.sub(
        (o_state.o_thickness_mm_print_border[1]+o_state.o_thickness_mm_print_border[3]), 
        (o_state.o_thickness_mm_print_border[0]+o_state.o_thickness_mm_print_border[2]),
    )
    o_state.o_scl_mm_image = o_state.o_scl_mm_image_and_glue_border.sub(
        (o_state.o_thickness_mm_glue_border[1]+o_state.o_thickness_mm_glue_border[3]), 
        (o_state.o_thickness_mm_glue_border[0]+o_state.o_thickness_mm_glue_border[2]),
    )


    o_state.o_trn_mm_image_and_glue_border = new O_vec2(
        //vec4(top, right, bottom, left)
        0+o_state.o_thickness_mm_print_border[3],//left
        0+o_state.o_thickness_mm_print_border[0],//top
    )
    o_state.o_trn_mm_image = new O_vec2(
        o_state.o_trn_mm_image_and_glue_border.n_x+o_state.o_thickness_mm_glue_border[3],
        o_state.o_trn_mm_image_and_glue_border.n_y+o_state.o_thickness_mm_glue_border[0],
    )
    let o_scl_mm_nor_image = o_state.o_scl_mm_image.div(
        o_state.o_paper_format.o_scl_mm
    )
    let o_scl_mm_nor_image_and_glue_border = o_state.o_scl_mm_image_and_glue_border.div(
        o_state.o_paper_format.o_scl_mm
    )

    let o_trn_mm_nor_image_and_glue_border = o_state.o_trn_mm_image_and_glue_border.div(
        o_state.o_paper_format.o_scl_mm
    )
    let o_trn_mm_nor_image = o_state.o_trn_mm_image.div(
        o_state.o_paper_format.o_scl_mm
    )


//     // var widthInPixels = widthInMM * mmToInches * dpi;
// // var heightInPixels = heightInMM * mmToInches * dpi;
//     let o_scl_window = new O_vec2(window.innerWidth, window.innerHeight);

//     // Calculate the maximum possible size of a canvas

//     o_state.o_scl_px_canvas = o_state.o_scl_unit_canvas.mul(
//         (1./o_state.n_mm_per_inch)*o_state.n_dpi
//     );

//     let o_canvases = o_state.o_scl.div(
//         o_state.o_scl_unit_canvas_image
//     ).ceil();
    
//     let n_factor_x = window.innerWidth / (o_canvases.n_x*o_state.o_scl_px_canvas.n_x);
//     let n_factor_y = window.innerWidth / (o_canvases.n_y*o_state.o_scl_px_canvas.n_y);
//     let n_factor_min = Math.min(n_factor_x, n_factor_y);
//     let n_factor_security = 0.05;
//     let n_factor = n_factor_min-n_factor_security;
//     n_factor*=1.5;

    o_state.o_el_style.innerHTML = `
    @media print {
        /* Hide everything first */

        body * {
            visibility: hidden; /* Hide everything in body by default when printing */
        }
        canvas, canvas * {
            visibility: visible; /* Make only canvas visible */
        }
        canvas {
            width: ${o_state.o_scl_mm_image_and_glue_border.n_x}mm !important; /* Width for print */
            height: ${o_state.o_scl_mm_image_and_glue_border.n_y}mm !important; /* Height for print */
            /* You might need to adjust other styles for print as well */
        }
        .a_o_canvas canvas {
            page-break-before: always; /* Force page break before each canvas */
        }

    }
    /* CSS for screen display */
    @media screen {
        body {
            text-align: center;
            margin-top: 20px;
        }
    }
    .a_o_canvas{
        /*
        position:fixed; 
        top:0;
        left: 0; 
        width: 100vw;
        height: 100vh;
        z-index:-1;
        */
        display: inline-block;
        flex-wrap: wrap;
    }
    .a_o_canvas br{
        flex-basis: 100%;
        height: 0;
    }
    .canvas_preview{
        width: 10vw;
        position:relative;
    }
    .canvas_preview div{
        position:absolute;
    }
    .o_scl_mm_paper, .o_thickness_mm_print_border{
        width: 100%;
        height: 100%;
        background:white;
        border: red;
    }
    .o_scl_mm_image{
        width: ${(o_scl_mm_nor_image.n_x)*100}%;
        height: ${(o_scl_mm_nor_image.n_y)*100}%;
        background: blue;
    }
    .o_scl_mm_image_and_glue_border, .o_thickness_mm_glue_border{
        width: ${(o_scl_mm_nor_image_and_glue_border.n_x)*100}%;
        height: ${(o_scl_mm_nor_image_and_glue_border.n_y)*100}%;
        background: red;
    }

    .o_trn_mm_image_and_glue_border{
        left: ${(o_trn_mm_nor_image_and_glue_border.n_x)*100}%;
        top: ${(o_trn_mm_nor_image_and_glue_border.n_y)*100}%;
    }
    .o_trn_mm_image{
        left: ${(o_trn_mm_nor_image.n_x)*100}%;
        top: ${(o_trn_mm_nor_image.n_y)*100}%;
    }
    `
}

let f_update_a_o_canvas = function(){

    // let o_div_a_o_canvas = document.querySelector('.a_o_canvas');
    // o_div_a_o_canvas.innerHTML = '';

    // for(let n_idx_canvas = 0; n_idx_canvas < o_canvases.n_x*o_canvases.n_y; n_idx_canvas+=1){
    //     let o_canvas = document.createElement('canvas');
    //     o_canvas.width = o_state.o_scl_px_canvas.n_x;
    //     o_canvas.height = o_state.o_scl_px_canvas.n_y;
    //     o_canvas.style.width = o_state.o_scl_px_canvas.n_x*n_factor+'px'
    //     o_canvas.style.height = o_state.o_scl_px_canvas.n_y*n_factor+'px'
    //     let o_ctx = o_canvas.getContext('2d');

    //     let o_coordinates = o_canvases.from_idx(n_idx_canvas);
    //     let o_trn_mm = o_coordinates.mul(o_state.o_scl_unit_canvas_image);
    //     let o_trn_px = o_pixel_per_mm.mul(o_trn_mm);
    //     let o_scl_px_canvas_image = o_pixel_per_mm.mul(o_state.o_scl_unit_canvas_image);
    //     let o_trn_px_canvas_image = o_state.o_scl_unit_canvas_stickhelpborder.clone();
    //     // dashed cut guiding lines

    //     let n_px_dashlength = 5*o_pixel_per_mm.n_x;
    //     let n_px_dash_margin = n_px_dashlength
    //     let n_px_linewidth = parseInt(2*o_pixel_per_mm.n_x);
    //     let n_px_linelength = o_state.o_scl_px_canvas.n_y-o_scl_px_canvas_image.n_y;
    //     o_ctx.strokeStyle = `red`;
    //     o_ctx.beginPath();
    //     o_ctx.setLineDash([n_px_dashlength, n_px_dash_margin]);
    //     o_ctx.moveTo( o_state.o_scl_px, o_scl_px_canvas_image.n_y);
    //     o_ctx.lineTo(0, o_state.o_scl_px_canvas.n_y);
    //     o_ctx.lineWidth = n_px_linewidth;
    //     o_ctx.stroke();
    //     o_ctx.beginPath();
    //     o_ctx.moveTo(o_scl_px_canvas_image.n_x, o_scl_px_canvas_image.n_y);
    //     o_ctx.lineTo(o_scl_px_canvas_image.n_x, o_state.o_scl_px_canvas.n_y);
    //     o_ctx.lineWidth = n_px_linewidth;
    //     o_ctx.stroke();
    //     o_ctx.beginPath();
    //     o_ctx.moveTo(o_scl_px_canvas_image.n_x, o_scl_px_canvas_image.n_y);
    //     o_ctx.lineTo(o_state.o_scl_px_canvas.n_x, o_scl_px_canvas_image.n_y);
    //     o_ctx.lineWidth = n_px_linewidth;
    //     o_ctx.stroke();

    //     let o_scl_px_canvas_image_current = o_pixel_per_mm.mul(o_state.o_scl_unit_canvas_image);
    //     if(o_coordinates.n_y < o_canvases.n_y-1){

            
    //         // draw sticky help
    //         //<i class="fa-solid fa-scissors"></i>
    //         //<i class="fa-solid fa-ban"></i>
    //         let s_char_fa_scissors = `\uf0c4`;
    //         let s_char_fa_ban = `\uf05e`;
    //         let s_char_fa_thumbsup = `\uf164`;
    //         // let s_text = ` ${s_char_fa_ban} Do Not Cut ${s_char_fa_scissors} `;
    //         let s_text = ` Do Not Cut ${s_char_fa_thumbsup} `;
    //         let n_pixel_font_size = parseInt(o_pixel_per_mm.n_x*9) 
    //         o_ctx.font = `${n_pixel_font_size}px "Font Awesome 5 Free"`; // Set the desired font
    //         o_ctx.fillStyle = "red";
    //         let o_text = o_ctx?.measureText('O');
    //         let n_idx_letter = 0;

            
    //         for(let n_y = 0; n_y < o_state.o_scl_px_canvas.n_y; n_y+=n_pixel_font_size){
    //             for(let n_x = 0; n_x < o_state.o_scl_px_canvas.n_x ; n_x+=o_text.width){
    //                 n_idx_letter = (n_idx_letter+1) % s_text.length;
    //                 o_ctx.fillText(
    //                     // '\uf087',
    //                     s_text[n_idx_letter],
    //                     n_x, 
    //                     n_y
    //                     );
    //             }
    //         }

            
    //     }


    //     o_ctx.drawImage(
    //         o_state.o_img,
    //         // Coordinates and size of the section of the image you want to draw
    //         o_trn_px.n_x,
    //         o_trn_px.n_y,
    //         o_scl_px_canvas_image.n_x,
    //         o_scl_px_canvas_image.n_y,
    //         // Coordinates and size of where you want to place the image on the canvas
    //         0,
    //         0,
    //         o_scl_px_canvas_image.n_x,
    //         o_scl_px_canvas_image.n_y
    //     );

    //     o_div_a_o_canvas?.appendChild(o_canvas)
    //     if((n_idx_canvas+1)%o_canvases.n_x == 0){
    //         o_div_a_o_canvas?.appendChild(document.createElement('br'))
    //     }
    // }

}
let f_o_jsh_label = function(){
    return {
        s_tag: "label", 
        class: "pr-2"
    }
}
let o_js__a_o_file = null;
let o_js__preview_image = null;
let o_js__everything = null;
let o_js__o_scl_mm_poster = null;
let o_js__n_dots_per_unit = null; 
let o_js__n_dots_per_inch = null;
let o_js__a_o_unit = null;
let o_js__thicknesses = null;


let o_js__canvas_preview = null;
let o_js__a_o_paper_format = null;

o_js__thicknesses = {
    f_o_jsh: function(){
        return {
            a_o: [
                [
                    {s_prop: 'o_thickness_mm_print_border', s_text: 'print border margin (security margin)',},
                    {s_prop: 'o_thickness_mm_glue_border', s_text: 'glue border margin (a help for gluing the paprs together)'},
                ].map(
                    o=>{
                        let b_onevalue_only = o_state[`b_onevalue_only_${o.s_prop}`];
                        let o_js__values = {
                            f_o_jsh: function(){
                                return {
                                    a_o: [
                                        ...Array(
                                            (b_onevalue_only) ? 1: 4
                                        ).fill(0).map((n,n_idx)=>{
                                            return {
                                                s_tag: "input", 
                                                type: "number", 
                                                min: 0, 
                                                oninput: (o_e)=>{
                                                    let n = parseFloat(o_e.target.value)
                                                    let n_mm = f_n_converted(
                                                        n, 
                                                        o_state.o_unit.s_name, 
                                                        'millimeter',
                                                    );

                                                    if(b_onevalue_only){
                                                        o_state[o.s_prop] = new O_vec4(
                                                            n_mm
                                                        )
                                                    }else{
                                                        o_state[o.s_prop][n_idx] = n_mm
                                                    }
                                                    f_update_all_o_scl_unit()
                                                },
                                                value: f_n_converted(
                                                    o_state[o.s_prop][n_idx], 
                                                    'millimeter',
                                                    o_state.o_unit.s_name, 
                                                ),
                                            }
                                        })
                                    ]
                                }
                            }
                        }
                        return {
                            a_o: [
                                {
                                    class: o.s_prop,
                                    style: 'display:inline-block;width:1rem;height:1rem'
                                },
                                Object.assign(
                                    f_o_jsh_label(), 
                                    {innerText: o.s_text}
                                ), 
                                o_js__values,
                                {
                                    class: "clickable", 
                                    onclick: ()=>{o_state[`b_onevalue_only_${o.s_prop}`] = !o_state[`b_onevalue_only_${o.s_prop}`];o_js__thicknesses._f_render() },
                                    a_o: [
                                        Object.assign(
                                            f_o_jsh_label(), 
                                            {innerText: 'separate values for each side'}
                                        ), 
                                        {
                                            s_tag: 'i',
                                            class:`fa-regular fa-square${(o_state[`b_onevalue_only_${o.s_prop}`])?'-check': ''}`
                                        }
                                    ]
                                }
                            ]
                        }
                    }
                )
            ]
        }
    }
}


o_js__a_o_paper_format = {
    f_o_jsh: function(){
        return {
            a_o: [
                Object.assign(
                    f_o_jsh_label(), 
                    {innerText: 'Paper format'}
                ), 
                {
                    f_o_jsh: function(){
                        let o = f_o_jsh__select(
                            o_state,
                            'o_paper_format',
                            o_state.a_o_paper_format,
                            (o)=>{
                                let n_x = f_n_converted(o.o_scl_mm.n_x, 'millimeter', o_state.o_unit.s_name);
                                let n_y = f_n_converted(o.o_scl_mm.n_y, 'millimeter', o_state.o_unit.s_name);
                                return `${o.s_name} - ${n_x.toFixed(2)}*${n_y.toFixed(2)} (${o_state.o_unit.s_name})`
                            }
                        );
                        let f_oninput_original = o.oninput;
                        return Object.assign(
                            o, 
                            {
                                oninput: function(){
                                    // console.log('input was triggered'), 
                                    f_oninput_original(...arguments)

                                    o_js__n_dots_per_unit._f_render();
                                    o_js__n_dots_per_inch._f_render();
                                    o_js__canvas_preview._f_render();
                                    
                                }
                            }
                        )
                    }
                },
            ]
        }
    }
}

o_js__a_o_unit = {
    f_o_jsh: function(){
        return {
            a_o: [
                Object.assign(
                    f_o_jsh_label(), 
                    {innerText: 'Unit'}
                ), 
                {
                    f_o_jsh: function(){
                        let o = f_o_jsh__select(
                            o_state,
                            'o_unit',
                            o_state.a_o_unit,
                            (o)=>{return o.s_name}
                        );
                        let f_oninput_original = o.oninput;
                        return Object.assign(
                            o, 
                            {
                                oninput: function(){
                                    // console.log('input was triggered'), 
                                    f_oninput_original(...arguments)

                                    o_js__n_dots_per_unit._f_render();
                                    o_js__n_dots_per_inch._f_render();
                                    o_js__a_o_paper_format._f_render();
                                    o_js__thicknesses._f_render();
                                    o_js__o_scl_mm_poster._f_render();
                                }
                            }
                        )
                    }
                },
            ]
        }
    }
}
o_js__n_dots_per_unit = {
    f_o_jsh:function(){
        return {
            a_o: [
                Object.assign(
                    f_o_jsh_label(), 
                    {innerText: 'Dots per Unit (dpu)'}
                ), 
                {
                    s_tag: "input",
                    type: "number",
                    min: 1,
                    oninput: function(o_e){
                        o_state.n_dots_per_unit = o_e.target.value
                        o_state.n_dots_per_inch = f_n_converted(
                            o_state.n_dots_per_unit, 
                            o_state.o_unit.s_name, 
                            'inch'
                        );
                        o_js__n_dots_per_inch._f_render()
                    }, 
                    value: o_state.n_dots_per_unit
                }
            ]
        }
    }
}


let f_update_n_dots_per_unit = function(){
    let o_unit__inch = o_state.a_o_unit.find(o=>o.s_name == 'inch');
    let n_factor = o_state.o_unit.n_millimeter / o_unit__inch.n_millimeter
    o_state.n_dots_per_unit = o_state.n_dots_per_inch * n_factor;
}
o_js__n_dots_per_inch = {
    f_o_jsh:function(){
        return {
            a_o: [
                Object.assign(
                    f_o_jsh_label(), 
                    {innerText: 'Dots per Inch (DPI)'}
                ), 
                {
                    s_tag: "input",
                    type: "number",
                    min: 1,
                    oninput: function(o_e){

                        o_state.n_dots_per_inch = o_e.target.value
                        o_state.n_dots_per_unit = f_n_converted(
                            o_state.n_dots_per_unit, 
                            'inch',
                            o_state.o_unit.s_name, 
                        );
                        o_js__n_dots_per_inch._f_render()


                    }, 
                    value: o_state.n_dots_per_inch
                }
            ]
        } 

    }
}


o_js__a_o_file = {
    f_o_jsh: function(){
        return {
            a_o: [
                ...o_state.a_o_file.map(o_file=>{
                    return {
                        class: "o_file",
                        a_o: [
                            {
                                innerText: o_file.s_name
                            },
                            {
                                b_render: o_file.s_mime_type.startsWith('image/'), 
                                style: `background-image: url(${o_file.v_data})`,
                                class: "o_file-bgimg"
                                // src: o_file.v_data,
                                // s_tag: 'img'
                            },
                        ]
                    }
                })
            ]
        }
    }
};

    o_js__preview_image = {
        f_o_jsh: function(){
            return {
                class: "image-container", 
                a_o: [
                    {
                        s_tag: 'img', 
                        src: o_state.s_url_preview_image, 
                        style: [
                            // `position: fixed`,
                            'width: 100px', 
                            'height: auto' 
                            // `width: ${o_state.o_scl.n_x}${o_state.s_unit}`,                            
                            // `height: ${o_state.o_scl.n_y}${o_state.s_unit}`                            
                        ].join(';')

                    }
                ]
            }
        }
    }
    o_js__o_scl_mm_poster = {
        f_o_jsh: ()=>{
            let o_s_axis_o_js= {
                o_js__n_x: null,
                o_js__n_y: null
            }
            let f_o_js__n_axis = function(
                s_axis
            ){
                let s_axis_other = (s_axis == 'n_x')?'n_y': 'n_x';
                return {
                    f_o_jsh: ()=>{
                        return {
                            a_o: [
                                Object.assign(
                                    f_o_jsh_label(), 
                                    {
                                        innerText: `${(s_axis == 'n_x') ? 'width': 'height'} ${o_state.o_unit.s_name}`
                                    }
                                ),
                                {
                                    s_tag: 'input', 
                                    type: "number", 
                                    oninput: function(o_e){
                                        let n = parseFloat(o_e.target.value);
                                        let n_mm = f_n_converted(
                                            n, 
                                            o_state.o_unit.s_name,
                                            'millimeter', 
                                        );

                                        o_state.o_scl_mm_poster[s_axis] = n_mm
                                        
                                        let n_ratio = o_state.o_scl_px_image_original[s_axis_other] / o_state.o_scl_px_image_original[s_axis];
                                        o_state.o_scl_mm_poster[s_axis_other] = o_state.o_scl_mm_poster[s_axis]*n_ratio;        
                                        console.log(n_ratio)
                                        o_s_axis_o_js[`o_js__${s_axis_other}`]._f_render();
                                        o_js__preview_image._f_render();
                                        f_update_a_o_canvas()
                                    }, 
                                    value: f_n_converted(
                                        o_state.o_scl_mm_poster[s_axis], 
                                        'millimeter', 
                                        o_state.o_unit.s_name,
                                    )
                                    
                                },  
                            ]
                        }
                    }
                } 
                
            }
            
            o_s_axis_o_js.o_js__n_x = f_o_js__n_axis('n_x')
            o_s_axis_o_js.o_js__n_y = f_o_js__n_axis('n_y')

            return {
                a_o:[
                    Object.assign(
                        f_o_jsh_label(), 
                        {
                            innerText: `Image size (pixels)`
                        }
                    ),
                    Object.assign(
                        f_o_jsh_label(), 
                        {
                            innerText: `width`
                        }
                    ),
                    {
                        s_tag: "input", 
                        type: 'number', 
                        readonly: 'readonly', 
                        value: o_state?.o_img?.width, 
                    },
                    Object.assign(
                        f_o_jsh_label(), 
                        {
                            innerText: `height`
                        }
                    ),
                    {
                        s_tag: "input", 
                        type: 'number', 
                        readonly: 'readonly', 
                        value: o_state?.o_img?.height, 
                    },
                    Object.assign(
                        f_o_jsh_label(), 
                        {
                            innerText: `Poster size`
                        }
                    ),
                    o_s_axis_o_js.o_js__n_x, 
                    o_s_axis_o_js.o_js__n_y
                ]
            }
        }
    }
    o_js__canvas_preview = {
        f_o_jsh: function(){
            return {
                class: "canvas_preview", 
                style: [
                    `aspect-ratio: 1/${o_state.o_paper_format.o_scl_mm.n_y/o_state.o_paper_format.o_scl_mm.n_x}`
                ].join(';'),
                a_o: [
                    {
                        class: 'o_scl_mm_paper',
                    }, 
                    {
                        class: "o_scl_mm_image_and_glue_border o_trn_mm_image_and_glue_border",
                    },
                    {
                        class: "o_scl_mm_image o_trn_mm_image",
                    },
                ]
            }
        }
    }
    o_js__everything = {
        f_o_jsh: function(){
            return {
                class: "app",
                a_o:[
                    {
                        class: "fa-font only_required_to_load_font_for_using_it_on_canvas", 
                        style: "font-family: 'Font Awesome 5 Free'; font-weight: 900; visibility: hidden;"
                    },

                    {
                        class: "a_o_canvas",
                    },
                    o_js__a_o_file,
                    o_js__a_o_paper_format,
                    o_js__preview_image,
                    o_js__a_o_unit,
                    o_js__canvas_preview,
                    o_js__thicknesses,
                    o_js__n_dots_per_unit,
                    o_js__n_dots_per_inch,
                    o_js__o_scl_mm_poster,
                    {
                        class: "inputs", 
                        a_o:[
                            {
                                s_tag: 'input', 
                                type: "file", 
                                onchange: function(){
                                    const a_o_js_file = this.files; 
                                    for (let n_i = 0; n_i < a_o_js_file.length; n_i++) {
                                      const o_js_file = a_o_js_file[n_i];
   
                                      const o_reader = new FileReader();
                                
                                        o_reader.onload = function(o_e) {
                                            let v_data_o_js_file = o_e.target.result;
                                            let o_file = new O_file(
                                                o_js_file, 
                                                v_data_o_js_file,
                                                o_js_file.type, 
                                                o_js_file.name
                                            );
                                            o_state.o_img = new Image();
                                            o_state.o_img.onload = function(){
                                                o_state.o_scl_px_image_original = new O_vec2(o_state.o_img.width, o_state.o_img.height);
                                                o_state.n_ratio_image_o_scl_x_to_y = o_state.o_img.width / o_state.o_img.height;
                                                o_state.o_scl_mm_poster.n_y = o_state.o_scl_mm_poster.n_x*(1./o_state.n_ratio_image_o_scl_x_to_y);
                                                o_js__preview_image._f_render()
                                                o_js__o_scl_mm_poster._f_render()
                                                window.o_js__preview_image = o_js__preview_image
                                                f_update_a_o_canvas();

                                            }
                                            
                                            window.o_js__preview_image = o_js__preview_image

                                            o_state.o_img.src = v_data_o_js_file
                                            o_state.s_url_preview_image = v_data_o_js_file
                                            o_state.a_o_file = [o_file]//.push(o_file);
                                            o_state.o_file = o_file
                                            o_js__a_o_file._f_render()

                                        }
                                        if (o_js_file.type.startsWith('image/')) {
                                            o_reader.readAsDataURL(o_js_file);
                                        }
                                        if (o_js_file.type.startsWith('text/')) {
                                            o_reader.readAsText(o_js_file);
                                        }

                                        let o_s_ready_state_n = {
                                            EMPTY: 0, 
                                            LOADING: 1, 
                                            DONE: 2, 
                                        }

                                        if(o_reader.readyState == o_s_ready_state_n.EMPTY){
                                            o_reader.readAsArrayBuffer(o_js_file);
                                        }
                                        
                                    }

                                }
                            },
   
                        ]
                    }
                ]
            }
        }
    }

let o = f_o_html__and_make_renderable(
 o_js__everything
);
document.body.appendChild(o)
//after init
f_update_n_dots_per_unit()
o_js__n_dots_per_unit._f_render()

f_update_all_o_scl_unit()