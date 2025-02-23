// =========================================================================================================
// ========================================     mnemonic_shape.js     ======================================
// =========================================================================================================
"use strict";

const MNEMONIC_ARG      = "mnemonic";
const WORD_INDEX_ARG    = "word_index";
const PREVIOUS_NODE_ARG = "previous_node";

class MnemonicShape extends BallShape {
	constructor( renderer, data ) {	
        super( renderer, data );
		
        this.mnemonic   = ( data[MNEMONIC_ARG]   != undefined ) ? data[MNEMONIC_ARG]   : "";
        this.word_index = ( data[WORD_INDEX_ARG] != undefined ) ? data[WORD_INDEX_ARG] : -1;		
		this.material   = ( data[MATERIAL_ARG]   != undefined ) ? data[MATERIAL_ARG]   : MATERIALS[WHITE];
	} // constructor()  
	
	hasMetadata() {		
		return ( this.mnemonic != "" && this.word_index != -1 );
    } // hasMetadata()
    
    setMetadataValue( metadata_field_name, value ) {
        let metadata = this.getGltfMetaData();
        metadata["extras"][metadata_field_name] = value; 
    } // setMetadataValue()

    // https://doc.babylonjs.com/features/featuresDeepDive/mesh/creation/set/sphere
    // https://doc.babylonjs.com/features/featuresDeepDive/mesh/transforms/center_origin/position}
    draw() {       
        this.shape_mesh = BABYLON.MeshBuilder.CreateSphere
                          ( this.id, { "segments": 4, "diameter": this.size }, this.scene );         

        if ( this.hasMetadata() ) {
			let metadata = this._getGltfMetaData();
			metadata["extras"] =  { [MNEMONIC_ARG]:   this.mnemonic, 
                                    [WORD_INDEX_ARG]: this.word_index
                                  };
        }
		
        this.shape_mesh.material = this.material;        
        this.shape_mesh.position = this.origin;

        this.renderer.addObject( this.shape_mesh );
        
        return this.shape_mesh;
    } // draw()
} // MnemonicShape class