// ===================================================================================================
// ======================================     base_shape.js     ======================================
// ===================================================================================================
"use strict";

const PARENT_REP_ARG          = "parent_rep";
const ORIGIN_ARG              = "origin";
const SIZE_ARG                = "size";
const COLOR_ARG               = "color";
const MATERIAL_ARG            = "material";

const WIREFRAME_ARG           = "wireframe";
const WIREFRAME_COLOR_ARG     = "wireframe_color";
const DASHED_ARG              = "dashed";
const ALPHA_FACES_ARG         = "alpha faces";
const ALPHA_FACES_MAT_ARG     = "alpha faces material";

const CENTROID_ARG            = "centroid";
const MIDDLE_ARC_POINT_ARG    = "middle arc point";
const FACE_COUNT_ARG          = "face count";
const GOLDBERG_POLYHEDRON_ARG = "goldberd plyhedron";
const POINTS_ARG              = "points";

const NODE_SHAPE_ARG          = "node_shape";
const NODE_SHAPE_CUBE         = "cube shape";
const NODE_SHAPE_SPHERE       = "sphere shape";
const NODE_SHAPE_ISOCAHEDRON  = "isocahedron shape";

const ARGS_ARG                = "args";

class BaseShape {
    static InstanceCounts = {};

	constructor( renderer, data ) {	
		this.shape_type = this.constructor.name.replace("Shape", "");
		this.renderer   = renderer;	
		this.scene      = this.renderer.getScene();
		this.id         = this.getId();
 
		this.data       = ( data != undefined ) ? data : {};
		this.parent_rep = ( this.data[PARENT_REP_ARG] != undefined ) ? this.data[PARENT_REP_ARG] : undefined;

		this.origin     = ( data[ORIGIN_ARG]   != undefined ) ? data[ORIGIN_ARG] : new BABYLON.Vector3.Zero();
		this.size       = ( data[SIZE_ARG]     != undefined ) ? data[SIZE_ARG] : .05;

		this.color      = ( data[COLOR_ARG]    != undefined ) ? data[COLOR_ARG] : new BABYLON.Color3(0.5, 0.5, 0.5); // Grey 50%
		
		this.material   = ( data[MATERIAL_ARG] != undefined ) ? data[MATERIAL_ARG] : MATERIALS[YELLOW];

		this.wireframe       = ( data[WIREFRAME_ARG] != undefined )       ? data[WIREFRAME_ARG] : false;
        this.wireframe_color = ( data[WIREFRAME_COLOR_ARG] != undefined ) ? data[WIREFRAME_COLOR_ARG] : RED;
		this.dashed          = ( data[DASHED_ARG] != undefined )          ? data[DASHED_ARG] : false;

		this.alpha_faces_material = ( data[ALPHA_FACES_MAT_ARG] != undefined ) ? data[ALPHA_FACES_MAT_ARG] : MATERIALS[RED];

        this.centroid_point = ( data[CENTROID_ARG] != undefined ) ? data[CENTROID_ARG] : new BABYLON.Vector3.Zero();		

		this.points    = ( data[POINTS_ARG]   != undefined ) ? data[POINTS_ARG ]  : [];
		this.args      = ( data[ARGS_ARG]     != undefined ) ? data[ARGS_ARG]     : {};

		this.shape_mesh = undefined;
	} // constructor()

	getShapeMesh() {		
		return this.shape_mesh;
    } // getShapeMesh()

	_getGltfMetaData() {
		if ( this.shape_mesh.metadata == undefined ) { 
			this.shape_mesh.metadata = { "gltf": {} };
		};

		return this.shape_mesh.metadata["gltf"];
    } // _getGltfMetaData()
	
	hasMetadata() {		
		return false;
    } // hasMetadata()

	doEdgeRendering( edges_object, color ) {	
		let edge_rendering = THEMES[this.renderer.getParameter(THEME_PARAM)][EDGE_RENDERING];
        if ( edge_rendering == undefined ) edge_rendering = false;
		if ( edge_rendering ) {
			// Draw edges with Thickness if 'LINK_THICKNESS' is defined on current 'Theme'
			let edge_thickness = THEMES[this.renderer.getParameter(THEME_PARAM)][LINK_THICKNESS];
            if ( edge_thickness == undefined ) edge_thickness = 1.0;

			edges_object.enableEdgesRendering();
			edges_object.edgesWidth = edge_thickness;
			let edges_color = new BABYLON.Color4( color.r, color.g, color.b, 1);
			edges_object.edgesColor = edges_color;
		}
    } // doEdgeRendering()

	draw() {
        this.shape_mesh = undefined;
        
		// https://babylonjsguide.github.io/intermediate/Polyhedra_Shapes#provided-polyhedron-types					  
		this.shape_mesh = BABYLON.MeshBuilder.CreatePolyhedron( this.id, { type: 1, size: this.size }, this.scene );
		this.shape_mesh.enableEdgesRendering();
		this.shape_mesh.edgesWidth = 0.4;
		this.shape_mesh.edgesColor = new BABYLON.Color4(0, 0, 0, 1);

        this.shape_mesh.material = this.material;        
        this.shape_mesh.position = this.origin;

        this.renderer.addObject( this.shape_mesh );
        
        return this.shape_mesh;
    } // draw()

	static ResetObjectCount() {
		console.log(">> --- BaseShape.ResetObjectCount " +  this.name );
		let keys = Object.keys(BaseShape.InstanceCounts);
		for ( let i=0; i< keys.length; i++ ){
			BaseShape.InstanceCounts[keys[i]] = 0;
		}
	} // ResetObjectCount()

    getId() {
		if ( this.id != undefined ) return this.id;

		if ( BaseShape.InstanceCounts[this.shape_type] == undefined ) {
			BaseShape.InstanceCounts[this.shape_type] = 0;
		}

		BaseShape.InstanceCounts[this.shape_type]++;

		const pad_with_zero = (n) => (n < 10 ? ('0'+n).toString() : n.toString());

		this.id = this.shape_type.toLowerCase() + "_" + pad_with_zero( BaseShape.InstanceCounts[this.shape_type] );
		return this.id;
	} // getId();
} // BaseShape class